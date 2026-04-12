"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/context/SessionContext";
import logo from "@/images/pulse-logo.png";

export default function Navbar() {
  const { user, loading, logout } = useSession();

  return (
    <nav className="border-b border-white/10 bg-card px-6 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <Link href="/dashboard">
          <Image src={logo} alt="Pulse" height={30} priority />
        </Link>
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium bg-accent hover:bg-accent-hover transition-colors duration-200 px-4 py-1.5 rounded-md"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
