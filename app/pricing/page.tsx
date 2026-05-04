import SubscriptionPlans from "@/components/SubscriptionPlans";

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
      <SubscriptionPlans />

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
