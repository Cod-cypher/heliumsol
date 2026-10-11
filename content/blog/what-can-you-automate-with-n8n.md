---
title: "What can you automate with n8n? 12 real workflows for a growing business"
description: "What n8n is according to its documentation, twelve workflows worth building first, what AI can do inside them, and what to leave manual."
seoTitle: "What Can You Automate with n8n? 12 Real Workflows | HeliumSol"
date: 2026-10-05
category: automation
tags: [n8n automation examples, workflow automation, n8n, business automation, AI workflows]
keyword: n8n automation examples
author: team
image: /images/blog/what-can-you-automate-with-n8n.webp
imageAlt: "A flow of connected nodes from a form icon through a branch to a CRM, an email and a chat alert"
---

With n8n you can automate almost any process that moves information between the tools a business already uses: a form submission that becomes a CRM record, an email and a task; a booking that updates a calendar and sends reminders; an invoice generated from a template and filed; an inbox sorted and summarised each morning. n8n is a workflow automation tool that can be hosted by n8n or on your own server, connects to hundreds of apps and to any API, and can include AI steps that classify, extract or draft. The twelve workflows below are the ones that tend to pay for themselves first.

## What is n8n?

n8n's documentation describes it as "a fair-code licensed workflow automation tool that combines AI features with business process automation" ([n8n docs](https://docs.n8n.io/)). A workflow is built visually from nodes. The documentation puts the roles plainly: a node is "an entry point for retrieving data, a function to process data, or an exit for sending data" ([Integrations](https://docs.n8n.io/integrations/)). A trigger starts the workflow (a form submitted, an email received, a schedule), steps in the middle transform or branch, and action nodes do things in your apps.

Three facts from the documentation shape how a business should think about it:

- **Coverage.** n8n "supplies hundreds of nodes to create workflows that link multiple products," and for anything without a node, "you can still use the HTTP Request node" to call its API ([Integrations](https://docs.n8n.io/integrations/)).
- **Where it runs.** "n8n offers two primary deployment options: n8n Cloud (fully-managed) and Self-hosted (deploy on your own infrastructure)." The self-hosted Community edition is free and "includes almost the complete feature set of n8n" ([Choose how to use n8n](https://docs.n8n.io/choose-n8n/), [Compare editions](https://docs.n8n.io/deploy/host-n8n/community-edition-features/)). n8n's own pricing page lists its Starter cloud plan at 20€ per month billed annually ([n8n pricing](https://n8n.io/pricing/)).
- **AI inside workflows.** n8n lets you "build AI-powered workflows in n8n with LLM providers, agents, tools, memory, and MCP servers," connecting providers such as OpenAI, Anthropic and Google ([Integrate AI](https://docs.n8n.io/build/integrate-ai/)).

## Twelve workflows worth building first

Each is written as trigger, steps, outcome, so you can picture it against your own tools.

### 1. Lead intake

**Trigger:** a website form, a chatbot capture, or a new email to sales. **Steps:** create or update the contact in the CRM, send an acknowledgement, post a summary to the team's chat channel, create a follow-up task due within your response standard. **Outcome:** no lead sits unseen, and nobody copies details between tools. This is the workflow behind HeliumSol's [lead generation chatbot](/lead-generation-chatbot).

### 2. Booking sync

**Trigger:** a new appointment in your scheduling tool. **Steps:** add it to the shared calendar, update the customer record, send a confirmation, schedule reminders at the intervals you choose. **Outcome:** one booking, every system updated, reminders without a person remembering to send them.

### 3. Quote and invoice generation

**Trigger:** a deal moves to "won", or a job is marked complete. **Steps:** fill a document template with the deal's details, create the invoice in your accounting tool, email it, file a copy in the right folder. **Outcome:** invoices go out the day the work finishes.

### 4. Inbox triage

**Trigger:** a new email in a shared inbox. **Steps:** an AI step classifies it (enquiry, support, invoice, spam), extracts the key fields, routes it to the right person or queue, and flags anything urgent in chat. **Outcome:** the shared inbox stops being a shared burden. The AI step is a single node; n8n's documentation covers connecting model providers under [Integrate AI](https://docs.n8n.io/build/integrate-ai/).

### 5. The morning report

**Trigger:** a schedule, every weekday at 7 a.m. **Steps:** pull yesterday's numbers from the CRM, the website analytics, the payment provider and the support tool, write them into one sheet or message. **Outcome:** one glance instead of five logins.

### 6. Review and mention monitoring

**Trigger:** a new review on your profile, or a new mention. **Steps:** post it to chat with a link, create a task to reply, and for a low rating, alert the owner directly. **Outcome:** reviews answered promptly, bad ones never missed.

### 7. Customer onboarding sequence

**Trigger:** a new customer record. **Steps:** send the welcome email, create their folder and shared documents, schedule the kickoff, add them to the right list, notify the account owner. **Outcome:** every customer gets the same first week.

### 8. Data cleanup and de-duplication

**Trigger:** a schedule, weekly. **Steps:** find duplicate contacts, normalise phone numbers and addresses, flag records missing required fields for a person to fix. **Outcome:** a CRM you can trust for reporting.

### 9. Publishing to every channel

**Trigger:** a new product, post or announcement in one source. **Steps:** format it for each destination and publish or queue it. **Outcome:** write once, appear everywhere, consistently.

### 10. Stock and threshold alerts

**Trigger:** a schedule, or a change in inventory. **Steps:** compare against thresholds, alert the buyer, optionally draft the purchase order. **Outcome:** you hear about low stock before a customer does.

### 11. Document extraction

**Trigger:** a file lands in a folder or inbox: a supplier invoice, a signed form, a delivery note. **Steps:** an AI step extracts the fields, a person approves anything uncertain, the data lands in the right system. **Outcome:** no retyping, and a review step where it matters.

### 12. Chatbot to CRM, with a human fallback

**Trigger:** a conversation in your website chatbot reaches a point of interest: a lead captured, a request for a person, or a question the bot could not answer. **Steps:** create the record, attach the transcript, alert a person, and if the AI could not help, route to a human queue. **Outcome:** the chatbot and the team work as one system. n8n's own examples include a workflow to "trigger a human answer when the AI can't help" ([AI examples](https://docs.n8n.io/build/integrate-ai/ai-examples/)).

## What can AI do inside an n8n workflow?

n8n's AI examples page lists the patterns in its own words: "use the n8n workflow tool to load data from Google Sheets into your AI workflow"; "load data from an API using the HTTP Request node"; "scrape a website, load the data into Pinecone, then query it in a chat workflow"; "require human approval before an AI Agent runs a tool"; "trigger a human answer when the AI can't help"; and use `$fromAI()` to "dynamically populate parameters for AI app tools" ([AI examples](https://docs.n8n.io/build/integrate-ai/ai-examples/)).

For a business, that translates to four jobs AI does well inside a workflow: **classify** (which kind of email is this), **extract** (pull the fields out of this document), **summarise** (what did this thread decide) and **draft** (write a first reply for a person to edit). The last two examples on n8n's list, human approval and human fallback, are the ones to copy: they keep a person in the loop where the model is unsure or the action matters. The same principle runs through HeliumSol's [AI assistant solutions](/services/ai-assistant-solutions).

## What should you not automate?

- **Anything you do not do consistently by hand yet.** Automation fixes repetition, not confusion. Agree the manual process first.
- **Decisions with judgement or policy weight.** Refunds beyond a small amount, contract terms, anything a regulator would ask about. Automate the gathering of facts; keep the decision.
- **Irreversible actions without an approval step.** Deleting records, sending to a whole list, charging a card. Put a person between the workflow and the action until it has earned trust.
- **Processes that change weekly.** A workflow is a commitment to a process. If the process is still being invented, wait.

## How do you keep automations safe?

Four habits, all cheap:

1. **Test with test data first.** Run every workflow against a copy or a sandbox before it touches live systems.
2. **Handle errors loudly.** Every workflow gets an error path that alerts a person. A silently failing automation is worse than none, because you stop checking.
3. **Approve the irreversible.** Add an approval step before any action that cannot be undone.
4. **Log every run.** n8n keeps execution history; make sure someone looks at it when something seems off.

## Cloud or self-hosted?

n8n Cloud suits teams that want nothing to maintain; you pay a monthly plan and n8n runs it. Self-hosting suits businesses that want their data and automations on their own server, or that already run one, and the Community edition is free. HeliumSol sets up either, and for clients who already have a website server, often installs n8n alongside it. The trade-offs and the setup are part of the [workflow automation](/services/workflow-automation) service.

## Where to start

Pick the workflow from the list that matches the task someone on your team complains about most, and build only that one. A single reliable automation changes how a team thinks about the rest; a dozen half-finished ones does the opposite. If you would like help mapping which one that is, HeliumSol's [contact page](/contact) is the place, and the [free website and chatbot offer](/free-website-and-chatbot) is where many automation projects begin, with a lead capture that needs somewhere to go.

## Sources

- n8n documentation home: [docs.n8n.io](https://docs.n8n.io/)
- n8n, Integrations: [docs.n8n.io/integrations/](https://docs.n8n.io/integrations/)
- n8n, Choose how to use n8n: [docs.n8n.io/choose-n8n/](https://docs.n8n.io/choose-n8n/)
- n8n, Compare editions: [docs.n8n.io/deploy/host-n8n/community-edition-features/](https://docs.n8n.io/deploy/host-n8n/community-edition-features/)
- n8n, Pricing: [n8n.io/pricing/](https://n8n.io/pricing/)
- n8n, Integrate AI: [docs.n8n.io/build/integrate-ai/](https://docs.n8n.io/build/integrate-ai/)
- n8n, AI examples: [docs.n8n.io/build/integrate-ai/ai-examples/](https://docs.n8n.io/build/integrate-ai/ai-examples/)
