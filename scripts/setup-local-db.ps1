<#
.SYNOPSIS
  Create the local Postgres database for heliumsol and point .env at it.

.DESCRIPTION
  For running the site on this machine with `npm run dev`. The script:
    1. finds psql (PATH, then C:\Program Files\PostgreSQL\<ver>\bin)
    2. asks for the Postgres superuser password once
    3. creates the role and database if they do not exist
    4. backs up .env to .env.bak, then sets DATABASE_URL and PORT, and fills
       SESSION_SECRET if it is blank (every other line is left as it is)
    5. runs `prisma migrate deploy` to create the tables

  Re-running is safe: existing role, database and .env values are kept, and
  the password is only regenerated if the role is created fresh.

.EXAMPLE
  .\scripts\setup-local-db.ps1
  .\scripts\setup-local-db.ps1 -DbPassword "choose-your-own" -Port 4321
#>
[CmdletBinding()]
param(
  [string]$DbName = "",
  [string]$DbUser = "",
  [string]$DbPassword = "",
  [string]$PgSuperUser = "postgres",
  [string]$PgHost = "localhost",
  [int]$PgPort = 5432,
  # Ports 2659-3158 and 3189-3288 are reserved by Hyper-V on this machine, so
  # the production default of 3003 cannot bind locally. 4321 is free.
  [int]$Port = 4321
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

function Find-Psql {
  $cmd = Get-Command psql -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $candidates = Get-ChildItem "C:\Program Files\PostgreSQL\*\bin\psql.exe" -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending
  if ($candidates) { return $candidates[0].FullName }
  throw "psql.exe not found. Install PostgreSQL or add its bin folder to PATH."
}

function New-Secret([int]$bytes) {
  $buf = New-Object byte[] $bytes
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($buf)
  return ($buf | ForEach-Object { $_.ToString("x2") }) -join ""
}

function Invoke-Psql([string]$database, [string]$sql) {
  $out = & $psql -h $PgHost -p $PgPort -U $PgSuperUser -d $database -v ON_ERROR_STOP=1 -tA -c $sql
  if ($LASTEXITCODE -ne 0) { throw "psql failed: $sql" }
  return ($out | Out-String).Trim()
}

$psql = Find-Psql
Write-Host "Using $psql"

# Defaults come from the DATABASE_URL already in .env, so re-running keeps
# the same role and database; otherwise heliumsol/heliumsol.
$current = ""
if (Test-Path .env) {
  $current = ((Get-Content .env | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1) -replace '^DATABASE_URL=', '') -replace '"', ''
}
if ($current -match '^postgres(ql)?://([^:/@]+)(?::([^@]*))?@([^:/]+)(?::(\d+))?/([^?]+)') {
  if (-not $DbUser) { $DbUser = $Matches[2] }
  if (-not $DbPassword -and $Matches[3]) { $DbPassword = [Uri]::UnescapeDataString($Matches[3]) }
  if (-not $DbName) { $DbName = $Matches[6] }
}
if (-not $DbUser) { $DbUser = "heliumsol" }
if (-not $DbName) { $DbName = "heliumsol" }
Write-Host "Target: database '$DbName', role '$DbUser' on ${PgHost}:${PgPort}"

# One prompt for the superuser password; psql reads PGPASSWORD.
$secure = Read-Host "Password for Postgres user '$PgSuperUser'" -AsSecureString
$env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))

try {
  Invoke-Psql "postgres" "SELECT 1" | Out-Null
  Write-Host "Connected to Postgres at ${PgHost}:${PgPort}"

  # Role
  $roleExists = Invoke-Psql "postgres" "SELECT 1 FROM pg_roles WHERE rolname = '$DbUser'"
  if ($roleExists -eq "1") {
    Write-Host "Role '$DbUser' already exists."
    # Make sure the password in .env actually opens the role; if not, set it
    # (we are the superuser here, so this is allowed) so the two agree.
    $superPw = $env:PGPASSWORD
    $works = $false
    if ($DbPassword) {
      $env:PGPASSWORD = $DbPassword
      & $psql -h $PgHost -p $PgPort -U $DbUser -d postgres -tA -c "SELECT 1" 2>$null | Out-Null
      $works = ($LASTEXITCODE -eq 0)
      $env:PGPASSWORD = $superPw
    }
    if (-not $works) {
      if (-not $DbPassword) { $DbPassword = New-Secret 16 }
      Invoke-Psql "postgres" "ALTER ROLE `"$DbUser`" WITH LOGIN PASSWORD '$DbPassword'" | Out-Null
      Write-Host "Password for '$DbUser' did not match .env; reset it so they agree."
    }
  } else {
    if (-not $DbPassword) { $DbPassword = New-Secret 16 }
    Invoke-Psql "postgres" "CREATE ROLE `"$DbUser`" WITH LOGIN PASSWORD '$DbPassword'" | Out-Null
    Write-Host "Created role '$DbUser'."
  }

  # Database
  $dbExists = Invoke-Psql "postgres" "SELECT 1 FROM pg_database WHERE datname = '$DbName'"
  if ($dbExists -eq "1") {
    Write-Host "Database '$DbName' already exists."
  } else {
    Invoke-Psql "postgres" "CREATE DATABASE `"$DbName`" OWNER `"$DbUser`"" | Out-Null
    Write-Host "Created database '$DbName' owned by '$DbUser'."
  }
  # Prisma migrations create tables in the public schema; the owner needs it.
  Invoke-Psql $DbName "GRANT ALL ON SCHEMA public TO `"$DbUser`"" | Out-Null
}
finally {
  Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

# .env
if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
  Write-Host "Created .env from .env.example."
} else {
  Copy-Item .env .env.bak -Force
  Write-Host "Backed up .env to .env.bak."
}

$encodedPw = [Uri]::EscapeDataString($DbPassword)
$databaseUrl = "postgresql://${DbUser}:${encodedPw}@${PgHost}:${PgPort}/${DbName}?schema=public"

$lines = Get-Content .env
$seen = @{}
$lines = $lines | ForEach-Object {
  if ($_ -match '^DATABASE_URL=') { $seen.DATABASE_URL = $true; "DATABASE_URL=`"$databaseUrl`"" }
  elseif ($_ -match '^PORT=') { $seen.PORT = $true; "PORT=$Port" }
  elseif ($_ -match '^SESSION_SECRET=\s*("")?\s*$') { $seen.SESSION_SECRET = $true; "SESSION_SECRET=`"$(New-Secret 32)`"" }
  elseif ($_ -match '^SESSION_SECRET=') { $seen.SESSION_SECRET = $true; $_ }
  else { $_ }
}
if (-not $seen.DATABASE_URL) { $lines += "DATABASE_URL=`"$databaseUrl`"" }
if (-not $seen.PORT) { $lines += "PORT=$Port" }
if (-not $seen.SESSION_SECRET) { $lines += "SESSION_SECRET=`"$(New-Secret 32)`"" }
# Set-Content would write ANSI; the server reads UTF-8.
[IO.File]::WriteAllLines((Join-Path (Get-Location) ".env"), [string[]]$lines, (New-Object Text.UTF8Encoding $false))
Write-Host "Wrote DATABASE_URL (user '$DbUser', db '$DbName') and PORT=$Port to .env."

# Tables
Write-Host "Applying Prisma migrations..."
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) { throw "prisma migrate deploy failed" }
npx prisma generate | Out-Null

Write-Host ""
Write-Host "Done. Start the site with:  npm run dev"
Write-Host "Then open:                  http://localhost:$Port"
Write-Host "Create an admin login with: npm run admin -- you@example.com <password>"
