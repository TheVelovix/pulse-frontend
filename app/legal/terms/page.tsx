import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Pulse",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By creating an account or using Pulse, you agree to these Terms. If you do not agree, do not use the service.",
  },
  {
    title: "2. Description of Service",
    body: "Pulse provides website analytics including page views, referrer tracking, device and browser data, and geographic information. We offer a Free plan and a Pro plan with additional features.",
  },
  {
    title: "3. Accounts",
    body: "You must provide a valid email address to register. You are responsible for maintaining the security of your account. You must be at least 16 years old to use Pulse.",
  },
  {
    title: "4. Payments and Subscriptions",
    body: "Pro plan subscriptions are billed monthly at $7/month via Paddle, our payment processor. Subscriptions renew automatically unless cancelled. You may cancel at any time from your account page, effective at the end of the current billing period.",
  },
  {
    title: "5. Refunds",
    body: "We offer refunds within 3 days of your initial subscription payment. To request a refund, contact us at info@velovix.com. Refunds are not available after 3 days or for subsequent billing cycles.",
  },
  {
    title: "6. Acceptable Use",
    body: "You may not use Pulse to track websites you do not own or have permission to track. You may not attempt to reverse engineer, abuse, or overload the service.",
  },
  {
    title: "7. Data Retention",
    body: "Free plan data is retained for 30 days. Pro plan data is retained for 12 months. Upon account deletion, all your data is permanently removed.",
  },
  {
    title: "8. Termination",
    body: "We reserve the right to suspend or terminate accounts that violate these Terms.",
  },
  {
    title: "9. Disclaimer",
    body: 'Pulse is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service.',
  },
  {
    title: "10. Changes",
    body: "We may update these Terms at any time. Continued use of Pulse after changes constitutes acceptance.",
  },
  {
    title: "11. Contact",
    body: "For questions, contact us at info@velovix.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Terms of Service</h1>
        <p className="text-text-muted text-sm">Last updated: April 20, 2026</p>
      </div>

      <div className="bg-card border border-white/10 rounded-xl p-6 sm:p-8 flex flex-col gap-6">
        {sections.map((section, i) => (
          <div key={i}>
            <h2 className="font-semibold text-sm mb-2">{section.title}</h2>
            <p className="text-text-muted text-sm leading-relaxed">{section.body}</p>
            {i < sections.length - 1 && (
              <hr className="border-white/10 mt-6" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-sm text-text-muted">
        <Link href="/legal/privacy" className="hover:text-foreground transition-colors duration-200">
          Privacy Policy
        </Link>
        <span>·</span>
        <Link href="/legal/refund" className="hover:text-foreground transition-colors duration-200">
          Refund Policy
        </Link>
      </div>
    </div>
  );
}
