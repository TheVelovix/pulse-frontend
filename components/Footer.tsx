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
import bluesky from "@/images/bluesky.svg";

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
            <Link
              target="_blank"
              href={"https://bsky.app/profile/thevelovix.bsky.social"}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all duration-200"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                height="18"
                width="18"
              >
                <title>Bluesky</title>
                <path
                  d="M12 10.8c-1.087 -2.114 -4.046 -6.053 -6.798 -7.995C2.566 0.944 1.561 1.266 0.902 1.565 0.139 1.908 0 3.08 0 3.768c0 0.69 0.378 5.65 0.624 6.479 0.815 2.736 3.713 3.66 6.383 3.364 0.136 -0.02 0.275 -0.039 0.415 -0.056 -0.138 0.022 -0.276 0.04 -0.415 0.056 -3.912 0.58 -7.387 2.005 -2.83 7.078 5.013 5.19 6.87 -1.113 7.823 -4.308 0.953 3.195 2.05 9.271 7.733 4.308 4.267 -4.308 1.172 -6.498 -2.74 -7.078a8.741 8.741 0 0 1 -0.415 -0.056c0.14 0.017 0.279 0.036 0.415 0.056 2.67 0.297 5.568 -0.628 6.383 -3.364 0.246 -0.828 0.624 -5.79 0.624 -6.478 0 -0.69 -0.139 -1.861 -0.902 -2.206 -0.659 -0.298 -1.664 -0.62 -4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
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
