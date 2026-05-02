"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import StatList from "./StatList";
import SearchConsoleList from "./SearchConsoleList";
import StatTable from "./StatTable";

export default function ProjectAnalytics({
  analytics,
  liveVisitors,
  isPro,
  searchConsoleData,
}: {
  analytics: Analytics;
  liveVisitors: number;
  isPro: boolean;
  searchConsoleData?: GoogleSearchConsoleData[];
}) {
  return (
    <>
      {/* Stat cards */}
      <div className="flex gap-3 flex-wrap">
        <div className="bg-card border border-white/10 rounded-lg p-6 w-fit min-w-40">
          <p className="text-text-muted text-sm mb-1">Total Views</p>
          <p className="text-3xl font-bold">
            {analytics.totalViews.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-white/10 rounded-lg p-6 w-fit min-w-40">
          <p className="text-text-muted text-sm mb-1">Unique Visitors</p>
          <p className="text-3xl font-bold">{analytics.uniqueVisitors}</p>
        </div>
        <div className="bg-card border border-white/10 rounded-lg p-6 w-fit min-w-40">
          <p className="text-text-muted text-sm mb-1">Bounce Rate</p>
          <p className="text-3xl font-bold">
            {(analytics.bounceRate * 100).toFixed(1)}%
          </p>
        </div>
        {liveVisitors > -1 && (
          <div className="bg-card border border-white/10 rounded-lg p-6 w-fit min-w-40">
            <p className="text-text-muted text-sm mb-1">Live Views</p>
            <p className="text-3xl font-bold">{liveVisitors}</p>
          </div>
        )}
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
          title="Entry Pages"
          items={analytics.entryPages.map(p => ({
            label: p.url,
            count: p.count,
          }))}
        />
        <StatList
          title="Top Pages"
          items={analytics.topPages.map(p => ({
            label: p.url,
            count: p.count,
          }))}
        />
        {isPro && (
          <StatList
            title="Time on Page (avg. seconds)"
            items={analytics.timeOnPage.map(p => ({
              label: p.url,
              count: p.avgSeconds,
            }))}
          />
        )}
        <StatList
          title="Top Referrers"
          items={analytics.topReferrers.map(r => ({
            label: r.referrer ?? "Direct",
            count: r.count,
          }))}
        />
        <StatList
          title="AI Referrers"
          items={analytics.aiTraffic.map(r => ({
            label: r.referrer ?? "Direct",
            count: r.count,
          }))}
        />
        <StatList
          title="Outbound Links"
          items={analytics.outboundLinks.map(r => ({
            label: r.url,
            count: r.count,
          }))}
        />
        <StatTable
          title="Devices"
          items={analytics.devices}
          columns={[
            { key: "deviceFamily", label: "Family" },
            { key: "deviceBrand", label: "Brand" },
            { key: "deviceModel", label: "Model" },
            { key: "isSpider", label: "Is Spider" },
            { key: "count", label: "Views" },
          ]}
        />
        <StatTable
          title="Operating Systems"
          items={analytics.operatingSystems}
          columns={[
            { key: "os", label: "OS Family" },
            { key: "osMajor", label: "OS Major" },
            { key: "count", label: "Count" },
          ]}
        />
        <StatTable
          title="Browsers"
          items={analytics.browsers}
          columns={[
            { key: "browser", label: "Browser" },
            { key: "browserMajor", label: "Version" },
            { key: "count", label: "Views" },
          ]}
        />
        <StatList
          title="Countries"
          items={analytics.countries.map(c => ({
            label: c.country ?? "Unknown",
            count: c.count,
          }))}
        />
        {isPro && (
          <StatList
            title="Custom Events"
            items={analytics.customEvents.map(e => ({
              label:
                e.totalRevenue != null
                  ? `${e.name} (€${e.totalRevenue.toFixed(2)})`
                  : e.name,
              count: e.count,
            }))}
          />
        )}
        {searchConsoleData && <SearchConsoleList data={searchConsoleData} />}
        {isPro && analytics.utmStats && (
          <div className="col-span-full flex flex-col gap-4">
            <h2 className="text-sm font-medium text-text-muted">
              UTM Campaign Tracking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatList
                title="Sources"
                items={analytics.utmStats.topSources.map(s => ({
                  label: s.source ?? "Unknown",
                  count: s.count,
                }))}
              />
              <StatList
                title="Mediums"
                items={analytics.utmStats.topMediums.map(m => ({
                  label: m.medium ?? "Unknown",
                  count: m.count,
                }))}
              />
              <StatList
                title="Campaigns"
                items={analytics.utmStats.topCampaigns.map(c => ({
                  label: c.campaign ?? "Unknown",
                  count: c.count,
                }))}
              />
              <StatList
                title="Content"
                items={analytics.utmStats.topContents.map(c => ({
                  label: c.content ?? "Unknown",
                  count: c.count,
                }))}
              />
              <StatList
                title="Terms"
                items={analytics.utmStats.topTerms.map(t => ({
                  label: t.term ?? "Unknown",
                  count: t.count,
                }))}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
