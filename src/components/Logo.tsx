/**
 * HeliumSol wordmark for the admin app and agent console: the H lettermark
 * tile from the favicon beside the name.
 */

interface LogoProps {
  className?: string;
  size?: number; // Controls the wordmark scale
  variant?: 'light' | 'dark'; // light = dark text on a light background
  withIcon?: boolean;
}

export default function Logo({ className = '', size = 28, variant = 'light', withIcon = true }: LogoProps) {
  const textColor = variant === 'light' ? 'text-[#142540]' : 'text-white';

  return (
    <div className={`inline-flex items-center gap-2 shrink-0 ${className}`}>
      {withIcon && (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          aria-hidden="true"
          className="shrink-0"
        >
          <rect width="32" height="32" rx="7" fill="#142540" />
          <path d="M10 8h3.5v6.25h5V8H22v16h-3.5v-6.25h-5V24H10Z" fill="#ffffff" />
        </svg>
      )}
      <span
        className={`font-sans font-bold tracking-tight leading-none ${textColor}`}
        style={{ fontSize: size * 0.72 }}
      >
        HeliumSol
      </span>
    </div>
  );
}
