/**
 * Copy for the two legal pages, kept as data so LegalPage.tsx owns the layout
 * and this file owns the words.
 *
 * SCOPE NOTE — read before editing.
 *
 * These documents are written forward: they describe the stack this site is
 * being built towards (an enquiry form, Google Analytics 4, a live AI
 * assistant backed by a third-party model provider, retained server logs), not
 * only what is wired up on the day you are reading this. That is deliberate,
 * and it is the safe direction to be wrong in — a policy that discloses more
 * than the site currently does is over-disclosure, whereas the reverse is the
 * failure that actually causes problems.
 *
 * Two consequences worth keeping in mind:
 *
 *   1. When analytics genuinely go live, EU/UK visitors need a consent banner
 *      BEFORE the GA4 tag fires. This policy describes consent as the basis
 *      for analytics cookies; that has to be true in the code too.
 *   2. If a planned feature is dropped rather than shipped, delete its section
 *      here. Describing a chatbot you never built is its own kind of wrong.
 *
 * Bump LEGAL_UPDATED in src/routes.ts whenever the words below change.
 */

import type { ReactNode } from "react";
import { Shield, Scale } from "lucide-react";
import { CONTACT } from "../constants";

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

export interface LegalDoc {
  /** Small pill above the title. */
  badge: string;
  icon: typeof Shield;
  title: string;
  intro: string;
  sections: LegalSection[];
}

/** Shared inline-link styling so every link in a legal doc matches. */
function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="font-semibold text-navy-700 dark:text-navy-300 underline underline-offset-2 decoration-navy-300 dark:decoration-navy-500 hover:decoration-navy-700 dark:hover:decoration-navy-300 transition-colors"
    >
      {children}
    </a>
  );
}

const MailLink = () => <A href={`mailto:${CONTACT.email}`}>{CONTACT.email}</A>;

export const PRIVACY: LegalDoc = {
  badge: "YOUR DATA, PLAINLY EXPLAINED",
  icon: Shield,
  title: "Privacy Policy",
  intro:
    "This policy explains what we collect when you use heliumsol.com, why we collect it, who else touches it, and how to get it removed. It is written to be read, not to be survived.",
  sections: [
    {
      heading: "1. Who we are",
      body: (
        <>
          HeliumSol is a digital agency that designs and builds websites, web and mobile
          applications, AI assistants, and workflow automation. This policy covers this website and
          the enquiries that come through it. Work we carry out for a client is additionally
          governed by the agreement for that project, which takes precedence where the two overlap.
          Questions go to <MailLink /> or {CONTACT.phone}.
        </>
      ),
    },
    {
      heading: "2. Information you give us",
      body: (
        <>
          When you submit an enquiry, book a call, or email us, we receive what you choose to send:
          your name, email address, phone number, company, website, a description of your project,
          and anything else you include. If you engage us, we also hold the commercial and
          operational details needed to run the project. Please do not send passwords, payment card
          numbers, or other sensitive material by email or through a web form — ask us and we will
          set up a secure channel instead.
        </>
      ),
    },
    {
      heading: "3. Information collected automatically",
      body: (
        <>
          Our web server writes a log entry for every request it serves, containing your IP address,
          the date and time, the page requested, the referring page, and your browser&rsquo;s user
          agent string. These logs exist for security, abuse prevention, and diagnosing faults. We
          also use analytics to understand how the site is used in aggregate — which pages people
          read, roughly where visitors come from, and which links get clicked. Analytics data is
          about patterns, not about identifying you personally, and we do not attempt to
          re-identify individuals from it.
        </>
      ),
    },
    {
      heading: "4. Cookies and similar technologies",
      body: (
        <>
          Your light or dark theme preference is stored in your browser&rsquo;s{" "}
          <code className="font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10">
            localStorage
          </code>{" "}
          under the key <span className="font-mono text-[0.85em]">theme</span>. It never leaves your
          device and is not used to identify you. Beyond that, analytics and any embedded scheduling
          or chat tooling may set cookies. Where consent is required in your jurisdiction we ask for
          it before those load, and you can withdraw it at any time; you can also block or delete
          cookies in your browser settings, and refusing analytics cookies does not stop the site
          working. Google provides an{" "}
          <A href="https://tools.google.com/dlpage/gaoptout">opt-out browser add-on</A> if you would
          rather exclude yourself from Google Analytics everywhere.
        </>
      ),
    },
    {
      heading: "5. Our AI assistant",
      body: (
        <>
          The site offers an AI chat assistant. When it is connected to a live model, the messages
          you type, along with basic technical context about the session, are sent to a third-party
          AI provider in order to generate a reply, and we retain conversations so we can improve
          the assistant, diagnose faults, and follow up on genuine enquiries. Please treat it as you
          would any web form: do not put passwords, financial details, health information, or
          anyone else&rsquo;s personal data into it. Its answers are generated automatically, can be
          wrong, and are not professional advice — see the terms for what that means in practice. If
          you would like a conversation deleted, email <MailLink /> and we will remove it.
        </>
      ),
    },
    {
      heading: "6. How we use your information",
      body: (
        <>
          We use it to reply to you, to scope and deliver work you have asked us to do, to keep
          records of enquiries and engagements, to operate and secure the site, to understand in
          aggregate how the site performs, and to meet our legal and accounting obligations. We rely
          on your consent for analytics and marketing cookies, on our legitimate interest in running
          and securing our business for logs and enquiry handling, and on the performance of a
          contract for client work. We do not sell, rent, or trade your information, and we do not
          use it to train AI models of our own.
        </>
      ),
    },
    {
      heading: "7. Who we share it with",
      body: (
        <>
          Only the service providers needed to run the business: our hosting provider, an email
          delivery service, an analytics provider, and the AI provider behind the assistant. Each
          receives only what their function requires and is bound to handle it accordingly. We also
          disclose information where the law compels us to. Links that take you to a third-party
          site — a scheduling page, a client&rsquo;s website — hand you over to that provider, and
          from that point their privacy policy governs rather than ours.
        </>
      ),
    },
    {
      heading: "8. International transfers",
      body: (
        <>
          Some of those providers are based in the United States or otherwise outside your country,
          so your information may be processed there. Where that happens we rely on the safeguards
          those providers offer for international transfers, such as standard contractual clauses
          or an equivalent adequacy mechanism.
        </>
      ),
    },
    {
      heading: "9. How long we keep it",
      body: (
        <>
          Server logs are rotated and deleted as part of normal maintenance. Analytics data is kept
          for the retention window configured in the analytics tool. Enquiries are kept while there
          is a realistic prospect of working together and for a reasonable period afterwards. Client
          records are kept for the duration of the engagement and then for as long as tax, legal,
          and professional-record obligations require. Chat conversations are kept while they remain
          useful for improving the assistant. When a retention period ends, we delete or anonymise.
        </>
      ),
    },
    {
      heading: "10. Security",
      body: (
        <>
          The site is served over HTTPS, access to our systems is restricted to the people who need
          it, and we keep the software we run patched. No system is perfectly secure and we will not
          pretend otherwise, but if a breach ever affects your personal data we will tell you and
          the relevant regulator within the timeframes the law sets.
        </>
      ),
    },
    {
      heading: "11. Client confidentiality",
      body: (
        <>
          For clients: anything we are given access to during a project — credentials, analytics,
          customer data, internal documents, commercial plans — is treated as confidential, used
          only for the work you engaged us to do, and never repurposed for another client. Where a
          project involves us handling personal data belonging to your customers, we act on your
          instructions as a processor and the specific terms for that live in the agreement for
          that project.
        </>
      ),
    },
    {
      heading: "12. Your rights",
      body: (
        <>
          You can ask us for a copy of the information we hold about you, ask us to correct it, ask
          us to delete it, ask us to restrict or stop a particular use, object to processing based
          on legitimate interests, or withdraw consent you previously gave. Email <MailLink /> and
          we will act on it promptly and without charge. Depending on where you live you may have
          further statutory rights, including the right to complain to your local data protection
          authority — tell us what you need and we will meet it rather than argue about which
          regime applies.
        </>
      ),
    },
    {
      heading: "13. Children",
      body: (
        <>
          This site and our services are aimed at businesses and are not directed at children. We do
          not knowingly collect personal information from anyone under 16. If you believe a child
          has sent us information, email <MailLink /> and we will delete it.
        </>
      ),
    },
    {
      heading: "14. Changes to this policy",
      body: (
        <>
          When what we collect changes, this page changes with it and the date below is updated at
          the same time. Where a change materially affects how we handle information you have
          already given us, we will do more than quietly edit the page.
        </>
      ),
    },
  ],
};

export const TERMS: LegalDoc = {
  badge: "THE GROUND RULES",
  icon: Scale,
  title: "Terms of Service",
  intro:
    "These terms cover your use of this website and the AI assistant on it. Work we deliver for clients is governed by the written agreement for that project, not by this page.",
  sections: [
    {
      heading: "1. Using this site",
      body: (
        <>
          By browsing heliumsol.com you accept these terms. If you do not, please stop using the
          site. We may update them as the site changes; the date at the bottom tells you when this
          version took effect, and continuing to use the site after a change means you accept the
          updated version.
        </>
      ),
    },
    {
      heading: "2. This site is marketing, not an offer",
      body: (
        <>
          Everything here — service descriptions, capability demos, process outlines, indicative
          timeframes — is promotional material to help you decide whether to talk to us. None of it
          is a binding offer, a quote, or a commitment to a deliverable, a price, or a date. Scope,
          fees, timelines, revisions, and ownership are agreed in a written proposal or contract
          signed by both sides. Where anything on this site conflicts with that signed agreement,
          the signed agreement wins.
        </>
      ),
    },
    {
      heading: "3. The AI assistant",
      body: (
        <>
          The chat assistant generates its replies automatically. It can be confidently wrong, can
          misunderstand what you asked, and is not a substitute for professional, legal, financial,
          or technical advice. Nothing it says is a quote, a commitment, or a contractual promise on
          our behalf, and you should not rely on it for any decision that matters without confirming
          with a human — email <MailLink /> and you will get one. We may log conversations as
          described in the <A href="/privacy-policy">privacy policy</A>. Do not enter passwords,
          payment details, or other people&rsquo;s personal information into it. We do not guarantee
          it will be available, and we may change or withdraw it at any time.
        </>
      ),
    },
    {
      heading: "4. Demonstrations are illustrative",
      body: (
        <>
          The interactive panels on the homepage — the automation graph, the code sequence, the
          project showcases — are self-contained demonstrations built to show the kind of thing we
          make. They are not connected to live client systems and are not themselves products you
          are purchasing. Screens and figures shown in the portfolio are representative of work
          delivered, not a guarantee of the results any particular project will produce.
        </>
      ),
    },
    {
      heading: "5. Acceptable use",
      body: (
        <>
          Please do not attempt to break into, disrupt, overload, or probe this site or the
          infrastructure behind it; do not scrape it at a volume that degrades it for others; and do
          not use it to distribute malware or unlawful material. For the assistant specifically: do
          not use it to generate illegal, harassing, or deceptive content, do not attempt to
          manipulate it into ignoring its instructions or revealing its configuration, and do not
          automate requests against it. We may rate-limit or block access where any of this
          happens. If you are a security researcher and you find something, we would genuinely
          rather hear from you than not — email <MailLink /> and we will work with you in good
          faith.
        </>
      ),
    },
    {
      heading: "6. Intellectual property",
      body: (
        <>
          The design, code, copy, and graphics on this site belong to HeliumSol, apart from
          third-party components used under their own licences and any client names or marks, which
          belong to their respective owners and appear here with permission or as fair reference to
          work performed. You are welcome to link to the site and to quote short extracts with
          attribution. Republishing it wholesale, or reusing the design as your own, is not
          permitted. Ownership of work we produce for a client transfers as set out in that
          client&rsquo;s agreement.
        </>
      ),
    },
    {
      heading: "7. Links and third-party services",
      body: (
        <>
          Where we link out — to a booking tool, a client&rsquo;s website, a third-party service —
          we do not control what is on the other end and are not responsible for it. Parts of this
          site rely on third-party providers for analytics, scheduling, and AI functionality; their
          own terms apply to those components, and an outage on their side may affect what works
          here.
        </>
      ),
    },
    {
      heading: "8. Privacy",
      body: (
        <>
          What we collect and why is set out in the <A href="/privacy-policy">privacy policy</A>,
          which forms part of these terms. Using this site means you have read it.
        </>
      ),
    },
    {
      heading: "9. The site is provided as it is",
      body: (
        <>
          We work to keep this site accurate, current, and available, but we do not warrant that it
          will be uninterrupted, error-free, or that every statement on it will remain accurate as
          our services evolve. To the fullest extent the law allows, we exclude implied warranties
          in relation to the website and the assistant, and we are not liable for indirect or
          consequential loss arising from your use of them, including any action taken in reliance
          on AI-generated output. Nothing here limits liability that cannot lawfully be limited —
          including for death, personal injury, or fraud. These limits apply to this website;
          liability under a client engagement is dealt with in that engagement&rsquo;s agreement.
        </>
      ),
    },
    {
      heading: "10. Governing law",
      body: (
        <>
          Each client engagement states the law that governs it and where disputes are resolved, and
          that clause controls for anything arising out of the work. For questions about this
          website itself, contact us first at <MailLink /> — in our experience that resolves matters
          faster than anything else.
        </>
      ),
    },
    {
      heading: "11. Contact",
      body: (
        <>
          Questions about these terms are welcome. Email <MailLink /> or call {CONTACT.phone} and a
          human will answer.
        </>
      ),
    },
  ],
};
