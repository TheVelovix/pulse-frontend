"use client";
import { useSession } from "@/context/SessionContext";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getPaddleInstance } from "@paddle/paddle-js";
import { Turnstile } from "@marsidev/react-turnstile";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [turnstileToken, setTurnstileToken] = useState("");
  const isPro = searchParams.get("plan") === "pro";

  useEffect(() => {
    if (!session.loading && session.user) {
      router.replace("/dashboard");
    }
  }, [session.loading, router, session.user]);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  async function signup(e: React.SubmitEvent) {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...credentials, turnstileToken }),
    });
    if (!res.ok) {
      const contentType = res.headers.get("Content-Type") ?? "";
      if (contentType.includes("text/plain")) {
        const responseText = await res.text();
        switch (responseText) {
          case "invalid-email":
            setError("Invalid email address.");
            break;
          case "user-already-exists":
            setError("Email already in use.");
            break;
          case "captcha-failed":
            setError("CAPTCHA verification failed. Please try again.");
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
    } else {
      toast("Account created successfully!");
      await session.refetch();
      if (isPro) {
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
  }
  return (
    <form
      onSubmit={e => signup(e)}
      className="bg-card w-[90%] mx-auto border border-white my-auto p-4 rounded-lg sm:w-3/4 md:w-2/4 lg:w-2/5 2xl:w-1/4"
    >
      <h2 className="font-semibold text-center text-lg mb-4">
        Create your account
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
        <label htmlFor="password-input" className="text-sm font-medium">
          Password
        </label>
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
      <div className="my-5 flex flex-col gap-2">
        <label htmlFor="confirm-password-input" className="text-sm font-medium">
          Confirm Password
        </label>
        <input
          id="confirm-password-input"
          type="password"
          value={credentials.confirmPassword}
          onChange={e => {
            setError("");
            setCredentials({ ...credentials, confirmPassword: e.target.value });
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
        Create Account
      </button>
      <p className="mt-6 text-sm  text-gray-300">
        By continuing you agree to our{" "}
        <Link href="/legal/terms" target="_blank" className="underline">
          Terms of service
        </Link>
        ,{" "}
        <Link href="/legal/privacy" target="_blank" className="underline">
          Privacy policy
        </Link>{" "}
        and{" "}
        <Link href="/legal/refund" target="_blank" className="underline">
          Refund policy
        </Link>
      </p>
      <hr className="mt-8" />
      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-accent">
          Log in
        </a>
      </p>
    </form>
  );
}
