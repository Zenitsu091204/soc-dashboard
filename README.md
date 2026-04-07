# SOC Dashboard (Full-Stack)

A production-ready **Security Operations Center (SOC) Dashboard** built with the PERN stack (PostgreSQL, Express, React, Node.js). Designed for real-time threat monitoring, intelligence analysis, and analyst workflow management.

> **Current Version:** 4.4.0 — Last updated 2026-04-06 15:44 IST

---

## 🚀 Features

### **Production & Deployment (v4.4.1)**
- **Unified Static Serving** — The Express backend automatically hosts the compiled React bundle internally, eliminating cross-origin complications and serving the entire platform seamlessly on a single port for live production.
- **1-Click Guided Setup** — Execute `setup.js` to automatically resolve dependencies, generate crypto-secure `.env` tokens, migrate PostgreSQL schemas, and concurrently launch the app.
- **Zero-Data Foundation** — Configured for immediate production use with exactly zero pre-loaded mock vulnerabilities/geo-threats. Only actual synced intel will appear.

### **Operations**
- **Live Monitor** — Real-time alerts trend, recent activity feed, and zero-data states.
- **Global Search** (`Ctrl+K`) — Instant search across Alerts, IOCs, and Threat Actors. Data cached per session for zero extra API calls per keystroke.
- **Draggable Dashboard** — Custom dashboard builder with drag-and-drop widgets and persisted layouts.

### **Intelligence**
- **Campaign Timeline** — Track complex security campaigns with interactive timelines and MITRE ATT&CK mapping.
- **Threat Actor Profiles** — Detailed profiles with View Profile modal, known TTPs, and associated IOCs.
- **IOC Workbench** — Feed of Indicators of Compromise with filtering and export.

### **Reliability & Performance** _(v3.1.0 + v3.2.0)_
- **User-facing error states** — All data pages show styled error banners with Retry buttons on API failure.
- **Session-safe 401 handling** — Token expiry dispatches a `CustomEvent`; `AuthContext` shows a toast and React Router redirects without a full page reload.
- **Bounded memoize cache** — LRU eviction at 100 entries prevents memory leaks in long sessions.
- **TopAssetsCard blink fix** — SVG gradient IDs defined once per chart, eliminating flickering numbers.
- **Backend role hardening** — Public `/register` no longer accepts `role` from body; privilege escalation prevented.
- **Backend P2025 → 404** — `PATCH /alerts/:id` returns 404 (not 500) when alert not found.
- **CORS restricted** — Server only accepts requests from `CLIENT_ORIGIN` (default `localhost:3000`).
- **Graceful shutdown** — SIGTERM/SIGINT properly disconnect Prisma before process exit.

### **Configuration**
- **Settings Page** — Premium multi-section settings UI with sidebar navigation:
  - 👤 **Profile** — Edit personal info, upload avatar, change password
  - 👥 **User Management** — Add/remove team members, assign roles, toggle status
  - 🔌 **Integrations** — Connect SIEM, Slack, VirusTotal, MISP with API key management
  - 🔔 **Alert Rules** — Notification channels, SLA thresholds, retention policies
  - 🎛️ **Dashboard** — Display preferences, refresh interval, date format, timezone

### **Architecture & Technologies**

#### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^19 | UI framework |
| React Router DOM | ^6 | Client-side routing |
| Tailwind CSS | v3 | Utility-first styling |
| Material-UI + Icons | ^7 | Component library & icon set |
| Recharts | latest | Data visualisation charts |
| Framer Motion | latest | Animations & transitions |
| react-hot-toast | ^2 | Toast notifications |
| react-grid-layout | ^2 | Draggable / resizable widget grid |
| Axios | latest | HTTP client with interceptors |
| Zod (client-side) | — | via API contracts |

#### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | v16+ | Server runtime |
| Express | ^4 | HTTP framework |
| Prisma ORM | ^5 | Database access & migrations |
| PostgreSQL | v13+ | Primary database |
| jsonwebtoken | ^9 | JWT generation & verification |
| bcryptjs | ^2 | Password hashing |
| Zod | ^3 | Request body validation |
| Helmet | ^7 | HTTP security headers |
| Morgan | ^1 | HTTP request logging |
| CORS | ^2 | Cross-origin control (origin-locked) |
| dotenv | ^16 | Environment variable loading |

---

## 🛠️ Prerequisites

| Dependency | Version |
|------------|---------|
| Node.js | v16+ |
| PostgreSQL | v13+ |
| Git | any recent |

---

## 📂 Project Structure

```
soc-dashboard/
├── client/          # React Frontend (Tailwind CSS, Recharts, MUI Icons)
├── server/          # Node.js / Express Backend API + Prisma ORM
├── README.md
├── CHANGELOG.md     # Version history with dates & times
└── FEATURES.md      # Detailed feature documentation
```

---

## ⚡ Setup Instructions

### 1. Database Prerequisite (PostgreSQL)
Ensure PostgreSQL is running locally. You do not need to construct the databases manually; Prisma will orchestrate the schema drops and seeding during setup.

### 2. Automated 1-Click Launch (Recommended)

#### 🐧 Ubuntu / Linux (use the bootstrap script — handles everything)
```bash
chmod +x setup-ubuntu.sh
./setup-ubuntu.sh
```
This script automatically installs Node.js 20, configures PostgreSQL authentication, fixes line endings, installs all dependencies, and launches the app.

#### 🪟 Windows
Double-click `setup.bat`, or in PowerShell:
```powershell
./setup.bat
```

*Frontend runs on http://localhost:3000 — Backend runs on http://localhost:5000*

> See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for manual steps, troubleshooting, and production deployment.

### 3. Production Deployment (Unified Server)
For live deployments, you do not need two servers. The backend is configured to statically serve the optimized frontend bundle on a single port.
```bash
# 1. Build the frontend
cd client
npm run build

# 2. Start the unified production server
cd ../server
node index.js
```
*The full application (frontend + API) now runs entirely on http://localhost:5000*

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@soc.com` | `password123` |

---

## 🎨 Theme & UI

The dashboard uses a **Glassmorphism** design system:
- Tailwind CSS utility-first styling
- `backdrop-filter: blur(20px)` glass cards with `border-white/6`
- Dynamic color accent system (indigo / cyan / violet / amber / emerald)
- Smooth micro-animations and hover effects
- Dark theme throughout (`#0B1120` base, `#1E293B` surface)
- Recharts with custom dark-themed tooltips

---

## 📖 Documentation

| File | Contents |
|------|----------|
| [CHANGELOG.md](./CHANGELOG.md) | Full version history with dates & times |
| [FEATURES.md](./FEATURES.md) | Detailed technical feature documentation |

---

## 📦 Key Dependencies

### Frontend (`client/`)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19 | UI framework |
| `react-router-dom` | ^6 | Client-side routing |
| `@mui/material` + icons | ^7 | Component library & icons |
| `recharts` | latest | Data visualisation |
| `react-grid-layout` | ^2 | Draggable dashboard widgets |
| `react-hot-toast` | ^2 | Toast notifications |
| `framer-motion` | latest | Animations |
| `axios` | latest | HTTP client |

### Backend (`server/`)

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4 | HTTP framework |
| `@prisma/client` | ^5 | Database ORM |
| `jsonwebtoken` | ^9 | JWT auth |
| `bcryptjs` | ^2 | Password hashing |
| `zod` | ^3 | Request validation |
| `helmet` | ^7 | Security headers |
| `cors` | ^2 | Origin-locked CORS |
| `morgan` | ^1 | Request logging |
