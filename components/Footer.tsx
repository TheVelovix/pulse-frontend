import Image from "next/image";
import Link from "next/link";
import logo from "@/images/pulse-logo.png";
import Branding from "./Branding";
import {
  InstagramLogoIcon,
  XLogoIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card px-6 py-6 mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center">
          <Link href="/">
            <Image src={logo} alt="Pulse" height={28} />
          </Link>

          {/*Social Media*/}
          <div className="flex mt-4 gap-4">
            <Link
              target="_blank"
              href={"https://www.instagram.com/thevelovix/"}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all duration-200"
            >
              <InstagramLogoIcon size={20} />
            </Link>
            <Link
              target="_blank"
              href={"https://x.com/The_Velovix"}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all duration-200"
            >
              <XLogoIcon size={20} />
            </Link>
            <Link
              target="_blank"
              href={"https://github.com/TheVelovix"}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all duration-200"
            >
              <GithubLogoIcon size={20} />
            </Link>
            <Link
              target="_blank"
              href={"https://www.linkedin.com/company/velovix"}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all duration-200"
            >
              <LinkedinLogoIcon size={20} />
            </Link>
          </div>
        </div>
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
