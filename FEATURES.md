# SOC Dashboard Features
**Current Version:** 4.0.0 (Comprehensive Capability Release)
Complete documentation of every feature, page, component, and utility in the SOC Dashboard.

**Last Updated:** 2026-03-07 | 16:34 IST — v3.3.0

---

## Table of Contents

### Pages
1. [Login Page](#-login-page) _(v1.0.0)_
2. [Overview / Live Monitor](#-overview--live-monitor) _(v1.0.0)_
3. [Dashboards Page](#-dashboards-page) _(v1.0.0)_
4. [Draggable Dashboard](#-draggable-dashboard) _(v2.0.0)_
5. [IOC Feed Page](#-ioc-feed-page) _(v1.0.0)_
6. [Search Page](#-search-page) _(v1.0.0)_
7. [Threat Actors Page](#-threat-actors-page) _(v1.0.0)_
8. [Campaign Timeline Page](#-campaign-timeline-page) _(v1.0.0, updated v2.4.0)_
9. [Intel Report Page](#-intel-report-page) _(v2.0.0)_
10. [Settings Page](#-settings-page) _(v3.0.0)_

### Dashboard Cards / Components
11. [StatCard](#-statcard)
12. [SeveritySnapshotRow](#-severitysnapshotrow)
13. [AlertsTrendCard](#-alertstrendcard) _(updated v2.0.0)_
14. [AlertStatusCard](#-alertstatuscard)
15. [RecentActivityFeed](#-recentactivityfeed)
16. [TopAssetsCard](#-topassetscard) _(fixed v1.1.0)_
17. [IocDistributionCard](#-iocdistributioncard) _(fixed v1.1.0)_
18. [TopThreatActorsCard](#-topthreatactorscard)
19. [RiskScoreCard](#-riskscorecard)
20. [RiskPulseBar](#-riskpulsebar)
21. [SeverityDistributionCard](#-severitydistributioncard)
22. [SlaPerformanceCard](#-slaperformancecard)
23. [ThreatIntelFeedCard](#-threatintelfeedcard)
24. [WafRulesCard](#-wafrulescard)
25. [OpenCtiMatchesCard](#-openctiMatchescard)

### Campaign Sub-Components
26. [CampaignTimeline](#-campaigntimeline) _(updated v2.4.0)_
27. [CampaignTrendChart](#-campaigntrendchart)
28. [CampaignKpiCard](#-campaignkpicard)
29. [MitreTechniquesChart](#-mitretechniqueschart)
30. [SeverityDonutChart](#-severitydonutchart)

### Global Features
31. [Global Search](#-global-search) _(v2.0.0)_
32. [Toast Notifications](#-toast-notifications) _(v2.0.0)_
33. [Advanced Filter Panel](#-advanced-filter-panel) _(v2.0.0)_
34. [Collapsible Sidebar](#-collapsible-sidebar) _(v2.1.0)_

### Layout & App Shell
35. [SOCLayout](#-soclayout)
36. [App.js & Routing](#-appjs--routing)
37. [ErrorBoundary](#-errorboundary)
38. [LoadingSpinner](#-loadingspinner)

### Utilities
39. [toast.js](#-toastjs) _(v2.0.0)_
40. [storage.js](#-storagejs)
41. [format.js](#-formatjs)
42. [performanceUtils.js](#-performanceutilsjs) _(v2.2.0)_
43. [testUtils.js](#-testutilsjs) _(v2.0.0)_

---

## 📄 Pages

---

### 🔐 Login Page

> **Added:** v1.0.0 | **Enhanced:** v2.0.0 (toast feedback)

**Location:** `src/pages/LoginPage.js`

**Features:**
- Email + password authentication form
- JWT token stored on successful login
- Form validation with error messaging
- Toast notifications: success on login, error on invalid credentials, info on password reset
- Animated background / glassmorphism card styling
- Links to forgot password flow

---

### 📊 Overview / Live Monitor

> **Added:** v1.0.0 | **Enhanced:** v2.0.0 (filter integration) | **Hardened:** v3.1.0 (error UI, memoized confidence)

**Location:** `src/pages/OverviewPage.js`

**Features:**
- KPI summary cards row (Total Alerts, Critical, High Priority, Risk Score)
- `SeveritySnapshotRow` — visual breakdown by severity level
- `AlertsTrendCard` — time-series chart of alert counts (clickable data points since v2.0.0)
- `AlertStatusCard` — open / in-progress / resolved breakdown
- `RecentActivityFeed` — live feed of latest alert activity
- `TopAssetsCard` — most-targeted assets
- `TopThreatActorsCard` — most active threat actors
- `IocDistributionCard` — IOC type distribution donut chart
- **Advanced Filter Panel** integrated: filter alerts by Severity and Status
- Active filter count badge in toolbar
- **Error banner** (v3.1.0) — inline red alert + Retry button shown on API failure without replacing the page

---

### 🗂️ Dashboards Page

> **Added:** v1.0.0

**Location:** `src/pages/DashboardsPage.js`

**Features:**
- Aggregated view of all core dashboard cards
- `RiskScoreCard`, `SlaPerformanceCard`, `ThreatIntelFeedCard`, `WafRulesCard`, `OpenCtiMatchesCard`
- Static grid layout (non-draggable — see Draggable Dashboard for custom layout)

---

### 🎯 Draggable Dashboard

> **Added:** v2.0.0 — 2026-02-13 | 12:34 IST

**Location:** `src/pages/DraggableDashboard.js` + `DraggableDashboard.css`

**Features:**
- Drag-and-drop widget repositioning
- Resize widgets from the bottom-right handle
- **Edit Mode** toggle (lock 🔒 / unlock 🔓 icon)
- **Save Layout** → persists to `localStorage` key `dashboard-layouts`
- **Reset Layout** → clears saved layout, restores defaults
- Responsive breakpoints: `lg / md / sm / xs / xxs`

**Widgets Included:** Total Alerts, Critical Alerts, High Priority, Risk Score, Alerts Trend, Alert Status, Top Assets, Top Threats, IOC Distribution

**Grid Config:**
```javascript
breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
cols:        { lg: 12,   md: 10,  sm: 6,   xs: 4,   xxs: 2  }
rowHeight: 30
```

**Route:** `/custom-dashboard`

---

### 🧬 IOC Feed Page

> **Added:** v1.0.0

**Location:** `src/pages/IOCFeedPage.js`

**Features:**
- Table of Indicators of Compromise (IP, Domain, Hash, URL types)
- Filtering by IOC type and severity
- Search within the IOC table
- Export-ready layout
- Color-coded severity chips (`SeverityChip`)

---

### 🔎 Search Page

> **Added:** v1.0.0

**Location:** `src/pages/SearchPage.js`

**Features:**
- Full-page search interface across alerts, IOCs, and threat actors
- Results grouped by category
- Case-insensitive matching
- Empty state with prompt message

---

### 👤 Threat Actors Page

> **Added:** v1.0.0 | **Enhanced:** v3.1.0 (View Profile modal, error UI, null-safe)

**Location:** `src/pages/ThreatActorsPage.js`

**Features:**
- List of known threat actor profiles with live search filter
- Known TTPs (Tactics, Techniques, Procedures)
- Associated IOCs per actor
- Severity / activity level indicators
- **View Profile modal** (v3.1.0) — detail modal with description, origin, type, last seen, actor ID, and motive
- **Error state** (v3.1.0) — full-page error UI with Retry on API failure
- **Null-safe rendering** (v3.1.0) — handles missing `actor.id` without crashing

---

### 📅 Campaign Timeline Page

> **Added:** v1.0.0 | **Design Updated:** v2.4.0 — 2026-02-18 | 12:07 IST

**Location:** `src/pages/CampaignTimelinePage.js`

**Features:**
- Interactive timeline of active security campaigns
- MITRE ATT&CK technique mapping
- KPI cards per campaign (alerts, severity, duration)
- Trend chart per campaign
- Severity donut chart per campaign
- Tooltips and cards redesigned in v2.4.0 to match premium glassmorphism theme

**Sub-components:** `CampaignTimeline`, `CampaignTrendChart`, `CampaignKpiCard`, `MitreTechniquesChart`, `SeverityDonutChart`

---

### 📰 Intel Report Page

> **Added:** v2.0.0 — 2026-02-13 | 12:34 IST

**Location:** `src/pages/IntelReportPage.js`

**Features:**
- Threat intelligence reports with detailed written analysis
- Structured report sections: summary, indicators, recommendations
- Source attribution and confidence ratings
- Premium dark-themed document layout

**Route:** `/intel-reports`

---

### ⚙️ Settings Page

> **Added:** v3.0.0 — 2026-02-23 | 12:15 IST

**Location:** `src/pages/SettingsPage.js` _(616 lines, complete rewrite)_

**Features:**
- Sticky **sidebar navigation** with 5 color-coded sections
- Fully self-contained Tailwind CSS (no MUI `Box` / `sx`)
- Accessible toggles (`role="switch"`, `aria-checked`)
- Responsive: 1-col mobile → 2–3-col desktop grids

**Tabs:**

| Tab | Color | Features |
|-----|-------|----------|
| Profile | Indigo | Gradient avatar, editable name/email/phone, password change with validation |
| User Management | Cyan | Team list, Add User modal, Delete confirm modal, Active↔Inactive toggle |
| Integrations | Violet | SIEM/Slack/VirusTotal/MISP cards, Connect/Disconnect, Configure modal (API key, endpoint, sync freq) |
| Alert Rules | Amber | Notification channel toggles, behaviour toggles, SLA threshold inputs |
| Dashboard | Emerald | Display preference toggles, default page, refresh interval, date format, timezone |

**Reusable Primitives:**
`InputField`, `SelectField`, `Toggle`, `SectionCard`, `Modal`, `SaveBanner`, `PrimaryBtn`, `GhostBtn`

**Route:** `/settings`

---

## 🧩 Dashboard Cards / Components

---

### 📈 StatCard

**Location:** `src/components/StatCard.js`  
KPI summary card showing a metric value, label, trend indicator and icon. Used in Overview and Draggable Dashboard.

---

### 🎨 SeveritySnapshotRow

**Location:** `src/components/SeveritySnapshotRow.js`  
Horizontal row of severity-level bars (Critical / High / Medium / Low) with counts and percentage fills.

---

### 📉 AlertsTrendCard

> **Enhanced:** v2.0.0 — clickable data points, custom tooltips

**Location:** `src/components/AlertsTrendCard.js`  
Time-series line chart of alert volumes. Since v2.0.0: click any data point to trigger a time-range filter callback + toast feedback. Custom glassmorphism tooltip.

```javascript
<AlertsTrendCard alerts={alerts} onTimeRangeClick={(data) => { /* handle */ }} />
```

---

### 🟢 AlertStatusCard

**Location:** `src/components/AlertStatusCard.js`  
Donut / bar breakdown of alert statuses: Open, In Progress, Resolved, False Positive.

---

### 🕐 RecentActivityFeed

**Location:** `src/components/RecentActivityFeed.js`  
Scrollable feed of the most recent alert events with timestamp, entity, and severity chip. Auto-updates with new mock data.

---

### 🖥️ TopAssetsCard

> **Fixed:** v1.1.0 — text visibility & padding | **Fixed:** v3.1.0 — bar chart number blinking

**Location:** `src/components/TopAssetsCard.js`  
Horizontal bar chart of most-targeted assets with alert counts and severity-coloured gradient bars.

**v3.1.0 blink fix:** SVG `<linearGradient>` definitions recreated inside each `CustomBar` caused browser `id` collisions and visible flickering. Extracted into a single `GradientDefs` component rendered once at `BarChart` level. `isAnimationActive={false}` added to remove redundant entrance re-renders.

---

### 🍩 IocDistributionCard

> **Fixed:** v1.1.0 — donut chart centering fixed

**Location:** `src/components/IocDistributionCard.js`  
Donut chart showing distribution of IOC types (IP, Domain, Hash, URL). Legend with counts below.

---

### 🕵️ TopThreatActorsCard

**Location:** `src/components/TopThreatActorsCard.js`  
Ranked list of most active threat actors with activity score bars.

---

### 🛡️ RiskScoreCard

**Location:** `src/components/RiskScoreCard.js`  
Gauge-style card showing an overall risk score (0–100) with colour coding (green → red).

---

### 📡 RiskPulseBar

**Location:** `src/components/RiskPulseBar.js`  
Animated horizontal pulse bar visualising live risk level. Used as a sub-indicator in risk-related cards.

---

### 📊 SeverityDistributionCard

**Location:** `src/components/SeverityDistributionCard.js`  
Bar chart showing alert counts grouped by severity for the current period.

---

### ⏱️ SlaPerformanceCard

**Location:** `src/components/SlaPerformanceCard.js`  
Table / progress-bar card showing SLA adherence rates per severity tier (Critical / High / Medium / Low).

---

### 🌐 ThreatIntelFeedCard

**Location:** `src/components/ThreatIntelFeedCard.js`  
Mini-feed of external threat intelligence items (CVEs, threat reports) sourced from mock data.

---

### 🔒 WafRulesCard

**Location:** `src/components/WafRulesCard.js`  
Summary of active Web Application Firewall rules with triggered counts.

---

### 🔗 OpenCtiMatchesCard

**Location:** `src/components/OpenCtiMatchesCard.js`  
Shows IOC matches found against the OpenCTI threat intelligence platform (mock data).

---

## 🗂️ Campaign Sub-Components

---

### 📅 CampaignTimeline

> **Design Updated:** v2.4.0 — 2026-02-18 | 12:07 IST (glassmorphism tooltips, gradient accent)

**Location:** `src/components/campaign/CampaignTimeline.js`  
Interactive horizontal timeline for a campaign. Events displayed as clickable nodes. Tooltips redesigned to match premium theme in v2.4.0.

---

### 📈 CampaignTrendChart

**Location:** `src/components/campaign/CampaignTrendChart.js`  
Line chart showing alert activity over the duration of a campaign.

---

### 🃏 CampaignKpiCard

**Location:** `src/components/campaign/CampaignKpiCard.js`  
Small KPI chip card for campaign-level metrics (total alerts, duration, severity peak).

---

### 🛡️ MitreTechniquesChart

**Location:** `src/components/campaign/MitreTechniquesChart.js`  
Horizontal bar chart mapping observed MITRE ATT&CK technique IDs to occurrence counts.

---

### 🍩 SeverityDonutChart

**Location:** `src/components/campaign/SeverityDonutChart.js`  
Compact donut chart showing severity breakdown for a single campaign.

---

## 🌐 Global Features

---

### 🔍 Global Search

> **Added:** v2.0.0 | **Optimised:** v3.1.0 (data caching, request cancellation)

**Location:** `src/components/GlobalSearch.js`

**Features:**
- Open with `Ctrl+K` (Windows) / `Cmd+K` (Mac) from anywhere in the app
- Click the search bar in the navbar
- Real-time results across Alerts, IOCs, Threat Actors (≤ 5 results per category)
- Categorized results with icons; press `Esc` to close
- Glassmorphism dialog: `rgba(21, 30, 50, 0.95)` with blur
- **Data cache** (v3.1.0) — raw data fetched **once per dialog session** (was 3 API calls per keystroke); cache cleared on dialog close for fresh data
- **AbortController** (v3.1.0) — cancels previous in-flight requests on each new keystroke

---

### 🔔 Toast Notifications

> **Added:** v2.0.0 — 2026-02-13 | 12:34 IST

**Location:** `src/utils/toast.js` + `react-hot-toast`

**Variants:** `success`, `error`, `warning`, `info`, `quick`, `promise`

```javascript
import showToast from '../utils/toast';
showToast.success('Saved!', 'Your changes were saved.');
showToast.promise(fetchData(), { loading: 'Loading…', success: 'Done!', error: 'Failed' });
```

**Styling:** Top-right, `rgba(21, 30, 50, 0.95)` background, 2–4 s auto-dismiss.

---

### 🎛️ Advanced Filter Panel

> **Added:** v2.0.0 — 2026-02-13 | 12:34 IST

**Location:** `src/components/FilterPanel.js`

**Features:**
- Right-side drawer with glassmorphism
- Severity filters: Critical `#EF4444`, High `#F59E0B`, Medium `#EAB308`, Low `#10B981`
- Status filters: Open, In Progress, Resolved, False Positive
- Active filter count badge on toolbar button
- Reset + Apply actions

```javascript
import FilterPanel, { FilterButton } from '../components/FilterPanel';
```

---

### 📌 Collapsible Sidebar

> **Added:** v2.1.0 — 2026-02-16 | 07:41 IST

**Location:** `src/layout/SOCLayout.js`

**Features:**
- Toggle button to expand / collapse the sidebar
- Smooth CSS width transition
- Main content area adapts layout width automatically
- Collapsed state: icons only; Expanded state: icons + labels

---

## 🏗️ Layout & App Shell

---

### 🖥️ SOCLayout

**Location:** `src/layout/SOCLayout.js`

The main application shell. Provides:
- Top navbar with branding, Global Search bar, user avatar
- Collapsible left sidebar with route links (since v2.1.0)
- Page content area (`<Outlet />` for nested routes)
- Navigation items: Live Monitor, Dashboards, IOC Feed, Search, Threat Actors, Campaign Timeline, Intel Reports, Custom Dashboard, Settings

---

### ⚛️ App.js & Routing

**Location:** `src/App.js`

- React Router v6 route definitions
- Protected routes (redirect to `/login` if unauthenticated)
- `<Toaster />` mounted at root for global toast notifications (since v2.0.0)
- `LoadingScreen` shown during JWT auth check (prevents blank screen on load, since v2.0.0)
- `AuthContext` provider wraps entire app

---

### 🚨 ErrorBoundary

**Location:** `src/components/ErrorBoundary.js`

Class component that catches render errors, prevents full app crash, and displays a styled fallback UI with error details.

---

### ⏳ LoadingSpinner

**Location:** `src/components/LoadingSpinner.js`

Reusable centred animated spinner used during async operations and the initial auth check.

---

## 🔧 Utilities

---

### 🍞 toast.js

> **Added:** v2.0.0 — 2026-02-13 | 12:34 IST

**Location:** `src/utils/toast.js`

Wrapper around `react-hot-toast` exposing `showToast.success / error / warning / info / quick / promise` with consistent SOC dark-theme styling.

---

### 💾 storage.js

**Location:** `src/utils/storage.js`

Helper functions for `localStorage` read/write/clear used by:
- `dashboard-layouts` (Draggable Dashboard layout persistence)
- Auth token / user storage
- **v3.1.0** — `JSON.parse` wrapped in `try/catch`; malformed data returns `null` instead of crashing `AuthProvider`

---

### 🕐 format.js

**Location:** `src/utils/format.js`

Utility functions for formatting dates, times, and numbers consistently across the dashboard.

---

### ⚡ performanceUtils.js

> **Added:** v2.2.0 | **Updated:** v3.1.0 (capped memoize, dead imports removed, modern perf API)

**Location:** `src/utils/performanceUtils.js`

Performance helpers:
- **Debounce / throttle** utilities
- **`memoize(fn, maxSize = 100)`** — LRU eviction when limit is reached (was unbounded)
- **`logPerformanceMetrics()`** — uses `performance.getEntriesByType('navigation')` (deprecated `performance.timing` removed)
- **`LoadingComponent`** — exported MUI spinner fallback for `React.lazy`
- Dead `react-loadable` imports and `Loadable()` exports removed (v3.1.0)

---

### 🧪 testUtils.js

> **Added:** v2.0.0 — 2026-02-13 | 12:34 IST

**Location:** `src/utils/testUtils.js`

Custom render wrappers and mock providers for unit and integration tests. Wraps components with `AuthContext`, `Router`, and `ThemeProvider` for consistent test environments.

---

## 🖥️ Backend API

> **Stack:** Node.js · Express 4 · Prisma ORM · PostgreSQL · JWT · Zod · bcryptjs

**Entry point:** `server/index.js`

### Auth Endpoints — `/api/auth`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/register` | Public | Create analyst account (role fixed to `analyst`) |
| `POST` | `/login` | Public | Returns JWT token |
| `GET` | `/profile` | Private | Returns authenticated user profile |

### Alert Endpoints — `/api/alerts`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `GET` | `/` | Private | Fetch all alerts (ordered by timestamp desc) |
| `POST` | `/` | Admin | Create new alert |
| `GET` | `/stats` | Private | Aggregate stats (total, critical, open cases, active IOCs) |
| `PATCH` | `/:id` | Private | Update alert status — returns 404 if ID not found |

### Intel Endpoints — `/api/intel`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `GET` | `/threat-actors` | Private | All threat actors (ordered by lastSeen desc) |
| `GET` | `/iocs` | Private | All IOCs (ordered by seenAt desc) |

### Middleware

| File | Purpose |
|------|---------|
| `middleware/authMiddleware.js` | `protect` — verifies JWT, attaches `req.user`; `admin` — role gate |
| `middleware/errorMiddleware.js` | `notFound` 404 handler; `errorHandler` global error formatter |

### Utils

| File | Purpose |
|------|---------|
| `utils/generateToken.js` | Signs JWT with `id` + `role`, 24 h expiry |
| `utils/prisma.js` | Singleton `PrismaClient` (reused across hot-reloads in dev) |

### Security & Reliability (v3.2.0)
- **Role hardening** — `role` removed from public registration body; privilege escalation prevented
- **Prisma P2025 → 404** — `updateAlertStatus` catches `P2025` and returns 404 instead of 500
- **CORS restricted** — `CLIENT_ORIGIN` env var controls allowed frontend origin
- **JWT_SECRET guard** — Server exits on boot if `JWT_SECRET` is missing
- **Graceful shutdown** — `SIGTERM`/`SIGINT` disconnect Prisma before exit
- **Global error handlers** — `unhandledRejection` + `uncaughtException` prevent silent crashes

### Environment Variables (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default `5000`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | Token signing secret — server exits if missing |
| `CLIENT_ORIGIN` | No | Allowed CORS origin (default `http://localhost:3000`) |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#6366F1` (Indigo) |
| Base background | `#0B1120` |
| Surface | `#1E293B` |
| Success | `#10B981` |
| Error | `#EF4444` |
| Warning | `#F59E0B` |
| Glassmorphism | `backdrop-filter: blur(20px)` |
| Card border | `border-white/6` |
| Transition | `0.2s – 0.3s ease` |

---

## 📱 Responsive Design

All pages and components adapt to screen size:
- Sidebar collapses on mobile / narrow viewports
- Dashboard cards reflow to single column on small screens
- Draggable Dashboard has breakpoints: `lg / md / sm / xs / xxs`
- Settings sidebar navigation scrolls horizontally on mobile

---

## ♿ Accessibility

- WCAG 2.1 AA compliant (since v2.0.0)
- `role="switch"` + `aria-checked` on all toggles
- `aria-label` on icon-only buttons
- Full keyboard navigation across all pages
- Focus-visible rings on all interactive elements
- Semantic HTML (`<main>`, `<nav>`, `<section>`, `<h1>`–`<h3>`)
- Colour-contrast–safe text throughout

---

## 🧪 Testing

| Test File | Covers |
|-----------|--------|
| `src/App.test.js` | App renders without crash |
| `src/components/StatCard.test.js` | StatCard unit tests |
| `src/pages/DraggableDashboard.test.js` | Draggable dashboard interaction tests |

Run tests:
```powershell
cd client
npm test
```

---

**Version 3.3** — Removed Docker Support _(2026-03-07)_
**Version 3.2** — Backend Security & Hardening _(2026-02-24)_
**Version 3.1** — Comprehensive Bug-Fix & Hardening Pass _(2026-02-24)_
**Version 3.0** — Premium Settings Page _(2026-02-23)_
**Version 2.0** — Advanced Interactive Features & Accessibility _(2026-02-13)_
**Version 1.0** — Initial Release _(2026-02-12)_
