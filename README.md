# DevPulse

Developer Productivity & Portfolio Intelligence Platform

## Monorepo Structure

- `apps/web` – Next.js frontend
- `apps/api` – Express backend
- `packages/` – Shared UI and utils
- `prisma/` – DB models & seed
- `scripts/` – Sync workers, cron jobs
- `public/` – Images, favicon

## Quickstart

```bash
# Install dependencies
npm install

# Start frontend (Next.js)
npm run dev -w apps/web

# Start backend (Express)
npm start -w apps/api
```

## Features
- Track GitHub, LeetCode, Codeforces activity
- Visualize progress and generate a public profile
- Recruiter-friendly dashboards

See `DevPulse.txt` for full vision, architecture, and roadmap. 