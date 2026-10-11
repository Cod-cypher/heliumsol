/// <reference types="vite/client" />

declare module '*.md' {
  const mod: import('./content/blog-types').PostModule;
  export default mod;
}

declare module '*.md?body' {
  const html: string;
  export default html;
}
