# SOC Dashboard (Full-Stack)

A production-ready **Security Operations Center (SOC) Dashboard** built with the PERN stack (PostgreSQL, Express, React, Node.js). Designed for real-time threat monitoring, intelligence analysis, and analyst workflow management.

> **Current Version:** 3.0.0 — Last updated 2026-02-23 12:15 IST

---

## 🚀 Features

### **Operations**
- **Live Monitor** — Real-time alerts trend, recent activity feed, and system health status.
- **Global Search** (`Ctrl+K`) — Instant search across Alerts, IOCs, and Threat Actors.
- **Draggable Dashboard** — Custom dashboard builder with drag-and-drop widgets and persisted layouts.

### **Intelligence**
- **Campaign Timeline** — Track complex security campaigns with interactive timelines and MITRE ATT&CK mapping.
- **Threat Actor Profiles** — Detailed profiles with known TTPs and associated IOCs.
- **IOC Workbench** — Feed of Indicators of Compromise with filtering and export.

### **Configuration**
- **Settings Page** — Premium multi-section settings UI with sidebar navigation:
  - 👤 **Profile** — Edit personal info, upload avatar, change password
  - 👥 **User Management** — Add/remove team members, assign roles, toggle status
  - 🔌 **Integrations** — Connect SIEM, Slack, VirusTotal, MISP with API key management
  - 🔔 **Alert Rules** — Notification channels, SLA thresholds, retention policies
  - 🎛️ **Dashboard** — Display preferences, refresh interval, date format, timezone

### **Architecture**
- **Frontend** — React 19, Tailwind CSS, Recharts, Framer Motion, MUI Icons
- **Backend** — Node.js, Express, Prisma ORM
- **Database** — PostgreSQL
- **Authentication** — JWT-based secure auth flow

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
├── docker-compose.yml
├── README.md
├── CHANGELOG.md     # Version history with dates & times
└── FEATURES.md      # Detailed feature documentation
```

---

## ⚡ Setup Instructions

### 1. Database Setup (PostgreSQL)

**Option A — Docker (Recommended)**
```powershell
docker-compose up -d
```

**Option B — Local Install**
Ensure PostgreSQL is running and update `server/.env`:
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/soc_dashboard?schema=public"
```

### 2. Backend Setup
```powershell
cd server
npm install

# Initialize database schema
npx prisma migrate dev --name init

# Seed demo data (users, alerts, threat actors, campaigns)
node prisma/seed.js

# Start dev server
npm run dev
```
*Server runs on http://localhost:5000*

### 3. Frontend Setup
```powershell
cd client
npm install
npm start
```
*Client runs on http://localhost:3000*

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@soc.com` | `password123` |
| **Analyst** | `analyst@soc.com` | `password123` |

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

## 📦 Key Dependencies (Client)

| Package | Purpose |
|---------|---------|
| `react` ^19 | UI framework |
| `@mui/icons-material` | Icon set |
| `recharts` | Data visualization |
| `react-router-dom` ^6 | Client-side routing |
| `react-grid-layout` | Draggable dashboard widgets |
| `react-hot-toast` | Toast notifications |
| `framer-motion` | Animations |
