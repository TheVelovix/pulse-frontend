import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useAnalytics(
  projectId: string,
  days?: number,
  from?: string,
  to?: string,
) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();

    async function fetchAnalytics() {
      const params = new URLSearchParams();
      if (from && to) {
        params.set("from", from);
        params.set("to", to);
      } else if (days) {
        params.set("days", days.toString());
      }
      const query = params.size > 0 ? `?${params.toString()}` : "";
      const url = `/api/projects/${projectId}/analytics${query}`;
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
  }, [projectId, days, from, to]);
  return { analytics, loading };
}
