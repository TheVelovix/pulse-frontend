import Image from "next/image";
import logo from "@/images/pulse-logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card px-6 py-6 mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <Image src={logo} alt="Pulse" height={28} />
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Pulse. All rights reserved.
        </p>
        <p className="text-xs text-text-muted">
          Made with &hearts; by{" "}
          <a
            href="https://www.velovix.com"
            target="_blank"
            className="underline"
          >
            Velovix
          </a>
        </p>
      </div>
    </footer>
  );
}
