import { Check } from "lucide-react";
import PricingButton from "@/components/PricingButton";
import { FREE_FEATURES, PRO_FEATURES } from "@/constants/pricing";

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="w-150 h-150 rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <p className="relative text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          Pricing
        </p>
        <h1 className="relative max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="relative mt-4 max-w-lg text-base text-text-muted md:text-lg">
          Start free, upgrade when you need more. No hidden fees, no surprises.
        </p>
      </section>

      {/* Plans */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-4xl grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Free plan */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-card p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Free
            </p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold">€0</span>
            </div>
            <p className="text-sm text-text-muted mb-8">Free forever</p>

            <PricingButton
              plan="free"
              label="Get started free"
              variant="secondary"
            />

            <div className="mt-8 flex flex-col gap-3">
              {FREE_FEATURES.map(feature => (
                <div key={feature} className="flex items-center gap-3">
                  <Check size={16} className="shrink-0 text-text-muted" />
                  <span className="text-sm text-text-muted">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro plan */}
          <div className="relative flex flex-col rounded-2xl border border-accent/40 bg-card p-8 overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/10 blur-[60px]"
            />

            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Pro
              </p>
              <span className="text-xs font-semibold rounded-full bg-accent/15 text-accent px-3 py-1">
                Most popular
              </span>
            </div>

            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold">€7</span>
              <span className="text-text-muted text-sm mb-1">/month</span>
            </div>
            <p className="text-sm text-text-muted mb-8">Billed monthly</p>

            <PricingButton
              plan="pro"
              label="Get started with Pro"
              variant="primary"
            />

            <div className="mt-8 flex flex-col gap-3">
              {PRO_FEATURES.map(feature => (
                <div key={feature} className="flex items-center gap-3">
                  <Check size={16} className="shrink-0 text-accent" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / reassurance */}
      <section className="px-6 pb-28 border-t border-white/5 pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Questions?</h2>
          <p className="text-text-muted text-sm md:text-base">
            You can upgrade, downgrade, or cancel at any time. If you have
            questions reach out at{" "}
            <a
              href="mailto:info@velovix.com"
              className="text-accent hover:underline"
            >
              info@velovix.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
