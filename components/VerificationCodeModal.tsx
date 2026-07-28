"use client";
import { useSession } from "@/context/SessionContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getPaddleInstance } from "@paddle/paddle-js";
import { Turnstile } from "@marsidev/react-turnstile";

interface VerificationCodeModalProps {
  open: boolean;
  close: () => void;
  email: string;
  password: string;
  confirmPassword: string;
  promotionalCode?: string;
  isPro: boolean;
}

export default function VerificationCodeModal({
  open,
  close,
  email,
  password,
  confirmPassword,
  promotionalCode,
  isPro,
}: VerificationCodeModalProps) {
  const session = useSession();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setCode("");
    setTurnstileToken("");
    setError("");
    setSubmitting(false);
    close();
  }

  async function confirmSignup() {
    if (!code) {
      setError("Please enter the verification code.");
      return;
    }
    if (!turnstileToken) {
      setError("Please complete the verification challenge.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        confirmPassword,
        promotionalCode,
        verificationCode: code,
        turnstileToken,
      }),
    });
    if (!res.ok) {
      setSubmitting(false);
      const contentType = res.headers.get("Content-Type") ?? "";
      if (contentType.includes("text/plain")) {
        const responseText = await res.text();
        switch (responseText) {
          case "invalid-code":
            setError("Invalid or expired verification code.");
            break;
          case "captcha-failed":
            setError("CAPTCHA verification failed. Please try again.");
            break;
          case "invalid-promotional-code":
            setError("Invalid Promotional Code");
            break;
          case "invalid-email":
            setError("Invalid email address.");
            break;
          case "user-already-exists":
            setError("Email already in use.");
            break;
          default:
            setError("Unknown error occurred.");
        }
      } else if (contentType.includes("application/problem+json")) {
        const problem = await res.json();
        const messages: string[] = problem.errors
          ? Object.values(problem.errors as Record<string, string[]>).flat()
          : [];
        setError(messages[0] ?? problem.title ?? "Unknown error occurred.");
      } else {
        setError("Unknown error occurred.");
      }
      return;
    }
    toast("Account created successfully!");
    await session.refetch();
    // If the user accidentally navigated to the page with the isPro param
    // but also entered a valid promotional code don't open the checkout page
    if (isPro && !promotionalCode) {
      const checkoutRes = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/subscribe`,
        { method: "POST" },
      );
      if (!checkoutRes.ok) {
        toast.error("Failed to start checkout.");
        router.replace("/dashboard");
        return;
      }
      const data = await checkoutRes.json();
      const txnId = new URL(data.url).searchParams.get("_ptxn");
      getPaddleInstance()?.Checkout.open({
        transactionId: txnId!,
        settings: {
          successUrl: `${window.location.origin}/dashboard?justSubscribed=true`,
        },
      });
    } else {
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-md flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-bold">Confirm your email</h2>
          <p className="text-text-muted text-sm mt-1">
            We just sent a code to {email}, enter it below to finish creating
            your account.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="verification-code-input"
            className="text-sm font-medium"
          >
            Verification Code
          </label>
          <input
            id="verification-code-input"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            value={code}
            onChange={e => {
              setError("");
              setCode(e.target.value);
            }}
            disabled={submitting}
            className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div className="w-fit mx-auto">
          <Turnstile
            id="verification-code-widget"
            className="mx-auto"
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={setTurnstileToken}
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
            onClick={confirmSignup}
            disabled={submitting}
          >
            {submitting ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
