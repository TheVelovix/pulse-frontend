"use client";
import { useSession } from "@/context/SessionContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { Mail, X } from "lucide-react";

export default function Login() {
  const session = useSession();
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);

  useEffect(() => {
    if (!session.loading && session.user) {
      router.replace("/dashboard");
    }
  }, [session.loading, router, session.user]);

  function openReset() {
    setShowReset(true);
    requestAnimationFrame(() => setResetVisible(true));
  }

  function closeReset() {
    setResetVisible(false);
    setTimeout(() => setShowReset(false), 200);
  }

  return (
    <>
      <form
        onSubmit={async e => {
          try {
            await session.login(e, { ...credentials, turnstileToken });
          } catch (err: unknown) {
            if (err instanceof Error) {
              if (err.message === "invalid-credentials")
                setError("Invalid email or password.");
              else if (err.message === "captcha-failed")
                setError("CAPTCHA verification failed. Please try again.");
            }
          }
        }}
        className="bg-card w-[90%] mx-auto border border-white my-auto p-4 rounded-lg sm:w-3/4 md:w-2/4 lg:w-2/5 2xl:w-1/4"
      >
        <h2 className="font-semibold text-center text-lg mb-4">
          Enter your credentials
        </h2>
        <div className="my-5 flex flex-col gap-2">
          <label htmlFor="email-input" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email-input"
            type="email"
            placeholder="user@example.com"
            value={credentials.email}
            onChange={e => {
              setError("");
              setCredentials({ ...credentials, email: e.target.value });
            }}
            className="w-full border border-white rounded-lg p-2 text-sm transition-colors duration-200 focus:outline-none focus:border-accent"
            required
          />
        </div>
        <div className="my-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password-input" className="text-sm font-medium">
              Password
            </label>
            <button
              type="button"
              onClick={openReset}
              className="text-xs text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password-input"
            type="password"
            value={credentials.password}
            onChange={e => {
              setError("");
              setCredentials({ ...credentials, password: e.target.value });
            }}
            className="w-full border border-white rounded-lg p-2 text-sm transition-colors duration-200 focus:outline-none focus:border-accent"
            required
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
        <div className="mt-6 mb-2 w-fit mx-auto">
          <Turnstile
            className="mx-auto"
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={setTurnstileToken}
          />
        </div>
        <button
          type="submit"
          className="bg-accent w-full py-2 mt-4 rounded-md transition-colors duration-200 hover:bg-accent-hover cursor-pointer"
        >
          Login
        </button>

        <hr className="mt-8" />
        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-accent">
            Sign up
          </a>
        </p>
      </form>

      {showReset && (
        <div
          className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200 ${resetVisible ? "opacity-100" : "opacity-0"}`}
          onClick={closeReset}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`bg-card border border-white/10 rounded-xl p-6 w-full max-w-md flex flex-col gap-5 transition-all duration-200 ${resetVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <ResetPasswordForm onClose={closeReset} />
          </div>
        </div>
      )}
    </>
  );
}

function ResetPasswordForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password?email=${encodeURIComponent(email)}`,
      { method: "POST" },
    );
    setLoading(false);
    if (res.status === 404) {
      setError("No account found with that email address.");
      return;
    }
    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setStep("code");
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password?code=${encodeURIComponent(code)}&newPassword=${encodeURIComponent(newPassword)}`,
      { method: "PATCH" },
    );
    setLoading(false);
    if (res.status === 400) {
      setError("Invalid or expired code. Please request a new one.");
      return;
    }
    if (res.status === 404) {
      setError("Account not found. Please try again.");
      return;
    }
    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setStep("done");
  }

  const subtitle = {
    email: "Enter your email and we'll send you a 6-digit code.",
    code: `Enter the code sent to ${email} and choose a new password.`,
    done: "Your password has been reset successfully.",
  }[step];

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold">Reset your password</h2>
          <p className="text-sm text-text-muted mt-1">{subtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-foreground transition-colors duration-150 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {step === "done" && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Mail size={22} />
          </div>
          <button
            onClick={onClose}
            className="mt-2 w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-sm font-semibold transition-colors duration-200 cursor-pointer"
          >
            Back to login
          </button>
        </div>
      )}

      {step === "email" && (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={e => {
                setError("");
                setEmail(e.target.value);
              }}
              className="w-full border border-white/20 rounded-lg p-2 text-sm bg-background transition-colors duration-200 focus:outline-none focus:border-accent"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-sm font-semibold bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send code"}
            </button>
          </div>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">6-digit code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={e => {
                setError("");
                setCode(e.target.value.replace(/\D/g, ""));
              }}
              className="w-full border border-white/20 rounded-lg p-2 text-sm bg-background tracking-widest transition-colors duration-200 focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => {
                setError("");
                setNewPassword(e.target.value);
              }}
              className="w-full border border-white/20 rounded-lg p-2 text-sm bg-background transition-colors duration-200 focus:outline-none focus:border-accent"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => {
                setError("");
                setConfirmPassword(e.target.value);
              }}
              className="w-full border border-white/20 rounded-lg p-2 text-sm bg-background transition-colors duration-200 focus:outline-none focus:border-accent"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
              }}
              className="text-sm text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer px-4 py-2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-sm font-semibold bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting…" : "Reset password"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
