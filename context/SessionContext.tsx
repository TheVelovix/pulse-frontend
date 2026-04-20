"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export enum SubscriptionPlan {
  FREE = "free",
  PRO = "pro",
}

interface User {
  id: string;
  email: string;
  subscriptionPlan: SubscriptionPlan;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  login: (
    e: React.SubmitEvent,
    credentials: { email: string; password: string },
  ) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchSession() {
    try {
      let res = await fetch("/api/auth/me", { credentials: "include" });

      if (res.status === 401) {
        const refreshRes = await fetch("/api/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          res = await fetch("/api/auth/me", { credentials: "include" });
        } else {
          setUser(null);
          return;
        }
      }

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSession();
  }, []);

  async function login(
    e: React.SubmitEvent,
    credentials: { email: string; password: string },
  ) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("text/plain")) {
        const message = await res.text();
        if (message === "invalid-credentials") throw new Error(message);
      } else {
        toast.error("Unknown error occurred.");
      }
    } else {
      await fetchSession();
      toast("Login successful!");
      setTimeout(() => router.replace("/dashboard"), 1000);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "DELETE",
      credentials: "include",
    });
    setUser(null);
    router.replace("/login");
  }

  return (
    <SessionContext.Provider
      value={{ user, loading, login, logout, refetch: fetchSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within SessionProvider");
  return context;
}
