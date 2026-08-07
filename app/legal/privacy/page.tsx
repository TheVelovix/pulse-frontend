import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Pulse",
};

const sections = [
  {
    title: "1. Data We Collect About You (Account Data)",
    body: "When you register, we collect your email address and a hashed password. We also store your subscription plan and payment subscription ID provided by our payment processor, Paddle.",
  },
  {
    title: "2. Data We Collect About Your Website Visitors (Analytics Data)",
    body: "When you install the Pulse tracking script on your website, we collect the following data about your visitors: page URL, referrer, device type, operating system, browser, and country. We do not collect or store IP addresses. We do not use cookies or fingerprinting techniques.",
  },
  {
    title: "3. How We Use Your Data",
    body: "We use your account data to provide and manage the service. Analytics data is used solely to generate the reports visible in your dashboard. We do not sell your data or your visitors' data to any third party.",
  },
  {
    title: "4. Data Sharing and Disclosure",
    body: "Pulse does not share, sell, rent, transfer, or otherwise disclose your account data, your website visitors' analytics data, or any Google user data accessed through our integrations to any third party for advertising, marketing, or any other unrelated purpose. We do not use this data to train AI or machine learning models, and we do not transfer it to any third-party AI or ML service. The only parties with limited access to data are the infrastructure and payment providers listed below, who process data solely on our behalf and are contractually restricted from using it for their own purposes: our cloud hosting provider, which stores data as part of running the service, and Paddle, our payment processor, which handles payment transactions as described in Section 5. We do not disclose data to any other party except where required by law.",
  },
  {
    title: "5. Data Retention",
    body: "Free plan analytics data is retained for 30 days. Pro plan analytics data is retained for 24 months. You may delete your account at any time, which permanently removes all associated data.",
  },
  {
    title: "6. Payment Processing",
    body: "Payments are processed by Paddle. We do not store your payment card details. Please refer to Paddle's privacy policy for information on how they handle payment data.",
  },
  {
    title: "7. Data Security",
    body: "Passwords are stored using bcrypt hashing. We use HTTPS for all data transmission.",
  },
  {
    title: "8. Your Rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us at info@velovix.com or by deleting your account directly from the app.",
  },
  {
    title: "9. GDPR",
    body: "Pulse is designed to be GDPR-friendly. We do not collect personally identifiable information about your website visitors. No cookies are set by our tracking script.",
  },
  {
    title: "10. Changes",
    body: "We may update this policy at any time. We will notify registered users of significant changes via email.",
  },
  {
    title: "11. Contact",
    body: "info@velovix.com",
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Privacy Policy</h1>
        <p className="text-text-muted text-sm">Last updated: August 7, 2026</p>
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
        <Link href="/legal/terms" className="hover:text-foreground transition-colors duration-200">
          Terms of Service
        </Link>
        <span>·</span>
        <Link href="/legal/refund" className="hover:text-foreground transition-colors duration-200">
          Refund Policy
        </Link>
      </div>
    </div>
  );
}
