import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  BarChart2,
  Shield,
  Globe,
  Layers,
  Wrench,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Metadata } from "next";
import PricingButton from "@/components/PricingButton";
import dashboard from "@/images/dashboard.png";
import { FREE_FEATURES, PRO_FEATURES } from "@/constants/pricing";

export const metadata: Metadata = {
  title: "Pulse — Privacy-Friendly Website Analytics",
  description:
    "Lightweight, privacy-first analytics for your website. No cookies, no fingerprinting. Add one script tag and get instant insights into visitors, pages, and referrers.",
  openGraph: {
    title: "Pulse — Privacy-Friendly Website Analytics",
    description:
      "Lightweight, privacy-first analytics for your website. No cookies, no fingerprinting. Add one script tag and get instant insights.",
    url: "https://pulse.velovix.com",
    siteName: "Pulse",
  },
};

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Zap,
    title: "Lightweight script",
    description:
      "1 KB. Pulse loads asynchronously so it never slows down your page or hurts your performance scores.",
  },
  {
    icon: BarChart2,
    title: "Up-to-date dashboard",
    description:
      "See page views, referrers, devices, and countries on an intuitive live dashboard from anywhere, anytime. Powerful filters let you see exactly the data you need.",
  },
  {
    icon: Shield,
    title: "Privacy-first",
    description:
      "No cookies, no fingerprinting, no personal data collected — ever. Stay compliant with GDPR and CCPA out of the box, with nothing to configure.",
  },
  {
    icon: Globe,
    title: "Hosted or self-hosted",
    description:
      "Use our hosted version or self-host on your own server. Fully open source. Your data, your choice.",
  },
  {
    icon: Layers,
    title: "Multi-site support",
    description:
      "Manage all your projects from a single account with isolated analytics for each domain.",
  },
  {
    icon: Wrench,
    title: "Zero configuration",
    description:
      "Paste one script tag and you're done. No build steps, no environment variables, no SDK to install.",
  },
];

const STEPS = [
  {
    title: "Create a project",
    description: "Sign up and add your site with a name and domain.",
  },
  {
    title: "Add the script tag",
    description: `Copy the generated snippet from your dashboard and paste it into the <head> of your site.`,
  },
  {
    title: "Watch the data flow",
    description:
      "Open your Pulse dashboard and see real visitors, pages, and referrers — immediately.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 md:py-40 overflow-hidden">
        {/* glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="w-150 h-150 rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <span className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-card px-4 py-1.5 text-xs font-medium text-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Simple · Lightweight · Privacy-first
        </span>

        <h1 className="relative max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          One script tag. Full analytics.
          <span className="text-accent"> No cost.</span>
        </h1>

        <p className="relative mt-6 max-w-xl text-base text-text-muted md:text-lg">
          Pulse gives you instant, privacy-friendly insights into who visits
          your site, with a single script tag and zero configuration.
        </p>

        <div className="relative mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/signup"
            className="w-44 sm:w-auto px-7 py-3 rounded-lg bg-accent hover:bg-accent-hover text-sm font-semibold transition-colors duration-200 text-center"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="w-44 sm:w-auto px-7 py-3 rounded-lg border border-white/10 bg-card hover:bg-white/5 text-sm font-medium transition-colors duration-200 text-center"
          >
            Log in
          </Link>
        </div>

        <p className="relative mt-4 text-xs text-text-muted">
          Free forever · No credit card required
        </p>
      </section>

      {/* Dashboard screenshot */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40">
            <Image
              src={dashboard}
              alt="Pulse analytics dashboard"
              width={1456}
              height={816}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            Why Pulse
          </p>
          <h2 className="text-center text-2xl font-bold sm:text-3xl mb-14">
            Everything you need, nothing you don&apos;t
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="rounded-xl border border-white/10 bg-card p-6 flex flex-col gap-3 hover:border-accent/30 transition-colors duration-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <f.icon size={20} />
                </div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 md:py-28 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            Pricing
          </p>
          <h2 className="text-center text-2xl font-bold sm:text-3xl mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-center text-sm text-text-muted mb-14">
            Start free, upgrade when you need more. No hidden fees.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="rounded-xl border border-white/10 bg-card p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">
                  Free
                </h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">€0</span>
                  <span className="text-text-muted text-sm mb-1">
                    / forever
                  </span>
                </div>
              </div>
              <ul className="flex flex-col gap-3">
                {FREE_FEATURES.map(f => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-text-muted"
                  >
                    <Check size={14} className="text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <PricingButton
                plan="free"
                label="Get started free"
                variant="secondary"
              />
            </div>

            {/* Pro */}
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-8 flex flex-col gap-6 relative">
              <span className="absolute top-4 right-4 text-xs font-semibold bg-accent text-white px-2.5 py-1 rounded-full">
                Best Value
              </span>
              <div>
                <h3 className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
                  Pro
                </h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">€7</span>
                  <span className="text-text-muted text-sm mb-1">/ month</span>
                </div>
              </div>
              <ul className="flex flex-col gap-3">
                {PRO_FEATURES.map(f => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-text-muted"
                  >
                    <Check size={14} className="text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <PricingButton
                plan="pro"
                label="Get started with Pro"
                variant="primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 md:py-28 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            Setup in minutes
          </p>
          <h2 className="text-center text-2xl font-bold sm:text-3xl mb-14">
            Three steps to full visibility
          </h2>

          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block h-px flex-1 bg-white/10" />
                  )}
                </div>
                <h3 className="text-sm font-semibold mt-1">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl rounded-2xl border border-accent/20 bg-accent/5 px-8 py-14 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl mb-4">
            Ready to understand your audience?
          </h2>
          <p className="text-text-muted text-sm md:text-base mb-8">
            Create your free account and add Pulse to your site in under two
            minutes.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-sm font-semibold transition-colors duration-200"
          >
            Start for free
          </Link>
          <p className="mt-4 text-xs text-text-muted">
            No credit card required
          </p>
        </div>
      </section>
    </div>
  );
}
