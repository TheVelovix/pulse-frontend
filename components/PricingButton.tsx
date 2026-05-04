"use client";
import { useSession } from "@/context/SessionContext";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getPaddleInstance } from "@paddle/paddle-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  plan: "free" | "pro";
  label: string;
  variant: "primary" | "secondary";
  isAnnual?: boolean;
};

export default function PricingButton({
  plan,
  label,
  variant,
  isAnnual,
}: Props) {
  const router = useRouter();
  const session = useSession();
  async function handleClick() {
    if (plan === "free" && session.user) {
      toast.error("You are already signed up.");
    } else if (plan === "free" && !session.user) {
      router.push("/signup");
    } else if (plan === "pro" && session.user) {
      const res = await fetchWithAuth(
        `/api/checkout/subscribe?annual=${isAnnual ?? false}`,
        {
          method: "POST",
        },
      );
      if (!res.ok) {
        const text = await res.text();
        if (text === "already subscribed") {
          toast.error("You are already on the Pro plan.");
        } else {
          toast.error("Failed to subscribe.");
        }
        return;
      }
      const data = await res.json();
      const txnId = new URL(data.url).searchParams.get("_ptxn");
      getPaddleInstance()?.Checkout.open({
        transactionId: txnId!,
        settings: {
          successUrl: `${window.location.origin}/dashboard?justSubscribed=true`,
        },
      });
    } else {
      router.push(`/signup?plan=pro${isAnnual ? "&billing=annual" : ""}`);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-3 rounded-lg cursor-pointer text-sm font-semibold transition-colors duration-200 ${
        variant === "primary"
          ? "bg-accent hover:bg-accent-hover text-white"
          : "border border-white/10 bg-card hover:bg-white/5 text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
