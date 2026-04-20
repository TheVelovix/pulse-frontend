import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — Pulse",
};

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Refund Policy</h1>
        <p className="text-text-muted text-sm">Last updated: April 20, 2026</p>
      </div>

      <div className="bg-card border border-white/10 rounded-xl p-6 sm:p-8 flex flex-col gap-6">
        <div>
          <h2 className="font-semibold text-sm mb-2">Eligibility</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            We offer a full refund within 3 days of your initial Pro plan subscription payment. To
            request a refund, email us at{" "}
            <a
              href="mailto:info@velovix.com"
              className="text-accent hover:text-accent-hover transition-colors duration-200"
            >
              info@velovix.com
            </a>{" "}
            with the subject line &ldquo;Refund Request&rdquo; and include your registered email
            address.
          </p>
          <hr className="border-white/10 mt-6" />
        </div>

        <div>
          <h2 className="font-semibold text-sm mb-2">Non-Refundable Situations</h2>
          <ul className="text-text-muted text-sm leading-relaxed list-disc list-inside flex flex-col gap-1.5">
            <li>Refund requests made more than 3 days after the initial payment.</li>
            <li>Subsequent monthly billing cycles.</li>
            <li>
              Accounts terminated due to a violation of our Terms of Service.
            </li>
          </ul>
          <hr className="border-white/10 mt-6" />
        </div>

        <div>
          <h2 className="font-semibold text-sm mb-2">Cancellation</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            You may cancel your subscription at any time from your account page. Cancellation stops
            future charges but does not trigger a refund unless you are within the 3-day window.
          </p>
          <hr className="border-white/10 mt-6" />
        </div>

        <div>
          <h2 className="font-semibold text-sm mb-2">Processing</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Approved refunds are processed within 5–10 business days back to your original payment
            method.
          </p>
          <hr className="border-white/10 mt-6" />
        </div>

        <div>
          <h2 className="font-semibold text-sm mb-2">Contact</h2>
          <a
            href="mailto:info@velovix.com"
            className="text-accent hover:text-accent-hover transition-colors duration-200 text-sm"
          >
            info@velovix.com
          </a>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-sm text-text-muted">
        <Link href="/legal/terms" className="hover:text-foreground transition-colors duration-200">
          Terms of Service
        </Link>
        <span>·</span>
        <Link href="/legal/privacy" className="hover:text-foreground transition-colors duration-200">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
