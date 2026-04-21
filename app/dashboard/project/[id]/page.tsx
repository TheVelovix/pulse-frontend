"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SubscriptionPlan, useSession } from "@/context/SessionContext";
import DateRangePicker from "@/components/DateRangePicker";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toast } from "sonner";

const DATE_RANGES = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "All time", value: undefined },
];

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [days, setDays] = useState<number | undefined>(30);
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  const { analytics, loading } = useAnalytics(id, days, customFrom, customTo);
  const [project, setProject] = useState<Project | null>(null);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const session = useSession();

  useEffect(() => {
    fetch(`/api/projects`, { credentials: "include" })
      .then(res => res.json())
      .then((data: Project[]) => {
        const found = data.find(p => p.id === id);
        setProject(found ?? null);
      });
  }, [id]);

  async function exportCsv() {
    const params = new URLSearchParams();
    if (customFrom && customTo) {
      params.set("from", customFrom);
      params.set("to", customTo);
    } else if (days) {
      params.set("days", days.toString());
    }

    const query = params.size > 0 ? `${params.toString()}` : "";
    const res = await fetchWithAuth(`/api/analytics/${id}/export${query}`, {
      credentials: "include",
    });
    if (!res.ok) {
      toast.error("Export failed");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = `${project?.name ?? "analytics"}-export.csv`;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  const [liveVisitors, setLiveVisitors] = useState<number>(0);
  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics/${id}/live`,
      { withCredentials: true },
    );

    eventSource.onmessage = e => {
      setLiveVisitors(parseInt(e.data));
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [id]);
  if (loading)
    return <p className="text-text-muted text-sm p-10">Loading...</p>;
  if (!analytics)
    return (
      <p className="text-text-muted text-sm p-10">Failed to load analytics.</p>
    );

  return (
    <div className="mx-auto max-w-7xl w-full px-6 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{project?.name} Analytics</h1>
        <div className="flex gap-2">
          {DATE_RANGES.map(range => {
            if (
              range.label === "All time" &&
              session.user?.subscriptionPlan !== SubscriptionPlan.PRO
            )
              return null;
            return (
              <button
                key={range.label}
                onClick={() => {
                  setDays(range.value);
                  setCustomFrom("");
                  setCustomTo("");
                }}
                className={`text-sm px-3 py-1.5 rounded-md transition-colors duration-200 cursor-pointer ${
                  days === range.value && !customFrom
                    ? "bg-accent text-white"
                    : "bg-card border border-white/10 text-text-muted hover:text-foreground"
                }`}
              >
                {range.label}
              </button>
            );
          })}
          {session.user?.subscriptionPlan === SubscriptionPlan.PRO && (
            <DateRangePicker
              key={customFrom + customTo}
              from={customFrom}
              to={customTo}
              onChangeAction={(from, to) => {
                setCustomFrom(from);
                setCustomTo(to);
                setDays(undefined);
              }}
              onClearAction={() => {
                setCustomFrom("");
                setCustomTo("");
                setDays(30);
              }}
            />
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setShowScriptModal(true)}
          className="bg-card border border-white/10 rounded-lg py-4 w-40 cursor-pointer transition-all duration-200 hover:opacity-80"
        >
          <p>Copy Script</p>
        </button>

        {session.user?.subscriptionPlan === SubscriptionPlan.PRO && (
          <button
            onClick={() => exportCsv()}
            className="bg-card border border-white/10 rounded-lg py-4 w-40 cursor-pointer transition-all duration-200 hover:opacity-80"
          >
            <p>Export CSV</p>
          </button>
        )}
      </div>
      <ScriptModal
        projectId={id}
        open={showScriptModal}
        onClose={() => setShowScriptModal(false)}
      />
      <div className="flex gap-3">
        {/* Total Views */}
        <div className="bg-card border border-white/10 rounded-lg p-6 w-fit min-w-40">
          <p className="text-text-muted text-sm mb-1">Total Views</p>
          <p className="text-3xl font-bold">
            {analytics.totalViews.toLocaleString()}
          </p>
        </div>
        {/*Live Views*/}
        <div className="bg-card border border-white/10 rounded-lg p-6 w-fit min-w-40">
          <p className="text-text-muted text-sm mb-1">Live Views</p>
          <p className="text-3xl font-bold">{liveVisitors}</p>
        </div>
      </div>
      {/* Views per day chart */}
      <div className="bg-card border border-white/10 rounded-lg p-6">
        <h2 className="text-sm font-medium text-text-muted mb-4">
          Views per day
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={analytics.viewsPerDay}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={val =>
                new Date(val).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              labelFormatter={val =>
                new Date(val).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Lists grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatList
          title="Top Pages"
          items={analytics.topPages.map(p => ({
            label: p.url,
            count: p.count,
          }))}
        />
        <StatList
          title="Top Referrers"
          items={analytics.topReferrers.map(r => ({
            label: r.referrer ?? "Direct",
            count: r.count,
          }))}
        />
        <StatList
          title="Devices"
          items={analytics.devices.map(d => ({
            label: d.device ?? "Unknown",
            count: d.count,
          }))}
        />
        <StatList
          title="Browsers"
          items={analytics.browsers.map(b => ({
            label: b.browser ?? "Unknown",
            count: b.count,
          }))}
        />
        <StatList
          title="Countries"
          items={analytics.countries.map(c => ({
            label: c.country ?? "Unknown",
            count: c.count,
          }))}
        />
      </div>
    </div>
  );
}

function ScriptModal({
  projectId,
  open,
  onClose,
}: {
  projectId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scriptTag = `<script src="https://api.pulse.velovix.com/viewsTracker.js" data-project-id="${projectId}"></script>`;

  function handleCopy() {
    navigator.clipboard.writeText(scriptTag).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-card border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-xl transition-all duration-300 ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Install Script</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-foreground transition-colors duration-150 text-xl leading-none cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="text-text-muted text-sm mb-4">
          Paste this script tag inside the{" "}
          <code className="text-accent">&lt;head&gt;</code> of your site.
        </p>
        <div className="relative bg-background border border-white/10 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground whitespace-pre-wrap break-all pr-2">
            {scriptTag}
          </pre>
        </div>
        <button
          onClick={handleCopy}
          className={`mt-4 w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
            copied
              ? "bg-green-600/20 border border-green-500/40 text-green-400"
              : "bg-accent hover:opacity-80 text-white"
          }`}
        >
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>
      </div>
    </div>
  );
}

function StatList({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  return (
    <div className="bg-card border border-white/10 rounded-lg p-5 overflow-x-scroll">
      <h2 className="text-sm font-medium text-text-muted mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-text-muted text-xs">No data</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <div className="relative flex-1 mr-4">
                <div
                  className="absolute inset-y-0 left-0 bg-accent/10 rounded"
                  style={{ width: `${(item.count / total) * 100}%` }}
                />
                <span className="relative px-2 py-0.5 truncate block">
                  {item.label}
                </span>
              </div>
              <span className="text-text-muted shrink-0">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
