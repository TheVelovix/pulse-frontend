import {
  BookOpen,
  Zap,
  Key,
  BarChart2,
  Layers,
  Radio,
  MousePointerClick,
} from "lucide-react";

const NAV = [
  { id: "introduction", label: "Introduction" },
  { id: "quick-start", label: "Quick Start" },
  { id: "authentication", label: "Authentication" },
  { id: "projects", label: "Projects" },
  { id: "analytics", label: "Analytics" },
  { id: "live-views", label: "Live Views" },
  { id: "custom-events", label: "Custom Events" },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-lg bg-background border border-white/10 px-5 py-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
      {children}
    </pre>
  );
}

function Badge({ method }: { method: "GET" | "POST" | "DELETE" }) {
  const colors = {
    GET: "bg-accent/10 text-accent",
    POST: "bg-green-500/10 text-green-400",
    DELETE: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-mono font-semibold ${colors[method]}`}
    >
      {method}
    </span>
  );
}

function Endpoint({
  method,
  path,
  description,
  params,
  response,
}: {
  method: "GET" | "POST" | "DELETE";
  path: string;
  description: string;
  params?: {
    name: string;
    in: string;
    required: boolean;
    description: string;
  }[];
  response: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge method={method} />
        <code className="text-sm font-mono text-foreground">{path}</code>
      </div>
      <p className="text-sm text-text-muted">{description}</p>
      {params && params.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Parameters
          </p>
          <div className="rounded-lg border border-white/5 overflow-hidden">
            {params.map((p, i) => (
              <div
                key={p.name}
                className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-2.5 text-xs ${i !== 0 ? "border-t border-white/5" : ""}`}
              >
                <code className="font-mono text-foreground shrink-0">
                  {p.name}
                </code>
                <span className="text-text-muted shrink-0">
                  {p.in} · {p.required ? "required" : "optional"}
                </span>
                <span className="text-text-muted">{p.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Response
        </p>
        <CodeBlock>{response}</CodeBlock>
      </div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-7xl w-full px-6 py-10 flex gap-10">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col gap-1 w-52 shrink-0">
        <div className="sticky top-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4 px-3">
            Documentation
          </p>
          {NAV.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block px-3 py-2 text-sm text-text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors duration-150"
            >
              {item.label}
            </a>
          ))}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-16">
        {/* Introduction */}
        <section id="introduction" className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
              <BookOpen size={18} />
            </div>
            <h1 className="text-2xl font-bold">Introduction</h1>
          </div>
          <p className="text-text-muted text-sm leading-relaxed">
            The Pulse REST API lets you access your analytics data, manage
            projects, and stream live visitor counts programmatically. All API
            endpoints are available to Pro subscribers using an API key.
          </p>
          <div className="rounded-xl border border-white/10 bg-card p-5 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Base URL
            </p>
            <CodeBlock>https://api.pulse.velovix.com</CodeBlock>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
              <Zap size={18} />
            </div>
            <h2 className="text-xl font-bold">Quick Start</h2>
          </div>
          <p className="text-text-muted text-sm leading-relaxed">
            Add Pulse to any website by pasting a single script tag into your{" "}
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">
              &lt;head&gt;
            </code>
            . No build step, no configuration.
          </p>
          <CodeBlock>{`<script
  src="https://api.pulse.velovix.com/viewsTracker.js"
  data-project-id="YOUR_PROJECT_ID"
  async
></script>`}</CodeBlock>
          <p className="text-text-muted text-sm leading-relaxed">
            Replace{" "}
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">
              YOUR_PROJECT_ID
            </code>{" "}
            with the ID found on your project&apos;s dashboard page. Page views
            will appear within seconds.
          </p>
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 flex flex-col gap-2">
            <p className="text-sm font-semibold">What gets tracked?</p>
            <p className="text-sm text-text-muted leading-relaxed">
              Page URL, referrer, device type, browser, and country that&apos;s
              it. No cookies, no fingerprinting, no personal data.
            </p>
          </div>
        </section>

        {/* Authentication */}
        <section id="authentication" className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
              <Key size={18} />
            </div>
            <h2 className="text-xl font-bold">Authentication</h2>
          </div>
          <p className="text-text-muted text-sm leading-relaxed">
            API requests are authenticated using an API key passed in the{" "}
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">
              X-Api-Key
            </code>{" "}
            header. API keys require a Pro subscription and can be created in
            your{" "}
            <a
              href="/dashboard/account"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              Account
            </a>{" "}
            page.
          </p>
          <CodeBlock>{`curl https://api.pulse.velovix.com/api/projects \\
  -H "X-Api-Key: pulse_live_your_key_here"`}</CodeBlock>
          <div className="rounded-xl border border-white/10 bg-card p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Managing keys via API
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-sm">
                <Badge method="GET" />
                <code className="font-mono text-xs">/api/user/apiKeys</code>
                <span className="text-text-muted">List your API keys</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Badge method="POST" />
                <code className="font-mono text-xs">
                  /api/user/apiKeys?name=
                </code>
                <span className="text-text-muted">Create a new key</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Badge method="DELETE" />
                <code className="font-mono text-xs">
                  /api/user/apiKeys?name=
                </code>
                <span className="text-text-muted">Revoke a key by name</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
            <p className="text-sm font-semibold text-destructive mb-1">
              Store your key securely
            </p>
            <p className="text-sm text-text-muted">
              Your key is only shown once at creation time. Pulse stores a
              hashed copy and cannot recover it. If you lose it, delete the key
              and create a new one.
            </p>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
              <Layers size={18} />
            </div>
            <h2 className="text-xl font-bold">Projects</h2>
          </div>
          <p className="text-text-muted text-sm leading-relaxed">
            A project represents a single tracked domain. Each project gets its
            own ID used to scope analytics queries.
          </p>

          <Endpoint
            method="GET"
            path="/api/projects"
            description="Returns all projects belonging to the authenticated user."
            response={`[
  {
    "id": "db5790a0-847c-40fa-b503-d343ba28f3c6",
    "name": "My Site",
    "domain": "example.com",
    "createdAt": "2025-01-15T10:00:00Z"
  }
]`}
          />

          <Endpoint
            method="GET"
            path="/api/projects/{id}"
            description="Returns a single project by its ID."
            params={[
              {
                name: "id",
                in: "path",
                required: true,
                description: "The project UUID.",
              },
            ]}
            response={`{
  "id": "db5790a0-847c-40fa-b503-d343ba28f3c6",
  "name": "My Site",
  "domain": "example.com",
  "createdAt": "2025-01-15T10:00:00Z"
}`}
          />

          <Endpoint
            method="POST"
            path="/api/projects"
            description="Creates a new project. Free accounts are limited to 5 projects."
            params={[
              {
                name: "name",
                in: "body",
                required: true,
                description: "Display name for the project.",
              },
              {
                name: "domain",
                in: "body",
                required: true,
                description: "The domain to track (e.g. example.com).",
              },
            ]}
            response={`project-created`}
          />

          <Endpoint
            method="DELETE"
            path="/api/projects/{id}"
            description="Permanently deletes a project and all its analytics data."
            params={[
              {
                name: "id",
                in: "path",
                required: true,
                description: "The project UUID.",
              },
            ]}
            response={`200 OK`}
          />
        </section>

        {/* Analytics */}
        <section id="analytics" className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
              <BarChart2 size={18} />
            </div>
            <h2 className="text-xl font-bold">Analytics</h2>
          </div>
          <p className="text-text-muted text-sm leading-relaxed">
            Query aggregated analytics for any of your projects. Data is
            retained for 30 days on the Free plan and 2 years on Pro.
          </p>

          <Endpoint
            method="GET"
            path="/api/analytics/{id}"
            description="Returns aggregated analytics for a project over the given time range."
            params={[
              {
                name: "id",
                in: "path",
                required: true,
                description: "The project UUID.",
              },
              {
                name: "from",
                in: "query",
                required: false,
                description: "Start date (ISO 8601). Defaults to 30 days ago.",
              },
              {
                name: "to",
                in: "query",
                required: false,
                description: "End date (ISO 8601). Defaults to today.",
              },
            ]}
            response={`{
  "totalViews": 4821,
  "viewsPerDay": [
    { "date": "2025-04-01", "count": 142 }
  ],
  "topPages": [
    { "url": "/", "count": 1930 }
  ],
  "topReferrers": [
    { "referrer": "google.com", "count": 874 }
  ],
  "devices": [
    { "device": "desktop", "count": 3100 }
  ],
  "browsers": [
    { "browser": "Chrome", "count": 2500 }
  ],
  "countries": [
    { "country": "US", "count": 1800 }
  ]
}`}
          />

          <Endpoint
            method="GET"
            path="/api/analytics/{id}/export"
            description="Returns the same analytics payload as a downloadable CSV file."
            params={[
              {
                name: "id",
                in: "path",
                required: true,
                description: "The project UUID.",
              },
              {
                name: "from",
                in: "query",
                required: false,
                description: "Start date (ISO 8601).",
              },
              {
                name: "to",
                in: "query",
                required: false,
                description: "End date (ISO 8601).",
              },
            ]}
            response={`Content-Type: text/csv

date,views
2025-04-01,142
2025-04-02,198
...`}
          />
        </section>

        {/* Live Views */}
        <section id="live-views" className="flex flex-col gap-6 pb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
              <Radio size={18} />
            </div>
            <h2 className="text-xl font-bold">Live Views</h2>
          </div>
          <p className="text-text-muted text-sm leading-relaxed">
            The live endpoint streams the current active visitor count for a
            project using Server-Sent Events (SSE). The connection stays open
            and pushes an update whenever the count changes.
          </p>

          <Endpoint
            method="GET"
            path="/api/analytics/{id}/live"
            description="Opens a persistent SSE stream that emits the live visitor count."
            params={[
              {
                name: "id",
                in: "path",
                required: true,
                description: "The project UUID.",
              },
            ]}
            response={`data: 0
data: 1
...`}
          />

          <div className="rounded-xl border border-white/10 bg-card p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Example — JavaScript
            </p>
            <CodeBlock>{`const es = new EventSource(
  "https://api.pulse.velovix.com/api/analytics/PROJECT_ID/live?api_key=pulse_live_your_key_here"
);
es.onmessage = (e) => {
  const liveVisitors = parseInt(e.data);
  console.log("Live visitors:", liveVisitors);
};`}</CodeBlock>
          </div>

          <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
            <p className="text-sm font-semibold mb-1">Pro only</p>
            <p className="text-sm text-text-muted">
              Live visitor data is only available on the Pro plan. The endpoint
              returns{" "}
              <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">
                401
              </code>{" "}
              for Free accounts.
            </p>
          </div>
        </section>
        {/* Custom Events */}
        <section id="custom-events" className="flex flex-col gap-6 pb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
              <MousePointerClick size={18} />
            </div>
            <h2 className="text-xl font-bold">Custom Events</h2>
          </div>
          <p className="text-text-muted text-sm leading-relaxed">
            Custom events let you track specific actions on your site like
            signups, purchases, or button clicks. They are available to Pro
            subscribers and require the Pulse script to be installed.
          </p>

          {/* Basic usage */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Basic usage</p>
            <p className="text-text-muted text-sm leading-relaxed">
              Once the script is installed, call{" "}
              <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">
                window.pulse.track()
              </code>{" "}
              from anywhere on your site.
            </p>
            <CodeBlock>{`// simple event
        pulse.track("signup");

        // with custom properties
        pulse.track("purchase", { plan: "pro" });

        // 404 tracking
        pulse.track("404", { path: window.location.pathname });`}</CodeBlock>
          </div>

          {/* TypeScript support */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">TypeScript support</p>
            <p className="text-text-muted text-sm leading-relaxed">
              For intellisense and type safety, paste this declaration file into
              your project:
            </p>
            <CodeBlock>{`// pulse.d.ts
        interface PulseProps {
          [key: string]: string | number | boolean;
        }

        interface Pulse {
          track: (name: string, props?: PulseProps) => void;
        }

        declare global {
          interface Window {
            pulse: Pulse;
          }
        }`}</CodeBlock>
          </div>

          {/* Revenue tracking */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Revenue tracking</p>
            <p className="text-text-muted text-sm leading-relaxed">
              Pass a{" "}
              <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">
                revenue
              </code>{" "}
              property to track monetary value associated with an event. Revenue
              is displayed separately in your dashboard.
            </p>
            <CodeBlock>{`pulse.track("purchase", { plan: "pro", revenue: 7.00 });`}</CodeBlock>
          </div>

          {/* API endpoint */}
          <Endpoint
            method="POST"
            path="/api/events"
            description="Records a custom event for a project. Called automatically by pulse.track() — you rarely need to call this directly."
            params={[
              {
                name: "projectId",
                in: "body",
                required: true,
                description: "The project UUID.",
              },
              {
                name: "name",
                in: "body",
                required: true,
                description: "Event name (e.g. signup, purchase, 404).",
              },
              {
                name: "url",
                in: "body",
                required: false,
                description: "Page URL where the event occurred.",
              },
              {
                name: "visitorId",
                in: "body",
                required: false,
                description: "Visitor ID from localStorage.",
              },
              {
                name: "revenue",
                in: "body",
                required: false,
                description: "Monetary value associated with the event.",
              },
              {
                name: "props",
                in: "body",
                required: false,
                description: "Key-value pairs of custom properties.",
              },
            ]}
            response={`200 OK`}
          />

          <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
            <p className="text-sm font-semibold mb-1">Pro only</p>
            <p className="text-sm text-text-muted">
              Custom events are only available on the Pro plan. Calls from Free
              plan projects return{" "}
              <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">
                403
              </code>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
