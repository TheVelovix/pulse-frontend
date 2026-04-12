import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
}
export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`/api/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch session: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", {
      method: "DELETE",
      credentials: "include",
    });
    setUser(null);
    router.replace("/login");
  }
  return { user, loading, logout };
}
