"use client";

import { SubscriptionPlan, useSession } from "@/context/SessionContext";

export default function Branding() {
  const session = useSession();
  if (session.user && session.user.subscriptionPlan === SubscriptionPlan.PRO)
    return null;
  return (
    <p className="text-xs text-text-muted">
      Made with &hearts; by{" "}
      <a href="https://www.velovix.com" target="_blank" className="underline">
        Velovix
      </a>
    </p>
  );
}
