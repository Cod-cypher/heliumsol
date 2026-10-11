/**
 * Blog categories. A post's `category` frontmatter must match a slug here;
 * the build fails otherwise. A category page exists only once it has a post.
 */

export interface CategoryDef {
  slug: string;
  name: string;
  description: string;
}

export const CATEGORY_DEFS: CategoryDef[] = [
  {
    slug: 'ai-chatbots-and-assistants',
    name: 'AI chatbots and assistants',
    description:
      'What AI chatbots and assistants cost, how they differ, how to ground them in your own knowledge base, and when a business should and should not use one.',
  },
  {
    slug: 'web-and-mobile-development',
    name: 'Web and mobile development',
    description:
      'Website performance, Core Web Vitals, full-stack architecture and the native-versus-cross-platform decisions behind a mobile app.',
  },
  {
    slug: 'automation',
    name: 'Workflow automation',
    description: 'Practical n8n and workflow automation: what to automate first, how the pieces connect, and what to leave alone.',
  },
];
