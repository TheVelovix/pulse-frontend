import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useAnalytics(projectId: string, days?: number) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();

    async function fetchAnalytics() {
      const url = days
        ? `/api/projects/${projectId}/analytics?days=${days}`
        : `/api/projects/${projectId}/analytics`;
      const res = await fetchWithAuth(url, {
        signal: controller.signal,
        credentials: "include",
      });
      if (!res.ok) {
        toast.error("Failed to fetch analytics");
      } else {
        const data = await res.json();
        setAnalytics(data);
        setLoading(false);
      }
    }
    fetchAnalytics();
    return () => controller.abort();
  }, [projectId, days]);
  return { analytics, loading };
}
