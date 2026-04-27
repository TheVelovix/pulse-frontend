# Pulse — Frontend

> Privacy-friendly website analytics, without the complexity.

The frontend for [Pulse](https://pulse.velovix.com) — a lightweight, open source analytics platform. One script tag, zero cookies, no personal data stored.

![Pulse Dashboard](https://pulse.velovix.com/dashboard-screenshot.png)

**[Live Demo](https://pulse.velovix.com) · [Backend Repo](https://github.com/TheVelovix/pulse-backend) · [Docs](https://pulse.velovix.com/docs)**

---

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- Bun

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- Backend running (see [pulse-backend](https://github.com/TheVelovix/pulse-backend))

### Local Development

```bash
git clone https://github.com/TheVelovix/pulse-frontend
cd pulse-frontend
bun install
```

Create a `.env` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5119
BACKEND_URL=http://localhost:5119
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
NEXT_PUBLIC_PADDLE_TOKEN=your_paddle_token  # Optional, only if using payments
```

Then run:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Yes | Public-facing backend URL |
| `BACKEND_URL` | Yes | Internal backend URL (used by Next.js server) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes | Cloudflare Turnstile site key |
| `NEXT_PUBLIC_PADDLE_TOKEN` | No | Paddle client token (only needed for payments) |

---

## Features

- 📊 Page views, referrers, devices, countries
- 🔴 Real-time visitor count
- 📅 7d / 30d / all time / custom date ranges
- 📤 CSV export
- 📧 Weekly email reports
- 🔑 Developer API access
- 🏠 Self-hostable

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.
