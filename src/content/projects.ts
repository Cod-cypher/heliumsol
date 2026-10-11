/**
 * Concept examples shown in the homepage showcase and on /case-studies.
 *
 * These are illustrations of the kinds of builds HeliumSol does. They are not
 * client projects: there are no client names, no live URLs and no result
 * claims, and every card says so. Real case studies replace them here, with
 * the client's permission, when there are some to publish.
 */

import type { Project } from '../types';

export const CONCEPT_PROJECTS: Project[] = [
  {
    id: 'clinic-booking-site',
    title: 'Clinic website with online booking',
    subtitle: 'Concept example · Website + booking',
    description:
      'A fast, mobile-first site for a healthcare practice with an appointment booking flow and clear service pages.',
    category: 'Website',
    tech: ['React', 'Node', 'Booking'],
    color: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-700',
      border: 'border-amber-100',
      accent: 'bg-amber-500',
    },
    mockupType: 'dashboard',
  },
  {
    id: 'headless-storefront',
    title: 'Headless e-commerce storefront',
    subtitle: 'Concept example · E-commerce',
    description:
      'A storefront built on a headless commerce backend with a short checkout, so the shop can change its design without touching its catalogue.',
    category: 'E-Commerce',
    tech: ['Next.js', 'Shopify', 'Stripe'],
    color: {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      accent: 'bg-emerald-500',
    },
    mockupType: 'commerce',
  },
  {
    id: 'finance-dashboard',
    title: 'Finance analytics web app',
    subtitle: 'Concept example · Web app',
    description:
      'A full-stack dashboard that pulls account data into one place with role-based access and exportable reports.',
    category: 'Web App',
    tech: ['React', 'FastAPI', 'Postgres'],
    color: {
      bg: 'bg-teal-50/70',
      text: 'text-teal-700',
      border: 'border-teal-100',
      accent: 'bg-teal-500',
    },
    mockupType: 'analytics',
  },
  {
    id: 'support-automation',
    title: 'Support chatbot with n8n automations',
    subtitle: 'Concept example · Automation + chatbot',
    description:
      'An AI support assistant grounded in a knowledge base, with n8n workflows that log enquiries, route leads and notify the team.',
    category: 'Automation + AI',
    tech: ['n8n', 'OpenAI', 'Slack'],
    color: {
      bg: 'bg-violet-50/70',
      text: 'text-violet-700',
      border: 'border-violet-100',
      accent: 'bg-violet-500',
    },
    mockupType: 'canvas',
  },
];
