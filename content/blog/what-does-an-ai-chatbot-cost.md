---
title: "What does an AI chatbot cost? Build and running costs, with the published prices"
description: "An AI chatbot has a one-off build cost and a per-conversation running cost set by published token prices. Both explained, with a worked example."
seoTitle: "What Does an AI Chatbot Cost? Build and Running Costs | HeliumSol"
date: 2026-10-12
category: ai-chatbots-and-assistants
tags: [AI chatbot cost, chatbot pricing, API pricing, small business]
keyword: AI chatbot cost
author: team
image: /images/blog/what-does-an-ai-chatbot-cost.webp
imageAlt: "A simple chart of chatbot running cost rising slowly with the number of conversations, against a navy background"
---

An AI chatbot costs two things: a one-off build, which depends on how much of your knowledge is already written down and what the chatbot connects to, and a running cost, which is mostly the AI provider's per-token API price and is small per conversation. With a current small model, a typical customer conversation costs a fraction of a cent in API usage; with a flagship model it costs a few cents. The build is the larger number and is quoted per project.

This guide separates the two, shows the published prices as of the date above, and works an example so you can estimate your own running cost. It does not quote HeliumSol's build prices, because those are set after a discovery conversation about your project, not in a blog post.

## What are the two costs of an AI chatbot?

**The build** is everything it takes to put a chatbot in front of customers that answers correctly: collecting your content into a knowledge base, writing the rules it follows, connecting lead capture and human handoff, setting usage caps, adding the widget to your site, and testing it against the questions people really ask. This is paid once, like a website.

**The running cost** is what it takes to keep it answering: the AI provider's API usage, any hosting, and the time someone spends reviewing transcripts and updating the knowledge base. The API usage is the part people worry about, and it is the part that is easiest to calculate, because every major provider publishes it.

## How are AI models priced?

Models are priced per token, in and out. A token is roughly three-quarters of an English word. "Input" is everything sent to the model for a reply: the rules, the relevant parts of your knowledge base, and the conversation so far. "Output" is what the model writes back. Output tokens cost more than input tokens on every model.

These are the standard per-million-token prices published by OpenAI and Anthropic on the date this was written. Both pages are linked; check them for current figures, because prices change.

| Model | Input per 1M tokens | Output per 1M tokens | Source |
|---|---|---|---|
| Claude Haiku 5.5 (prompts up to 100,000 tokens) | $0.10 | $0.50 | [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| gpt-4.1-nano | $0.10 | $0.40 | [OpenAI pricing](https://developers.openai.com/api/docs/pricing) |
| gpt-5.4-nano | $0.20 | $1.25 | [OpenAI pricing](https://developers.openai.com/api/docs/pricing) |
| gpt-5.4-mini | $0.75 | $4.50 | [OpenAI pricing](https://developers.openai.com/api/docs/pricing) |
| Claude Sonnet 5.5 | $2.00 | $10.00 | [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Opus 5.5 | $4.00 | $20.00 | [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| gpt-6-astra | $10.00 | $50.00 | [OpenAI pricing](https://developers.openai.com/api/docs/pricing) |

The spread matters. The cheapest and the most expensive models on this list differ by a factor of one hundred on input and output. For a chatbot that answers questions about your business from your own content, the small models are usually the right choice, and the difference in cost is the difference between a bill you never notice and one you do.

## How much does one conversation cost?

Here is a worked example. The assumptions are ours, stated so you can change them.

Assume a conversation of six exchanges. Each time the model replies, it is sent the rules, a few relevant passages from your knowledge base, and the conversation so far. Say that adds up to 10,000 input tokens across the whole conversation, and the model writes 1,500 output tokens in total.

- **Claude Haiku 5.5:** 10,000 input tokens at $0.10 per million is $0.001. 1,500 output tokens at $0.50 per million is $0.00075. About **$0.002 per conversation**.
- **gpt-5.4-nano:** $0.002 for input plus about $0.0019 for output. About **$0.004 per conversation**.
- **Claude Sonnet 5.5:** $0.02 for input plus $0.015 for output. About **$0.035 per conversation**.
- **gpt-6-astra:** $0.10 for input plus $0.075 for output. About **$0.18 per conversation**.

At 1,000 conversations a month, that is roughly $2 on Haiku 5.5, $4 on gpt-5.4-nano, $35 on Sonnet 5.5, and $180 on gpt-6-astra. Most small business sites see far fewer than 1,000 chatbot conversations a month, and long conversations cost more than short ones because the whole exchange is re-sent each turn.

Two things lower these numbers further. Anthropic's pricing page lists a Batch API with "a 50% discount on both input and output tokens", which suits background work rather than live chat, and reduced prices for cached prompt content: on Claude Opus 5.5 and Sonnet 5.5, "cache hits and refreshes" are priced at 0.05 times the base input price. OpenAI's pricing page lists a separate "cached input" rate for most models, for example $0.02 per million for gpt-5.4-nano against $0.20 for standard input. A chatbot's rules and knowledge base are exactly the kind of repeated content caching is designed for.

## What does the build cost depend on?

No published figure here, because an honest one does not exist without knowing the project. What moves the price:

- **How much of your knowledge is written down.** A site with clear service pages and an FAQ is fast to prepare. A business where the answers live in the owner's head needs a writing phase first, which is the most valuable part of the work and the slowest.
- **Where it runs.** A website widget is standard. Other channels add integration work.
- **What it connects to.** Sending a lead to an inbox is simple. Creating a CRM record, checking a calendar, or looking up an order means building and permissioning tools, which moves the project toward an [AI assistant solution](/services/ai-assistant-solutions).
- **Handoff.** A join link or email to the team is included in a typical build; routing into a ticketing system is extra.
- **Consent and compliance.** If the chatbot collects phone numbers for SMS follow-up, consent wording and record-keeping are part of the scope.

HeliumSol's [AI chatbot development](/services/ai-chatbots) page lists what a build includes. The price for yours comes after a short discovery call.

## What are the hidden costs?

- **Hosting.** Close to nothing, if the chatbot runs on the same server as your website. It is a small service, not a separate platform.
- **Knowledge upkeep.** Someone has to update the content when your hours, services or policies change. This is minutes of work, but it is not zero, and a chatbot with stale content does damage.
- **Human time on handoffs.** A good chatbot sends you conversations it could not finish. That is the point, but the people receiving them need to respond.
- **Review.** In the first weeks, reading transcripts and fixing weak answers is where most of the quality comes from. Budget an hour a week, then less.

## How do you keep the running cost predictable?

Three controls, all of which HeliumSol builds into every chatbot:

1. **A monthly token cap.** The chatbot stops calling the model when the cap is reached and falls back to a contact form, so a surprise bill is impossible.
2. **A per-visitor rate limit.** One person, or one script, cannot run hundreds of conversations in an hour.
3. **A small model by default.** Routine questions about your business do not need a flagship model. The chatbot on this site uses a small model and a strict set of rules; the rules are what make it safe, not the size of the model.

Upgrading to a larger model is a configuration change, not a rebuild, so you can start cheap and move up if transcripts show the answers need it.

## Is an AI chatbot worth the cost?

That depends on what it replaces. If the same twenty questions arrive by phone and email every week, a chatbot that answers them around the clock and captures the details of people who want to go further is doing work someone currently does by hand, or that currently goes unanswered after hours. If your enquiries are rare and unique, a chatbot adds little, and the honest advice is to skip it.

HeliumSol does not promise a number of leads or a saving, because nobody can. What it can show is the transcript log: how many conversations happened, what people asked, how many left their details, and how many asked for a person. That is the evidence to judge the cost against.

If you want to see the running cost in practice before committing to a build, the [free website and chatbot offer](/free-website-and-chatbot) includes a knowledge-base chatbot with API usage covered for the first month. For what a chatbot can and cannot do for a small team, read [AI chatbot for small business](/ai-chatbot-for-small-business).

## Sources

- OpenAI, API pricing: [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing)
- Anthropic, Pricing: [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing)

Prices quoted are the standard per-million-token rates shown on those pages on the publication date of this article.
