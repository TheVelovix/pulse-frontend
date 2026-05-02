"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/context/SessionContext";
import logo from "@/images/pulse-logo.png";
import { XIcon } from "@phosphor-icons/react";

export default function Navbar() {
  const { user, loading, logout } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav className="border-b border-white/10 bg-card px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href={user ? `/dashboard` : `/`} className="cursor-pointer">
            <Image src={logo} alt="Pulse" height={30} priority />
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/pricing"
                      className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/docs"
                      className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
                    >
                      Docs
                    </Link>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/account"
                      className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
                    >
                      Account
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
                      href="/pricing"
                      className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/docs"
                      className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
                    >
                      Docs
                    </Link>
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

          {/* Mobile hamburger */}
          {!loading && (
            <button
              className="sm:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8 cursor-pointer"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-foreground" />
              <span className="block w-5 h-0.5 bg-foreground" />
              <span className="block w-5 h-0.5 bg-foreground" />
            </button>
          )}
        </div>
      </nav>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-card border-l border-white/10 z-50 flex flex-col p-6 gap-6 transition-transform duration-300 sm:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={closeDrawer}
            aria-label="Close menu"
            className="text-text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-5 mt-4">
          {user ? (
            <>
              <Link
                href="/pricing"
                onClick={closeDrawer}
                className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                onClick={closeDrawer}
                className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
              >
                Docs
              </Link>
              <Link
                href="/dashboard"
                onClick={closeDrawer}
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/account"
                onClick={closeDrawer}
                className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
              >
                Account
              </Link>
              <button
                onClick={() => {
                  closeDrawer();
                  logout();
                }}
                className="text-left text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/pricing"
                onClick={closeDrawer}
                className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                onClick={closeDrawer}
                className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
              >
                Docs
              </Link>
              <Link
                href="/login"
                onClick={closeDrawer}
                className="text-sm font-medium text-text-muted hover:text-foreground transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={closeDrawer}
                className="text-sm font-medium bg-accent hover:bg-accent-hover transition-colors duration-200 px-4 py-1.5 rounded-md text-center"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
