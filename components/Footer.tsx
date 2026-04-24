import Image from "next/image";
import Link from "next/link";
import logo from "@/images/pulse-logo.png";
import Branding from "./Branding";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card px-6 py-6 mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <Link href="/">
          <Image src={logo} alt="Pulse" height={28} />
        </Link>
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Pulse. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <Link
              href="/legal/terms"
              className="hover:text-foreground transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span>·</span>
            <Link
              href="/legal/privacy"
              className="hover:text-foreground transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              href="/legal/refund"
              className="hover:text-foreground transition-colors duration-200"
            >
              Refund Policy
            </Link>
          </div>
        </div>
        <Branding />
      </div>
    </footer>
  );
}
