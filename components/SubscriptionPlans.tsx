// SubscriptionPlans.tsx (server component, no "use client")
import { FREE_FEATURES, PRO_FEATURES } from "@/constants/pricing";
import BillingToggle from "./BillingToggle";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import PricingButton from "./PricingButton";

export default function SubscriptionPlans() {
  return (
    <section className="px-6 pb-28">
      <div className="mx-auto max-w-4xl grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Free plan */}
        <div className="flex flex-col rounded-2xl border border-white/10 bg-card py-8 px-6">
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
                <CheckIcon size={16} className="shrink-0 text-text-muted" />
                <span className="text-sm text-text-muted">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro plan */}
        <div className="relative flex flex-col rounded-2xl border border-accent/40 bg-card py-8 px-6 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/10 blur-[60px]"
          />
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Pro
            </p>
            <span className="text-xs font-semibold rounded-full bg-accent/15 text-accent px-3 py-1">
              Best Value
            </span>
          </div>

          {/* BillingToggle renders the price, subtext, and CTA button */}
          <BillingToggle />

          <div className="mt-8 flex flex-col gap-3">
            {PRO_FEATURES.map(feature => (
              <div key={feature} className="flex items-center gap-3">
                <CheckIcon size={16} className="shrink-0 text-accent" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
