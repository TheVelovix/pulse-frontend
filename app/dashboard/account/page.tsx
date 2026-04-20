"use client";
import { useSession, SubscriptionPlan } from "@/context/SessionContext";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getPaddleInstance } from "@paddle/paddle-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Crown, Zap, Trash2, AlertTriangle } from "lucide-react";

export default function AccountPage() {
  const { user, refetch, logout } = useSession();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [deleteEmailInput, setDeleteEmailInput] = useState("");

  const isPro = user?.subscriptionPlan === SubscriptionPlan.PRO;

  async function handleUpgrade() {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/subscribe`,
      { method: "POST" },
    );
    if (!res.ok) {
      toast.error("Failed to start checkout.");
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
  }

  async function handleCancelSubscription() {
    setCancellingSubscription(true);
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/cancel`,
      { method: "POST" },
    );
    setCancellingSubscription(false);
    if (!res.ok) {
      if (res.status === 400) {
        toast.error("You don't have an active subscription.");
      } else if (res.status === 500) {
        toast.error("Failed to cancel subscription. Please try again.");
      } else {
        toast.error("Something went wrong.");
      }
      return;
    }
    await refetch();
    toast.success("Subscription cancelled.");
  }

  function openDeleteConfirm() {
    setShowDeleteConfirm(true);
    requestAnimationFrame(() => setDeleteVisible(true));
  }

  function closeDeleteConfirm() {
    setDeleteVisible(false);
    setDeleteEmailInput("");
    setTimeout(() => setShowDeleteConfirm(false), 200);
  }

  async function handleDeleteAccount() {
    setDeletingAccount(true);
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/delete-account`,
      { method: "DELETE" },
    );
    setDeletingAccount(false);
    if (!res.ok) {
      toast.error("Failed to delete account.");
      closeDeleteConfirm();
      return;
    }
    await logout();
    router.replace("/");
  }

  return (
    <div className="mx-auto max-w-2xl w-full px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-text-muted text-sm mt-1">
          Manage your account and subscription.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Profile */}
        <section className="rounded-xl border border-white/10 bg-card p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
            Profile
          </h2>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-text-muted">Email</p>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
        </section>

        {/* Plan */}
        <section className="rounded-xl border border-white/10 bg-card p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
            Plan
          </h2>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${isPro ? "bg-accent/10 text-accent" : "bg-white/5 text-text-muted"}`}
              >
                {isPro ? <Crown size={18} /> : <Zap size={18} />}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {isPro ? "Pro" : "Free"}
                </p>
                <p className="text-xs text-text-muted">
                  {isPro
                    ? "Unlimited projects · 12 months retention"
                    : "5 projects · 30 days retention"}
                </p>
              </div>
            </div>

            {isPro ? (
              <button
                onClick={handleCancelSubscription}
                disabled={cancellingSubscription}
                className="text-sm text-text-muted hover:text-foreground border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancellingSubscription ? "Cancelling…" : "Cancel subscription"}
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                className="text-sm font-semibold bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Upgrade to Pro
              </button>
            )}
          </div>

          {!isPro && (
            <div className="rounded-lg border border-white/5 bg-background p-4">
              <p className="text-xs text-text-muted leading-relaxed">
                Upgrade to{" "}
                <span className="text-foreground font-medium">Pro ($7/mo)</span>{" "}
                for unlimited projects, 12 months of data, CSV export, weekly
                reports, real-time visitor count, and no Pulse branding.
              </p>
            </div>
          )}
        </section>

        {/* Danger zone */}
        <section className="rounded-xl border border-destructive/20 bg-card p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-destructive/70">
            Danger zone
          </h2>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-text-muted mt-0.5">
                Permanently remove your account and all data. This cannot be
                undone.
              </p>
            </div>
            <button
              onClick={openDeleteConfirm}
              className="text-sm font-medium text-destructive border border-destructive/20 hover:bg-destructive/10 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Delete account
            </button>
          </div>
        </section>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div
          className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200 ${deleteVisible ? "opacity-100" : "opacity-0"}`}
          onClick={closeDeleteConfirm}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`bg-card border border-white/10 rounded-xl p-6 w-full max-w-md flex flex-col gap-5 transition-all duration-200 ${deleteVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold">Delete account</h2>
                <p className="text-sm text-text-muted mt-1">
                  There is no going back. This will permanently delete your
                  account, all projects, and all analytics data.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 flex flex-col gap-1">
              <p className="text-xs text-destructive font-medium">
                This action is irreversible.
              </p>
              <p className="text-xs text-text-muted">
                All your projects and analytics history will be gone forever.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-text-muted">
                Type{" "}
                <span className="text-foreground font-medium">
                  {user?.email}
                </span>{" "}
                to confirm
              </label>
              <input
                type="email"
                value={deleteEmailInput}
                onChange={e => setDeleteEmailInput(e.target.value)}
                placeholder={user?.email}
                className="w-full border border-white/20 rounded-lg p-2 text-sm bg-background transition-colors duration-200 focus:outline-none focus:border-destructive"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={deletingAccount}
                className="text-sm text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer px-4 py-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount || deleteEmailInput !== user?.email}
                className="text-sm font-medium bg-destructive hover:bg-destructive/80 text-white transition-colors duration-200 px-4 py-2 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 size={14} />
                {deletingAccount ? "Deleting…" : "Delete my account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
