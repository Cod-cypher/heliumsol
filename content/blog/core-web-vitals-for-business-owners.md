---
title: "Core Web Vitals explained for business owners: what Google measures and why it affects enquiries"
description: "What LCP, INP and CLS measure, the thresholds Google publishes, how Core Web Vitals relate to rankings, and what to ask your web developer."
seoTitle: "Core Web Vitals Explained for Business Owners | HeliumSol"
date: 2026-10-09
category: web-and-mobile-development
tags: [core web vitals, page speed, LCP, INP, CLS, SEO, website performance]
keyword: core web vitals
author: team
image: /images/blog/core-web-vitals-for-business-owners.webp
imageAlt: "Three gauges labelled LCP, INP and CLS with their good thresholds, 2.5 seconds, 200 milliseconds and 0.1"
---

Core Web Vitals are three numbers Google uses to describe how a web page feels to a visitor: how quickly the main content appears (Largest Contentful Paint), how quickly the page reacts when someone taps or clicks (Interaction to Next Paint), and how much the layout jumps around while loading (Cumulative Layout Shift). Google publishes a "good" threshold for each and recommends measuring at the 75th percentile of real visits. They matter to a business for two reasons: Google says good scores align with what its ranking systems reward, and a page that is slow or jumpy on a phone loses visitors before they enquire.

This guide explains the three metrics in plain language, quotes Google's own documentation for the thresholds and the ranking relationship, and ends with the questions to ask whoever builds your website.

## What are the three Core Web Vitals?

Google's web.dev documentation names three stable metrics and a threshold for each ([Web Vitals](https://web.dev/articles/vitals)):

**Largest Contentful Paint (LCP)** "measures loading performance." In practice it is the moment the biggest thing in the visible part of the page appears: the hero image, the headline, the first block of text. Google's guidance: "LCP should occur within 2.5 seconds of when the page first starts loading." The LCP article adds that "poor values are greater than 4.0 seconds," and "anything in between needs improvement." ([LCP](https://web.dev/articles/lcp))

**Interaction to Next Paint (INP)** "measures interactivity." It watches every tap, click and key press during a visit and reports how long the page took to respond visibly. "An INP below or at 200 milliseconds means a page has good responsiveness"; above 500 milliseconds is poor. INP is "the successor metric to First Input Delay (FID)", which it replaced. ([INP](https://web.dev/articles/inp))

**Cumulative Layout Shift (CLS)** "measures visual stability." It scores how much visible content moves unexpectedly while the page loads: the button that jumps just as you tap it. "Good CLS values are 0.1 or less. Poor values are greater than 0.25." ([CLS](https://web.dev/articles/cls))

| Metric | What it captures | Good | Poor |
|---|---|---|---|
| LCP | Time until the main content is visible | 2.5 s or less | More than 4.0 s |
| INP | Delay between an interaction and the screen responding | 200 ms or less | More than 500 ms |
| CLS | How much the layout shifts unexpectedly | 0.1 or less | More than 0.25 |

## Which visitors count? The 75th percentile

The thresholds are not applied to your fastest visit or your average visit. Google's guidance is that "a good threshold to measure is the 75th percentile of page loads," segmented by mobile and desktop ([Web Vitals](https://web.dev/articles/vitals)). In other words, three out of four real visits must be under the threshold. A page that is fast on the developer's laptop on office Wi-Fi and slow on a customer's phone in a car park is a slow page.

## Do Core Web Vitals affect Google rankings?

Google's Search Central documentation answers this carefully, and it is worth quoting rather than paraphrasing: "We highly recommend site owners achieve good Core Web Vitals for success with Search," and good Core Web Vitals, "along with other page experience aspects, aligns with what our core ranking systems seek to reward." ([Understanding Core Web Vitals and Google search results](https://developers.google.com/search/docs/appearance/core-web-vitals))

So they are not a switch that moves a page from position ten to position one, and Google does not describe them that way. They are one part of page experience, which Google's ranking systems try to reward. A business should treat them as a hygiene standard: a reason not to lose ground, rather than a trick to gain it.

## Why do they matter for enquiries, not just rankings?

Rankings bring a visitor to the page. The Vitals describe what happens next. A hero that takes four seconds to appear on a phone is four seconds of a blank or half-drawn screen, during which the visitor decides whether to wait. A "Call now" button that shifts down as an image loads above it is a mis-tap. A form that pauses half a second after each keystroke feels broken.

None of that needs a statistic to understand. The thresholds Google publishes are a reasonable description of the point at which a page starts feeling slow or unreliable to a person, and the visitor who gives up at that point is an enquiry you paid for, through ads or content, and did not receive.

## How do you measure your own site?

Google's Search Central page points to "the Core Web Vitals report in Search Console," which shows how real visitors experience your pages, grouped as good, needs improvement or poor ([Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)). It requires that your site is verified in Search Console and has enough traffic to report on. For a single page, Google's PageSpeed Insights tool reports both field data from real visitors, where available, and a lab test.

Two habits make the numbers useful. Look at mobile, because that is where the thresholds are hardest to meet and where most local-business visitors are. And look at the 75th percentile, not the lab score alone; a lab test is one run on one machine.

## What makes LCP slow, and how is it fixed?

Google's guide to optimising LCP ([Optimize LCP](https://web.dev/articles/optimize-lcp)) breaks the problem into parts. The ones that matter most for a business site:

- **The server is slow to respond.** "A high TTFB can make achieving a 2.5 second LCP challenging, or even impossible." TTFB is time to first byte: how long before the server starts sending anything. Static, prerendered pages served from a fast host fix this; pages assembled on every request by a heavy platform do not.
- **The main image is discovered late.** The guide says "your LCP resource should be discoverable from the HTML source." If the hero image is only referenced inside JavaScript or a stylesheet, the browser cannot start fetching it until it has processed those. Put it in the HTML, and the guide suggests "set `fetchpriority="high"` on an `<img>` element if you think it's likely to be your page's LCP element."
- **Scripts block rendering.** The guide notes that "It is almost never necessary to add synchronous scripts" to the head of the page. Tag managers, chat widgets and fonts loaded synchronously all delay the first paint.

## What makes the layout shift?

The CLS article lists the usual suspects: "images or videos with unknown dimensions," "fonts that render larger or smaller than its initial fallback," and "third-party ads or widgets that dynamically resize themselves" ([CLS](https://web.dev/articles/cls)). The fixes are correspondingly plain: every image gets a width and height so the browser reserves its space; fonts are loaded in a way that avoids a jarring swap; anything injected late, such as a cookie banner or a chat launcher, is positioned so it does not push content.

## What makes INP poor?

INP is about what the browser is doing when a visitor interacts. If it is busy running JavaScript, the tap waits. The pattern on business sites is too much script: several analytics tags, a heavy framework loading everything on every page, animations that run on the main thread. The fix is to ship less JavaScript, load what is needed when it is needed, and keep interaction handlers light.

## What about websites that only work with JavaScript?

A related issue, outside the three Vitals but important to search: many modern sites render their content with JavaScript in the browser. Google can process this, but not instantly. Its documentation says Google "processes JavaScript web apps in three main phases": crawling, rendering and indexing, and that "Googlebot queues pages for both crawling and rendering." On the wait: "The page may stay on this queue for a few seconds, but it can take longer than that." ([JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics))

The robust approach is to prerender: generate the full HTML of every page at build time so crawlers, AI search tools and visitors on slow connections get the content immediately, and JavaScript only enhances it. This site is built that way, and HeliumSol's [full-stack development](/services/full-stack-development) service builds client sites the same way.

## What should you ask your web developer?

You do not need to understand the engineering to hold a build to this standard. Ask:

1. What are the LCP, INP and CLS values for our key pages on mobile, at the 75th percentile, and where can I see them?
2. Is every page delivered as complete HTML, or does the content depend on JavaScript running first?
3. Do all images have explicit dimensions and modern formats, and are they lazy-loaded below the fold?
4. Are fonts self-hosted and preloaded, or fetched from a third party on every visit?
5. What third-party scripts load on each page, and which ones are actually used?
6. Is there an automated check that fails the build when a page loses its heading, its canonical URL or its structured data?

A good answer to each is specific. "It's fast" is not an answer; a number, a tool and a page are.

## Where to go from here

If your current site cannot answer those questions, a performance review is a small project and often the most useful first engagement. If you are starting fresh, the [free website and chatbot offer](/free-website-and-chatbot) builds a site to these standards from the start. Either way, HeliumSol's [full-stack development](/services/full-stack-development) page explains what is included.

## Sources

- Google, Web Vitals: [web.dev/articles/vitals](https://web.dev/articles/vitals)
- Google, Largest Contentful Paint: [web.dev/articles/lcp](https://web.dev/articles/lcp)
- Google, Interaction to Next Paint: [web.dev/articles/inp](https://web.dev/articles/inp)
- Google, Cumulative Layout Shift: [web.dev/articles/cls](https://web.dev/articles/cls)
- Google, Optimize Largest Contentful Paint: [web.dev/articles/optimize-lcp](https://web.dev/articles/optimize-lcp)
- Google Search Central, Understanding Core Web Vitals and Google search results: [developers.google.com/search/docs/appearance/core-web-vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- Google Search Central, JavaScript SEO basics: [developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
