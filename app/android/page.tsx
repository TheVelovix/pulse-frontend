import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import mockup from "@/images/pulse-mockup.png";

export const metadata: Metadata = {
  title: "Pulse for Android. Analytics in your pocket",
  description:
    "The Pulse Android app puts your website analytics on your home screen. Live visitor counts, traffic alerts, and full dashboard access, wherever you are.",
  openGraph: {
    title: "Pulse for Android. Analytics in your pocket",
    description:
      "The Pulse Android app puts your website analytics on your home screen. Live visitor counts, traffic alerts, and full dashboard access, wherever you are.",
    url: "https://pulse.velovix.com/android",
    siteName: "Pulse",
  },
};

export default function AndroidPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 md:py-40 overflow-hidden lg:flex-row lg:gap-16 lg:items-center lg:text-left">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="w-150 h-150 rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <div className="relative">
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-4xl">
            Your analytics.
            <span className="text-accent"> Now in your pocket.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-text-muted mx-auto lg:mx-0 md:text-lg">
            The Pulse app for Android brings your live dashboard, visitor counts, and traffic alerts
            straight to your phone. Same privacy-first data, wherever you are.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link
              href="https://play.google.com/store/apps/details?id=com.velovix.pulse"
              target="_blank"
              className="flex items-center gap-3 w-56 justify-center px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-sm font-semibold transition-colors duration-200"
            >
              Get it on Google Play
            </Link>
            <Link
              href="https://github.com/TheVelovix/pulse-app/releases"
              target="_blank"
              className="flex items-center gap-3 w-56 justify-center px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-sm font-semibold transition-colors duration-200"
            >
              Download APK
            </Link>
          </div>

          <p className="mt-4 text-xs text-text-muted">
            Free to download. Requires a Pulse account.
          </p>
        </div>

        <div className="relative mt-16 lg:mt-0 z-10">
          <Image
            src={mockup}
            alt="Samsung Mockup of the Android app"
            className="drop-shadow-accent drop-shadow-sm md:w-120"
          />
        </div>
      </section>
    </div>
  );
}
