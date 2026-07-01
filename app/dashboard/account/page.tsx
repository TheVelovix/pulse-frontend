"use client";
import { useSession, SubscriptionPlan } from "@/context/SessionContext";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getPaddleInstance } from "@paddle/paddle-js";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Crown,
  Zap,
  Trash2,
  AlertTriangle,
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Ticket,
  Mail,
} from "lucide-react";

export default function AccountPage() {
  const { user, refetch, logout } = useSession();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [deleteEmailInput, setDeleteEmailInput] = useState("");
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [activatingPromoCode, setActivatingPromoCode] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailChangeStep, setEmailChangeStep] = useState<"email" | "code">(
    "email",
  );
  const [newEmailInput, setNewEmailInput] = useState("");
  const [emailCodeInput, setEmailCodeInput] = useState("");
  const [requestingEmailChange, setRequestingEmailChange] = useState(false);
  const [confirmingEmailChange, setConfirmingEmailChange] = useState(false);

  const isPro = user?.subscriptionPlan === SubscriptionPlan.PRO;

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [revealedKeyName, setRevealedKeyName] = useState("");
  const [showRevealedKey, setShowRevealedKey] = useState(false);
  const [deletingKeyName, setDeletingKeyName] = useState<string | null>(null);

  useEffect(() => {
    fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/apiKeys`)
      .then(r => (r.ok ? r.json() : []))
      .then((data: ApiKey[]) => setApiKeys(data))
      .catch(() => setApiKeys([]))
      .finally(() => setLoadingKeys(false));
  }, []);

  async function handleCreateKey() {
    if (!newKeyName.trim()) return;
    setCreatingKey(true);
    const name = newKeyName.trim();
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/apiKeys?name=${encodeURIComponent(name)}`,
      { method: "POST" },
    );
    setCreatingKey(false);
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 400 && text === "api-key-name-taken") {
        toast.error("A key with that name already exists.");
      } else {
        toast.error("Failed to create API key.");
      }
      return;
    }
    const data = await res.json();
    // Refetch the list so the new key appears with its server-assigned id/preview
    fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/apiKeys`)
      .then(r => (r.ok ? r.json() : apiKeys))
      .then((updated: ApiKey[]) => setApiKeys(updated))
      .catch(() => {});
    setRevealedKey(data.key);
    setRevealedKeyName(name);
    setShowRevealedKey(false);
    setShowCreateKey(false);
    setNewKeyName("");
  }

  async function handleDeleteKey(name: string) {
    setDeletingKeyName(name);
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/apiKeys?name=${encodeURIComponent(name)}`,
      { method: "DELETE" },
    );
    setDeletingKeyName(null);
    if (!res.ok) {
      toast.error("Failed to revoke API key.");
      return;
    }
    setApiKeys(prev => prev.filter(k => k.name !== name));
    toast.success("API key revoked.");
  }

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
        const text = await res.text();
        if (text === "cannot-cancel-bundled-subscription") {
          toast.error(
            "You can't cancel a subscription that was activated with a promo code",
          );
        } else toast.error("You don't have an active subscription.");
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

  function openPromoModal() {
    setShowPromoModal(true);
    requestAnimationFrame(() => setPromoModalVisible(true));
  }

  function closePromoModal() {
    setPromoModalVisible(false);
    setPromoCodeInput("");
    setTimeout(() => setShowPromoModal(false), 200);
  }

  async function handleActivatePromoCode() {
    const code = promoCodeInput.trim();
    if (!code) return;
    setActivatingPromoCode(true);
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/activateCode?promoCode=${encodeURIComponent(code)}`,
      { method: "POST" },
    );
    setActivatingPromoCode(false);
    if (!res.ok) {
      const text = await res.text();
      if (text === "invalid-code") {
        toast.error("That promo code is invalid or already used.");
      } else if (text === "already-subscribed") {
        toast.error("You already have an active subscription.");
      } else {
        toast.error("Failed to activate promo code. Please try again.");
      }
      return;
    }
    await refetch();
    toast.success("Promo code activated!");
    closePromoModal();
  }

  function openEmailModal() {
    setEmailChangeStep("email");
    setNewEmailInput("");
    setEmailCodeInput("");
    setShowEmailModal(true);
    requestAnimationFrame(() => setEmailModalVisible(true));
  }

  function closeEmailModal() {
    setEmailModalVisible(false);
    setTimeout(() => {
      setShowEmailModal(false);
      setEmailChangeStep("email");
      setNewEmailInput("");
      setEmailCodeInput("");
    }, 200);
  }

  async function handleRequestEmailChange() {
    const email = newEmailInput.trim();
    if (!email) return;
    setRequestingEmailChange(true);
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/requestEmailChange`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    setRequestingEmailChange(false);
    if (!res.ok) {
      const text = await res.text();
      if (text === "email-in-use") {
        toast.error("That email address is already in use.");
      } else {
        toast.error("Failed to send verification code. Please try again.");
      }
      return;
    }
    setEmailChangeStep("code");
  }

  async function handleConfirmEmailChange() {
    const code = emailCodeInput.trim();
    if (!code) return;
    setConfirmingEmailChange(true);
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/confirmEmailChange?code=${encodeURIComponent(code)}`,
      { method: "PATCH" },
    );
    setConfirmingEmailChange(false);
    if (!res.ok) {
      const text = await res.text();
      if (text === "code-expired") {
        toast.error("That code has expired. Please request a new one.");
        setEmailChangeStep("email");
        setEmailCodeInput("");
      } else {
        toast.error("Invalid verification code.");
      }
      return;
    }
    await refetch();
    toast.success("Email updated successfully!");
    closeEmailModal();
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
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-text-muted">Email</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <button
              onClick={openEmailModal}
              className="text-sm font-medium text-text-muted hover:text-foreground border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer shrink-0"
            >
              Change email
            </button>
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
                    ? "Unlimited projects · 24 months retention"
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
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleUpgrade}
                  className="text-sm font-semibold bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Upgrade to Pro
                </button>
                <button
                  onClick={openPromoModal}
                  className="text-sm font-semibold bg-background hover:bg-card px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Activate Promo Code
                </button>
              </div>
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

        {/* API Keys */}
        {user?.subscriptionPlan === SubscriptionPlan.PRO && (
          <section className="rounded-xl border border-white/10 bg-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
                API Keys
              </h2>
              <button
                onClick={() => setShowCreateKey(v => !v)}
                className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-foreground border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <Plus size={14} />
                New key
              </button>
            </div>

            {showCreateKey && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCreateKey()}
                  placeholder="Key name (e.g. Production)"
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-white/40 transition-colors duration-200"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCreateKey}
                    disabled={creatingKey || !newKeyName.trim()}
                    className="flex-1 text-sm font-medium bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingKey ? "Creating…" : "Create"}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateKey(false);
                      setNewKeyName("");
                    }}
                    className="text-sm text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {loadingKeys ? (
              <p className="text-xs text-text-muted">Loading…</p>
            ) : apiKeys.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-text-muted">
                <Key size={24} className="opacity-30" />
                <p className="text-xs">No API keys yet.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {apiKeys.map(key => (
                  <li
                    key={key.name}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-background px-4 py-3"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-sm font-medium truncate">{key.name}</p>
                      <p className="text-xs text-text-muted">
                        Created {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleDeleteKey(key.name)}
                        disabled={deletingKeyName === key.name}
                        className="text-text-muted hover:text-destructive transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Revoke key"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

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

      {/* New API key reveal modal */}
      {revealedKey && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setRevealedKey(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-card border border-white/10 rounded-xl p-6 w-full max-w-md flex flex-col gap-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Key size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold">API key created</h2>
                <p className="text-sm text-text-muted mt-1">
                  Copy{" "}
                  <span className="text-foreground font-medium">
                    {revealedKeyName}
                  </span>{" "}
                  now. It won&apos;t be shown again.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-background px-4 py-3 flex items-center gap-3">
              <p className="flex-1 text-xs font-mono break-all">
                {showRevealedKey ? revealedKey : revealedKey.replace(/./g, "•")}
              </p>
              <button
                onClick={() => setShowRevealedKey(v => !v)}
                className="text-text-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
                aria-label={showRevealedKey ? "Hide key" : "Show key"}
              >
                {showRevealedKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(revealedKey);
                  toast.success("Copied!");
                }}
                className="text-text-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
                aria-label="Copy key"
              >
                <Copy size={14} />
              </button>
            </div>

            <button
              onClick={() => setRevealedKey(null)}
              className="self-end text-sm font-medium bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Change email modal */}
      {showEmailModal && (
        <div
          className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200 ${emailModalVisible ? "opacity-100" : "opacity-0"}`}
          onClick={closeEmailModal}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`bg-card border border-white/10 rounded-xl p-6 w-full max-w-md flex flex-col gap-5 transition-all duration-200 ${emailModalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Mail size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold">
                  {emailChangeStep === "email"
                    ? "Change email"
                    : "Verify your new email"}
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  {emailChangeStep === "email"
                    ? "Enter your new email address. We'll send you a verification code."
                    : `Enter the 6-character code sent to ${newEmailInput.trim()}.`}
                </p>
              </div>
            </div>

            {emailChangeStep === "email" ? (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-text-muted">
                  New email address
                </label>
                <input
                  type="email"
                  value={newEmailInput}
                  onChange={e => setNewEmailInput(e.target.value)}
                  onKeyDown={e =>
                    e.key === "Enter" && handleRequestEmailChange()
                  }
                  placeholder="you@example.com"
                  autoFocus
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-white/40 transition-colors duration-200"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-text-muted">
                  Verification code
                </label>
                <input
                  type="text"
                  value={emailCodeInput}
                  onChange={e => setEmailCodeInput(e.target.value)}
                  onKeyDown={e =>
                    e.key === "Enter" && handleConfirmEmailChange()
                  }
                  placeholder="XXXXXX"
                  maxLength={6}
                  autoFocus
                  className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-white/40 transition-colors duration-200 tracking-widest font-mono uppercase"
                />
                <button
                  type="button"
                  onClick={() => {
                    setEmailChangeStep("email");
                    setEmailCodeInput("");
                  }}
                  className="text-xs text-text-muted hover:text-foreground transition-colors duration-200 self-start"
                >
                  Use a different email
                </button>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeEmailModal}
                disabled={requestingEmailChange || confirmingEmailChange}
                className="text-sm text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer px-4 py-2 disabled:opacity-50"
              >
                Cancel
              </button>
              {emailChangeStep === "email" ? (
                <button
                  type="button"
                  onClick={handleRequestEmailChange}
                  disabled={requestingEmailChange || !newEmailInput.trim()}
                  className="text-sm font-semibold bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {requestingEmailChange ? "Sending…" : "Send code"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmEmailChange}
                  disabled={
                    confirmingEmailChange || emailCodeInput.trim().length < 6
                  }
                  className="text-sm font-semibold bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {confirmingEmailChange ? "Confirming…" : "Confirm"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activate promo code modal */}
      {showPromoModal && (
        <div
          className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200 ${promoModalVisible ? "opacity-100" : "opacity-0"}`}
          onClick={closePromoModal}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`bg-card border border-white/10 rounded-xl p-6 w-full max-w-md flex flex-col gap-5 transition-all duration-200 ${promoModalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Ticket size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold">Activate promo code</h2>
                <p className="text-sm text-text-muted mt-1">
                  Enter your promo code below to activate Pro access.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-text-muted">Promo code</label>
              <input
                type="text"
                value={promoCodeInput}
                onChange={e => setPromoCodeInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleActivatePromoCode()}
                placeholder="e.g. WELCOME2026"
                autoFocus
                className="w-full border border-white/20 rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-white/40 transition-colors duration-200"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closePromoModal}
                disabled={activatingPromoCode}
                className="text-sm text-text-muted hover:text-foreground transition-colors duration-200 cursor-pointer px-4 py-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleActivatePromoCode}
                disabled={activatingPromoCode || !promoCodeInput.trim()}
                className="text-sm font-semibold bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activatingPromoCode ? "Activating…" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

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
