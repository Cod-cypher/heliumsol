/**
 * A deliberately small frontmatter parser: enough for blog post headers,
 * with no YAML dependency.
 *
 * Supports `key: value`, single- or double-quoted strings, `true`/`false`,
 * inline arrays `[a, b, "c d"]` and block lists (`- item` lines). No nesting.
 * Throws with the file name on anything it does not understand, so a typo
 * fails the build rather than silently dropping a field.
 */

export interface Parsed {
  data: Record<string, string | boolean | string[]>;
  body: string;
}

function unquote(raw: string): string {
  const v = raw.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function scalar(raw: string): string | boolean {
  const v = raw.trim();
  if (v === 'true') return true;
  if (v === 'false') return false;
  return unquote(v);
}

function inlineArray(raw: string): string[] {
  const inner = raw.trim().slice(1, -1).trim();
  if (!inner) return [];
  // Split on commas outside quotes.
  const out: string[] = [];
  let cur = '';
  let quote: string | null = null;
  for (const ch of inner) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ',') {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export function parseFrontmatter(source: string, file: string): Parsed {
  const text = source.replace(/\r\n?/g, '\n');
  if (!text.startsWith('---\n')) {
    throw new Error(`${file}: missing frontmatter (file must start with ---)`);
  }
  const end = text.indexOf('\n---', 4);
  if (end === -1) throw new Error(`${file}: unterminated frontmatter`);

  const block = text.slice(4, end);
  const body = text.slice(end + 4).replace(/^\n/, '');
  const data: Parsed['data'] = {};

  const lines = block.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const m = line.match(/^([A-Za-z][A-Za-z0-9_]*):(.*)$/);
    if (!m) throw new Error(`${file}: cannot parse frontmatter line ${i + 1}: "${line}"`);
    const key = m[1];
    const rest = m[2].trim();

    if (rest === '') {
      // Block list follows.
      const items: string[] = [];
      while (i + 1 < lines.length && /^\s*-\s/.test(lines[i + 1])) {
        items.push(unquote(lines[++i].replace(/^\s*-\s/, '')));
      }
      data[key] = items;
    } else if (rest.startsWith('[')) {
      if (!rest.endsWith(']')) throw new Error(`${file}: unterminated array for "${key}"`);
      data[key] = inlineArray(rest);
    } else {
      data[key] = scalar(rest);
    }
  }

  return { data, body };
}
