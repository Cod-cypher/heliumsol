/**
 * Blog authors. The site names no individual team members, so posts carry a
 * team byline marked up as an Organization author. Add a person here, with
 * their real name and role, when there is one to credit.
 */

export interface Author {
  key: string;
  name: string;
  role: string;
  bio: string;
  /** Page the byline links to. */
  url: string;
}

export const AUTHORS: Record<string, Author> = {
  team: {
    key: 'team',
    name: 'HeliumSol Team',
    role: 'Design, engineering and AI at HeliumSol',
    bio: 'The people who design and build the websites, mobile apps, AI chatbots and n8n automations HeliumSol ships. Everything here is drawn from project work and from sources linked in the text; nothing is a client claim.',
    url: '/about',
  },
};
