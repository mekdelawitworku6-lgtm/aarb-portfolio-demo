# AARB Portfolio Demo

An interactive, **fictional-data-only** showcase of the Addis Ababa Revenue Bureau platform, published as a standalone static site for a portfolio. It runs entirely in the browser: no backend, database, login or API keys.

> No real reports, officers, taxpayers, TINs or chat history are used. Every action shows a local "Demo only" confirmation.

---

## What is included

| Section | What you can do |
|---|---|
| **Overview** | Portfolio-style hero with architecture, capability stats and quick links. |
| **Citizen app** | Onboarding, sign in/sign up, home, report creation, receipt, tracking, TIN verification, impact stats, AI chat, reports list, profile, notifications and hotline dialogs. Switch EN / አማ / OM. |
| **Officer app** | Welcome/login, officer panel, case queue, case detail with evidence and status actions, case map, TIN lookup/flagging, chat and profile. Switch EN / አማ. |
| **Admin panel** | Every sidebar page (Dashboard, Reports Management, Officers, TIN Registry, Flagged TINs, Hierarchy, Analytics, Audit Logs, Knowledge Base, Settings and assistant log). Open a report detail and switch between four roles, including view-only. |
| **Platform** | Architecture diagram, capability matrix, REST API surface, repository structure and data-safety notes. |

The interfaces use the real project's palette (`#145491` primary), DM Sans / DM Mono fonts and the bureau logo copied from the Flutter assets.

---

## Deploy to Render (recommended)

This repo includes a `render.yaml` blueprint, so Render builds the site automatically from the root.

1. Go to <https://dashboard.render.com> → **New +** → **Blueprint**.
2. Connect this GitHub repo (`mekdelawitworku6-lgtm/aarb-portfolio-demo`).
3. Render detects `render.yaml` and creates one **Static Site**:
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `./dist`
4. Click **Apply**. Your site will be live at `https://aarb-portfolio-demo.onrender.com` (or the URL Render assigns).
5. After it is live, open `src/config.ts`, set `liveUrl` to that URL, and push the change — the footer link will then point to the live demo.

Every push to `main` triggers a new deploy automatically (`autoDeployTrigger: commit`).

If you prefer manual setup instead of the blueprint: **New + → Static Site**, connect the repo, leave **Root Directory** blank, and use the build command and publish directory above.

---

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

Production build check:

```bash
npm run build
npm run preview
```

---

## Personalise

Open `src/config.ts` to change:
- `author` — currently "Mekdelawit Worku".
- `role` — currently "Full-stack developer".
- `githubUrl` — currently this repo's URL; used by the "Source" buttons and footer.
- `liveUrl` — your Render URL (optional, set after deployment).

Other optional polish:
- Update the title/description in `index.html`.
- Replace `public/assets/logo.png` with your own brand mark.
- Link the live demo from your GitHub profile README.

---

## Why this is safe for a portfolio

- All data lives in `src/data.ts` and is explicitly fictional.
- The site makes **zero network calls** to the production API.
- Mutating buttons only show a local "Demo only" message.
- No `.env`, API keys, admin passwords or real phone numbers are included.
- Render only builds and serves static files; no backend or database is involved.

---

## File map

```
├── public/assets/    → bureau logo, illustration and DM fonts
├── src/
│   ├── App.tsx       → site shell, hero, overview, footer
│   ├── citizen.tsx   → citizen app walkthrough
│   ├── officer.tsx   → officer app walkthrough
│   ├── admin.tsx     → admin panel walkthrough
│   ├── platform.tsx  → architecture / API / safety section
│   ├── data.ts       → fictional fixtures
│   ├── config.ts     ← personalise your name and links here
│   ├── icons.tsx     → inline SVG icons
│   ├── ui.tsx        → shared phone/chip/button primitives
│   ├── styles.css    → full design system
│   └── main.tsx
├── index.html
├── package.json
├── package-lock.json
├── render.yaml       ← Render Blueprint (static site)
├── tsconfig.json
└── vite.config.ts
```
