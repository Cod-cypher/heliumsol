---
title: "Native vs cross-platform mobile apps: how to choose for your business"
description: "Swift and Kotlin versus React Native and Flutter, in the frameworks' own words, and the four questions that decide which approach your app needs."
seoTitle: "Native vs Cross-Platform Mobile Apps: How to Choose | HeliumSol"
date: 2026-10-07
category: web-and-mobile-development
tags: [native vs cross-platform app, React Native, Flutter, Swift, Kotlin, mobile app development]
keyword: native vs cross-platform app
author: team
image: /images/blog/native-vs-cross-platform-mobile-apps.webp
imageAlt: "A phone outline split in two, one half labelled iOS and Android with separate code, the other labelled one shared codebase"
---

A native app is written separately for each platform, in Swift for Apple devices and Kotlin for Android, using each platform's own tools. A cross-platform app is written once, in a framework such as React Native or Flutter, and runs on both. For most business apps, cross-platform is the right default: one codebase, one team, both stores. Native is the right call when the app leans hard on platform-specific hardware or graphics, or when one platform is all you need.

This guide explains what each approach is, quoting the frameworks' own documentation, lays out the trade-offs, and gives the questions that decide it in practice.

## What does "native" mean?

A native app is built with the language and user-interface toolkit the platform owner provides.

On Apple devices that is Swift. Apple describes it as "a powerful and intuitive programming language for all Apple platforms" and says "Swift code is safe by design and produces software that runs lightning fast" ([Apple, Swift](https://developer.apple.com/swift/)). On Android it is Kotlin. Google says Kotlin is "a modern statically typed programming language used by over 60% of professional Android developers," and that "Android's modern UI toolkit is built on Kotlin" ([Android Developers, Kotlin](https://developer.android.com/kotlin)). Google also states on that page that "Android apps that use Kotlin are 20% less likely to crash"; that is Google's figure, from its own page.

The consequence of native is simple: two apps, two codebases, two sets of skills, each with full and immediate access to everything the platform offers.

## What does "cross-platform" mean?

A cross-platform framework lets one codebase produce apps for both stores. The two most used are React Native and Flutter, and they work differently.

**React Native**, maintained by Meta since 2015, is "written in JavaScript, rendered with native code." Its documentation explains that "React primitives render to native platform UI, meaning your app uses the same native platform APIs other apps do," and that it "provides a core set of platform agnostic native components like `View`, `Text`, and `Image` that map directly to the platform's native UI building blocks." The same page recommends starting with a framework on top: "To build a new app with React Native, we recommend a framework like Expo." It lists apps that use React Native, including Microsoft Office, Outlook and Teams, Amazon Shopping, Shopify, Discord and Coinbase ([React Native](https://reactnative.dev/)).

**Flutter**, from Google, takes the other route. Its FAQ describes it as "Google's open source framework for crafting beautiful, natively compiled applications for mobile (iOS, Android), web, desktop (macOS, Windows, Linux), and embedded devices from a single codebase." Rather than using the platform's own widgets, "Flutter renders its UI using its own high-performance rendering engine," Impeller, and "provides implementations of Material Design and Cupertino (iOS-style) widgets." Apps are written in Dart, and "Flutter apps compile directly to native machine code or WebAssembly" ([Flutter FAQ](https://docs.flutter.dev/resources/faq)).

The difference in rendering matters for how an app feels. React Native draws with the platform's real buttons, lists and text fields, so an iOS app looks like iOS without effort. Flutter draws every pixel itself, which gives identical appearance on both platforms and full control, at the cost of re-implementing platform conventions.

## How do the approaches compare?

| | Native (Swift, Kotlin) | React Native | Flutter |
|---|---|---|---|
| Codebases | Two | One | One |
| Language | Swift and Kotlin | JavaScript or TypeScript | Dart |
| User interface | Platform's own toolkit | Platform's native components, driven from JavaScript | Flutter's own rendering engine |
| Platform features | Full, immediate | Through native modules; common ones are covered, unusual ones need bridging | Through plugins; same caveat |
| Shares code with a web app | No | Yes, with a React web app | Flutter can target web, but it is a different kind of web app |
| Looks native on each platform | By definition | Yes, because it uses native components | Consistent across platforms; iOS conventions via Cupertino widgets |
| Team | Two skill sets, or one platform at a time | JavaScript developers, which most web teams have | Dart developers |

## When is native the right choice?

- **The app is the hardware.** Camera pipelines, audio processing, augmented reality, Bluetooth peripherals, background location at scale. Cross-platform frameworks reach these through bridges, and when an app is mostly bridge, native is simpler.
- **Graphics or performance are the product.** Games and animation-heavy interfaces where every frame matters.
- **One platform is enough.** If your customers are overwhelmingly on one platform, a single native app is the smallest thing to build and maintain, and nothing is lost.
- **Deep platform integration is the point.** Widgets, watch apps, App Clips, Android app shortcuts: features that are first-class on one platform and absent on the other.

## When is cross-platform the right choice?

- **Both stores, one team.** Most business apps: bookings, customer portals, field tools, loyalty, ordering, support. The screens are forms, lists and detail pages, which every framework handles well.
- **You already have a web app or a React team.** React Native shares logic, skills and often components with a React web app, which is why it is HeliumSol's default when a client also has a web product; see [full-stack development](/services/full-stack-development).
- **Time to the first release matters more than the last few per cent of polish.** One codebase ships both platforms at once and keeps them in step.
- **The budget favours maintenance.** Operating system updates, store policy changes and new features happen once instead of twice.

## What about a web app instead of either?

Before choosing between native and cross-platform, ask whether an app is needed at all. If your users arrive from search, do not need push notifications, the camera or offline use, and would not install anything, a responsive web application reaches more people with less to maintain, and it is indexed by Google. An app earns its place when the product lives in the phone: notifications that bring people back, hardware features, offline work, or a store presence customers expect.

## What should you expect from the build?

Whichever route you choose, the app is the visible half. The server behind it, with accounts, data, notifications and integrations, is the other half, and it is the same work regardless of framework. Store submission is its own task: developer accounts in your name, privacy declarations, review questions. HeliumSol's [mobile app development](/services/mobile-app-development) service covers all three parts, and the first conversation is about the smallest release that is useful to a real user, which is the biggest lever on both cost and time. An app that answers questions or takes bookings usually wants the same grounded assistant as a website; [AI customer support chatbot](/ai-customer-support-chatbot) describes how that works inside a product.

## How does HeliumSol decide?

Four questions, in discovery:

1. Does the app depend on platform-specific hardware or graphics? If yes, native, at least for that part.
2. Are users split across iOS and Android? If yes, cross-platform, unless question one overrides it.
3. Is there a web app or a React team already? If yes, React Native, to share code and skills.
4. Does the design need pixel-identical screens on both platforms? If yes, Flutter is worth weighing.

The answers are written into the scope with the reasoning, so the choice is a decision you can read, not a habit.

## Sources

- Apple, Swift: [developer.apple.com/swift](https://developer.apple.com/swift/)
- Android Developers, Kotlin: [developer.android.com/kotlin](https://developer.android.com/kotlin)
- React Native: [reactnative.dev](https://reactnative.dev/)
- Flutter FAQ: [docs.flutter.dev/resources/faq](https://docs.flutter.dev/resources/faq)
- Expo documentation: [docs.expo.dev](https://docs.expo.dev/)
