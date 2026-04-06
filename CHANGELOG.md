# Changelog

All notable changes to the SOC Dashboard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [4.4.0] - 2026-04-06 | 15:44 IST

### Added — 1-Click Production Automated Setup
- **Global Setup Script** — Fully overhauled `setup.js` and added a companion `setup.bat` executable to completely automate the build lifecycle (NPM install, Environment Generation, DB Resets, Seeding, and Webpack Build-Run).
- **Zero-Data State Architecture** — Transformed the dashboard to run gracefully with exactly zero mock data. The system now respects empty environments entirely, defaulting all charts to accurate null states until live integrations (like OpenCTI or live scanner endpoints) are attached.
- **Crypto-Secure Bootstrapping** — Automated setup script now generates dynamic 512-bit JWT secrets silently during native `.env` generation.

### Removed — Codebase Clean Up
- **Unused Metrics Subsystem (SystemHealth)** — Eliminated the mock hardware monitoring `/api/system/health` logic and frontend `SystemHealthWidget.js` as it is out-of-scope for the SIEM threat dashboard.
- **Mock Geo Mapping** — Erased the hard-coded `GeographicThreatMap.js` frontend asset.
- **Global Vulnerability Splitting** — Removed the `TopCvesWidget` connection to the public NVD REST API to preserve the "Zero-Data" integrity (external NVD tickets shouldn't populate internal dashboard tracking metrics).
- **Outdated Project Docs** — Purged unneeded internal build descriptors (`MODULES.txt`, `PROJECT_STRUCTURE.txt`, etc.).

---

## [4.3.0] - 2026-04-02 | 16:30 IST

### Added — Architecture Optimization & SOAR Hardening
- **Automated Configuration Rollback** — Enhanced `naxsiService.js` with automatic backup and restoration of firewall configs on deployment failure.
- **Unified Intelligence Hub** — Consolidated "IOC Feed" and "Threat Actors" into a single, high-performance tabbed interface (`IntelligencePage.js`).
- **Real-time Sync Visibility** — Added `SyncStatusWidget` showing live OpenCTI synchronization health and volume metrics.
- **Deep Incident Hydration** — Incident detail views now automatically link and display associated IOCs and Protection Rules for full-context investigations.
- **Global Sidebar Refactor** — Drastically simplified navigation from 11 items to 5 core operational pillars (Dashboard, Incidents, Rule Management, Intelligence, Settings).

### Changed — Front End Consolidation
- **Dashboard Merge** — Merged `DashboardsPage` into the primary `OverviewPage` (Live Monitor).
- **Integrated Widgets** — `GeographicThreatMap`, `SystemHealthWidget`, and `TopCvesWidget` are now core components of the main dashboard.

### Fixed
- **NaxsiService Reliability** — Fixed missing `prisma` import and added directory recursive creation for rule backups.
- **Audit Consistency** — Manual sync trigger in `intelController.js` now correctly attributes the performing analyst.

---

## [4.2.0] - 2026-04-02 | 21:00 IST

### Added — SOAR, RBAC & Incident Management (Hardening Release)

- **SOAR Framework (NAXSI)** — Implemented automated firewall rule generation and deployment for NAXSI.
  - **Auto-Deployment**: Tiered logic (Confidence > 90: Auto-active; > 70: Pending approval).
  - **Verification**: Post-deployment status checks to confirm firewall reload success.
  - **Files:** `server/services/naxsiService.js`, `server/services/ruleService.js`, `client/src/pages/RuleManagementPage.js`
- **Role-Based Access Control (RBAC)** — Introduced three distinct roles (`admin`, `analyst`, `read-only`) with granular route protection.
  - **Files:** `server/middleware/rbacMiddleware.js`
- **Incident Management Lifecycle** — Centralized incident hub to convert correlated alerts into manageable cases with status tracking, analyst assignment, and investigation notes.
  - **Threat Timeline**: Visual audit trail mapping the entire lifecycle of an incident.
  - **Files:** `server/controllers/incidentController.js`, `client/src/pages/IncidentManagementPage.js`
- **Comprehensive Audit Logging** — Global logging system tracking all critical security and administrative actions (rule deployments, status changes, credentials access).
  - **Files:** `server/services/auditService.js`
- **OpenCTI Multi-Object Sync** — Fully integrated synchronization of Indicators, Campaigns, and Threat Actors directly from OpenCTI Knowledge Base.
  - **Files:** `server/services/syncService.js`, `server/services/openctiService.js`

### Changed — Architecture Modernization

- **Unified Intelligence Scoring** — Standardized on "Confidence" (0-100) across all UI and backend components, retiring the legacy mock reputation system.
- **Database Hardening** — Purged deprecated `reputation` and `enrichmentData` fields from the Prisma schema to streamline the data model.

### Removed

- **Legacy EnrichmentService** — Removed the mock enrichment pipeline in favor of authoritative OpenCTI synchronization.
- **Mock OpenCTI Matches** — Deleted static mock matches from the frontend overview; now pulls live detected matches from the local synchronized database.

---

## [4.1.0] - 2026-04-02 | 16:00 IST

### Added — Intelligent Operations & Enrichment

- **Alert Correlation Engine** — Implemented `CorrelationService` that automatically groups related alerts into cases within a 30-minute sliding window. Grouping occurs by shared entity, source IP, or destination IP.
  - **File:** `server/services/correlationService.js`, `server/controllers/alertController.js`
- **Automated IOC Enrichment** — New IOCs are now automatically enriched with reputation data from external threat intelligence providers (mocked for VT, AlienVault, and AbuseIPDB).
  - **File:** `server/services/enrichmentService.js`, `server/controllers/intelController.js`
- **Prisma Schema Upgrade** — Augmented `Alert` and `Ioc` models to support case relationships and enrichment metadata storage.
  - **File:** `server/prisma/schema.prisma`

---

## [4.0.1] - 2026-03-27 | 16:17 IST

### Fixed — Responsive Design
- **Sidebar Mobile Overflow Defect** — The sidebar navigation drawer did not collapse automatically on mobile viewports (e.g., <900px widths), causing significant horizontal testing overflow. Fixed by implementing Material-UI's `useMediaQuery` to dynamically bind the `open` state to the `md` breakpoint, ensuring an automatic collapse to an icon-only drawer on smaller screens.
  - **File:** `client/src/layout/SOCLayout.js`

---

## [4.0.0] - 2026-03-07 | 18:00 IST

### Major Updates — The Comprehensive Capability Release

#### 🔒 Phase 1: Authentication Hardening & Pagination
- Added `express-rate-limit` middleware to `/api/auth/login` and `/api/auth/register` to prevent brute force attacks.
- Upgraded `/api/alerts` and `/api/intel/iocs` with robust backwards-compatible pagination support via `page` and `limit` parameters.

#### 📄 Phase 2: Export & Reporting Engine
- Integrated client-side PDF export logic for `IntelReportPage` and `CampaignTimelinePage` via `jspdf` and `html2canvas`.
- Added dynamic CSV dump generation to `IOCFeedPage`.

#### 🎯 Phase 3: Advanced Filtering Capabilities
- Augmented `FilterPanel` with precise Date Range boundaries and textual Threat Actor tagging.
- Wired local frontend evaluation coupled with deep backend Prisma query support.

#### 🧩 Phase 4: Dynamic Widget Library
- Upgraded the static `DashboardsPage` to a modular Drag-and-Drop canvas utilizing `react-grid-layout`.
- Added a floating action button enabling runtime instantiation of available widgets.
- Deployed brand-new visual components: `SystemHealthWidget`, `GeographicThreatMap`, and `TopCvesWidget`.

#### ⚡ Phase 5: Real-time WebSockets Engine
- Transformed backend HTTP Server to broadcast live mutation payloads via `socket.io`.
- Wired frontend `OverviewPage` using a custom `useWebSockets` hook to automatically ingest data silently.
- Integrated toast notifications on the active feed for incoming live threats.

---

## [3.3.0] - 2026-03-07 | 16:34 IST

### Changed — Architecture & Infrastructure
- **Removed Docker Support** — Completely removed `docker-compose.yml` and all associated Docker deployment instructions. The project now officially requires a native, local PostgreSQL installation for development and production to simplify the deployment pipeline.

---

## [3.2.0] - 2026-02-24 | 17:44 IST

### Fixed — Backend Security & Hardening Pass

#### 🔴 Security Fix
- **Privilege escalation via `/api/auth/register`** — The `role` field was accepted from the request body, allowing any user to self-register as `admin`. The field is now removed from the Zod schema entirely. All self-registered users are hardcoded to `analyst`. Admin accounts must be created via database seeding
  - **File:** `controllers/authController.js`

#### 🔴 Critical Fix
- **`PATCH /api/alerts/:id` returned 500 on unknown ID** — Prisma throws error code `P2025` when a record to update is not found. This was falling through to a generic 500 handler. Now explicitly caught and returns **404** `"Alert not found"`
  - **File:** `controllers/alertController.js`

#### 🟠 Bug Fixes
- **`authMiddleware.js` no-token path missing `return`** — The `if (!token)` branch sent a 401 response but had no `return`, causing implicit fall-through to undefined behaviour. Added `return` to the response call
  - **File:** `middleware/authMiddleware.js`
- **`cors()` allowed all origins** — `app.use(cors())` with no configuration accepted requests from any domain. Now reads `CLIENT_ORIGIN` from `.env` (default `http://localhost:3000`) and rejects all other origins
  - **File:** `index.js`, `.env`
- **No `JWT_SECRET` startup validation** — If `JWT_SECRET` was missing from `.env`, the server started fine but failed silently at the first token operation. Now validated at boot with `process.exit(1)` and a `FATAL` message if missing
  - **File:** `index.js`

#### 🟡 Quality Improvements
- **Unhandled rejection / uncaught exception handlers** — Added `process.on('unhandledRejection')` and `process.on('uncaughtException')` to prevent invisible server crashes
- **Graceful shutdown** — `SIGTERM` and `SIGINT` signals now close the HTTP server and call `prisma.$disconnect()` before exiting, preventing connection leaks
- **`express.urlencoded({ extended: false })`** — Added alongside `express.json()` to correctly parse form-encoded request bodies
- **`intelController.js` bare error logging** — `console.error(error)` calls replaced with descriptive context messages (`'Get threat actors error:'`, `'Get IOCs error:'`) matching the pattern used in other controllers
  - **File:** `index.js`, `controllers/intelController.js`

---

## [3.1.0] - 2026-02-24 | 17:22 IST

### Fixed — Comprehensive Bug-Fix & Hardening Pass

#### 🐛 Critical Fixes (previously landed)
- **`Math.random()` in render** — `OverviewPage` confidence calculation moved into `useMemo`; eliminated flicker on every re-render
- **`key={index}` on lists** — `GlobalSearch` result items now keyed by unique field, fixing React reconciliation issues
- **Unsafe `JSON.parse`** — `storage.js` now wraps `JSON.parse` in `try/catch`; prevents `AuthProvider` crash on malformed `localStorage` data
- **Null `actor.id` crash** — `ThreatActorsPage` no longer crashes when `actor.id` is `null`
- **Hardcoded API URL** — `services/api.js` now reads from `REACT_APP_API_URL` env variable with `localhost:5000` fallback
- **`WidgetWrapper` inside render** — Component definition moved outside `DraggableDashboard` to prevent remount on every render

#### 🛠️ Moderate Fixes & Quality Improvements
- **User-facing error states** — All 5 data-fetching pages now show a styled error banner with a Retry button on API failure:
  - `OverviewPage` — inline red error banner at the top; does not replace entire page
  - `IOCFeedPage`, `SearchPage` — full-page error state with retry
  - `ThreatActorsPage`, `DraggableDashboard` — full-page error state with retry
- **Global Search caching** — Data fetched **once per dialog session** (was 3 full API calls per keystroke). `useRef` cache stores raw data; subsequent keystrokes filter client-side only. `AbortController` cancels previous in-flight requests
- **Dead `react-loadable` removed** — All `Loadable()` exports deleted from `performanceUtils.js`; `App.js` already handles code-splitting via `React.lazy`. `LoadingComponent` exported for reuse
- **Threat Actor View Profile modal** — Clicking "View Profile →" opens a detail modal showing description, origin, type, last seen, actor ID, and motive
- **401 redirect upgraded** — Replaced `window.location.href = '/login'` (full page reload) with `window.dispatchEvent(new CustomEvent('auth:unauthorized'))`. `AuthContext` listens for this event, clears user state, and shows a `"Session Expired"` toast — navigation handled by React Router without reload
- **Memoize cache capped** — `memoize()` utility now accepts `maxSize` (default 100) and evicts the oldest LRU entry to prevent unbounded memory growth
- **`performance.timing` modernised** — Deprecated `window.performance.timing` replaced with `performance.getEntriesByType('navigation')` in `logPerformanceMetrics`

#### ✨ Visual Fix
- **Top Affected Assets blinking** — `TopAssetsCard` bar chart numbers no longer flicker/blink. Root cause: `<linearGradient>` definitions were recreated inside every `CustomBar` render, causing SVG `id` collisions. Fix: Gradient `<defs>` extracted into a single `GradientDefs` component rendered once at `BarChart` level. Also added `isAnimationActive={false}` to suppress redundant entrance re-renders

#### 🧹 Code Quality
- Removed all stale comments referencing dead code paths
- Consistent `try/catch` error logging across all pages (`'Failed to load X', err` pattern)
- `ThreatActorsPage` fully rewritten with clean JSX structure (was malformed — unclosed divs, misplaced empty state)
- `AuthContext` `useEffect` now returns a cleanup function removing the `auth:unauthorized` event listener

- **Files changed:** `GlobalSearch.js`, `ThreatActorsPage.js`, `OverviewPage.js`, `IOCFeedPage.js`, `SearchPage.js`, `DraggableDashboard.js`, `TopAssetsCard.js`, `AuthContext.js`, `services/api.js`, `utils/storage.js`, `utils/performanceUtils.js`

---

## [3.0.0] - 2026-02-23 | 12:15 IST

### Added — Premium Settings Page Redesign

#### ⚙️ Settings Page — Complete Overhaul
- **Sidebar navigation** with 5 sections: Profile, User Management, Integrations, Alert Rules, Dashboard
- **Color-coded nav items** using indigo / cyan / violet / amber / emerald accent palettes
- **Reusable UI primitives**: `InputField`, `SelectField`, `Toggle`, `SectionCard`, `Modal`, `SaveBanner`, `PrimaryBtn`, `GhostBtn`
- **Profile Tab**
  - Gradient avatar (`from-indigo-500 to-cyan-500`) with live emerald online-status dot
  - Editable personal info (Full Name, Email, Phone); Role shown as read-only
  - Inline validation: required name, valid email regex
  - Password change form (Current → New → Confirm) with 8-char minimum enforcement
  - Flash `SaveBanner` success message (auto-hides after 3 s)
- **User Management Tab**
  - Team member list with rotating gradient avatars (4 colour schemes)
  - Role badge: Admin highlighted in cyan, Analyst in slate
  - One-click **Active ↔ Inactive** status toggle per row
  - Ghost delete button revealed on row hover
  - **Add User Modal**: Name, Email, Role with full validation
  - **Delete Confirm Modal**: Destructive action guarded by explicit confirmation
- **Integrations Tab**
  - Cards for SIEM Platform, Slack, VirusTotal, MISP
  - Per-card **Connect / Disconnect** toggle with colour-coded border
  - **Configure Modal**: API Key (masked, ≥ 10 chars), Endpoint URL, Sync Frequency
  - Success banner on save
- **Alert Rules Tab**
  - Notification channel toggles: Email Alerts, Slack, Browser Sound
  - Alert behaviour toggles: Critical Only Mode, Auto-Escalate, Weekly Summary Report
  - SLA Threshold fields: Critical SLA (mins), High SLA (mins), Retention (days ≥ 7)
  - Numeric validation with inline error messages
- **Dashboard Tab**
  - Display preference toggles: Auto-Refresh, Compact Mode, User Avatars, Dark Charts, Sticky Header, UI Animations
  - Layout & Locale selectors: Default Landing Page, Refresh Interval (10–3600 s, validated), Date Format, Timezone
- **Dynamic section header bar** — color accent shifts automatically per active nav section
- **Files**: `src/pages/SettingsPage.js` (complete rewrite, 616 lines)

### Design Improvements
- Fully self-contained Tailwind CSS (no MUI `Box` / `sx` props)
- Glassmorphism cards: `bg-slate-800/40 border-white/6 rounded-2xl`
- Sticky sidebar; responsive 1-col → 2–3-col grid layouts
- `role="switch"` + `aria-checked` on all toggle buttons

### Dependencies Added
- `@mui/icons-material` — icon set used throughout Settings UI

---

## [2.5.0] - 2026-02-20 | 05:55 IST

### Fixed — Page Navigation Error

#### 🐛 Theme Property Access Crash
- Fixed **"Cannot read properties of undefined (reading 'border')"** error that occurred when navigating between pages
- Root cause: theme/style properties being accessed on undefined objects during page transitions
- Applied null-safe guards on all theme property accesses in affected components
- Ensured stable page transitions across all routes

---

## [2.4.0] - 2026-02-18 | 12:07 IST

### Enhanced — Campaign Timeline Design Refinement

#### 📅 Campaign Timeline — Premium Theme Consistency
- Redesigned **tooltip styling** to match the dashboard's premium glassmorphism theme
- Updated **campaign cards** with consistent top gradient accent bar
- Applied hover animations matching the rest of the dashboard components
- Enforced visual consistency: glassmorphism effect, border styling, and card shadows
- Ensured all campaign-related visualizations share the same dark design language
- **Files**: Campaign Timeline component(s)

---

## [2.3.0] - 2026-02-17 | 12:29 IST

### Documentation — README Overhaul

#### 📖 README.md — Technology Stack & Platform Details
- Restructured **Technology Stack** into **Technologies/Platform** with categories:
  - Frontend, Backend, Simulator, Hardware
- Added comprehensive details for each technology category
- Updated testing and linting instructions with exact commands
- Added relevant status badges
- Documented development environment setup comprehensively
- **Files**: `README.md`

---

## [2.2.0] - 2026-02-16 | 11:50 IST

### Enhanced — Dashboard Layout & Performance Optimization

#### 📐 Layout Refinements
- Fixed visual/layout issues throughout the dashboard
- Improved overall spacing, padding and card alignment
- Added new dashboard components
- Enhanced visual animations and transitions across pages

#### ⚡ Performance Optimizations
- Optimized the dashboard for **low-RAM environments**
- Implemented **code splitting** to reduce initial bundle size
- Ensured **cross-platform compatibility** across operating systems

#### 🌐 Cross-Platform
- Verified and fixed compatibility issues on Windows / macOS / Linux
- **Files**: Multiple layout and page components

---

## [2.1.0] - 2026-02-16 | 07:41 IST

### Added — Collapsible Sidebar Toggle

#### 📌 Sidebar Toggle
- Implemented **collapsible sidebar** with expand / collapse toggle button
- Added smooth **width transition** animation between expanded and collapsed states
- Sidebar state managed via React state; main content layout adapts accordingly
- Refactored existing dashboard components for **reusability and consistency**
- Toggle button accessible from the sidebar header
- **Files**: `src/layout/SOCLayout.js`, related sidebar components

---

## [2.0.0] - 2026-02-13 | 12:34 IST

### Added — Advanced Interactive Features & Accessibility

#### ♿ Accessibility — WCAG 2.1 AA Compliance
- Added comprehensive **ARIA labels** across all interactive elements
- Enhanced **screen reader support** with semantic HTML structure
- Implemented full **keyboard navigation** throughout the application
- Improved color contrast to meet WCAG 2.1 AA standards
- Added focus indicators on all focusable elements

#### 🧪 Testing Suite
- Implemented **unit tests** for core components
- Implemented **integration tests** for page interactions
- Implemented **performance tests** for dashboard rendering
- Testing framework configured and documented

#### 📰 Intel Report Page
- Created new **Intel Report** page with threat intelligence content
- Integrated into application routing (`/intel-reports`)
- **Files**: `src/pages/IntelReportPage.js` (new)

#### 🔔 Toast Notifications
- Custom toast notification system with SOC-themed styling
- 4 variants: Success, Error, Warning, Info
- Auto-dismiss with configurable duration; Promise support
- **Files**: `src/utils/toast.js` (new)

#### 🔍 Global Search (⌘K / Ctrl+K)
- Real-time search across alerts, IOCs, and threat actors
- Categorized results; glassmorphism dialog
- **Files**: `src/components/GlobalSearch.js` (new)

#### 📊 Interactive Charts
- Click handlers on chart data points with custom tooltips
- Hover effects and smooth animations
- **Files**: `src/components/AlertsTrendCard.js` (enhanced)

#### 🎛️ Advanced Filters Panel
- Multi-criteria filtering (Severity + Status) via right-side drawer
- Color-coded checkboxes; active filter count badge; reset
- **Files**: `src/components/FilterPanel.js` (new)

#### 🎯 Draggable Dashboard
- Drag-and-drop widgets, resize, edit mode toggle
- Layout persisted to `localStorage` (`dashboard-layouts`)
- **Files**: `src/pages/DraggableDashboard.js` (new)

### Fixed — Import Errors
- Fixed **WidthProvider** import from `react-grid-layout` (was causing crash)
- Fixed all **MUI icon** import paths in `DraggableDashboard.js` and `SOCLayout.js`
- Removed all unused imports and variable warnings
- Resolved all compilation errors

### Enhanced
- `src/App.js` — Routes, Toaster, LoadingScreen (prevents blank screen on load)
- `src/pages/LoginPage.js` — Toast success/error/info feedback integrated
- `src/layout/SOCLayout.js` — Global search in navbar, Custom Dashboard in sidebar
- `src/pages/OverviewPage.js` — Filter panel wired with state management

### Dependencies Added
- `react-hot-toast@^2.6.0` — Toast notification system
- `react-grid-layout@^2.2.2` — Draggable and resizable grid

### Dependencies Updated
- React → 19.2.4
- Material-UI → 7.3.7
- React Router DOM → 6.30.3

---

## [1.1.0] - 2026-02-12 | 12:23 IST

### Fixed — Chart Layout & Visibility Issues

#### 📊 Top Assets Card
- Fixed truncated/invisible asset name text — now fully visible
- Corrected padding and spacing for consistent enterprise-grade appearance

#### 🍩 IOC Types Card (Donut Chart)
- Fixed donut chart not centering correctly in its container
- Ensured chart fills available space without overflow
- Consistent padding applied matching other cards

---

## [1.0.0] - 2026-02-12 | 00:00 IST

### Initial Release

#### 🏗️ Core Dashboard
- Overview Dashboard with KPI summary cards
- Severity snapshot and alert trends chart
- IOC distribution visualization
- Top assets panel
- Threat actor intelligence section
- Recent activity feed
- Alert status breakdown

#### 🎨 Design System
- Dark theme throughout (`#0B1120` base)
- Glassmorphism card effects
- Responsive grid layout
- Mock data for demonstration

#### 📄 Pages
- Dashboards, IOC Feed, Search, Threat Actors

---

## 🔮 Future Enhancements

### Planned Features
- Backend integration for real data
- WebSocket support for real-time updates
- User authentication wired to backend
- Advanced analytics and reporting
- Export functionality (PDF / CSV)
- More chart types (zoom, pan)
- Additional filter criteria
- Widget library for dashboard customization
- User preferences API
- Mobile app version

---

**Version 4.4.0** — Production Automation & Zero-Data Architecture _(2026-04-06)_

**Version 4.3.0** — Architecture Optimization & SOAR Hardening _(2026-04-02)_

**Version 4.1.0** — Intelligent Operations & Enrichment _(2026-04-02)_

**Version 4.0.1** — Responsive Layout Fix _(2026-03-27)_
**Version 4.0.0** — Comprehensive Capability Upgrades _(2026-03-07)_
**Version 3.3** — Removed Docker Support _(2026-03-07)_
**Version 3.0** — Premium Settings Page Redesign _(2026-02-23)_
**Version 2.5** — Page Navigation Bug Fix _(2026-02-20)_
**Version 2.4** — Campaign Timeline Design Refinement _(2026-02-18)_
**Version 2.3** — README Documentation Overhaul _(2026-02-17)_
**Version 2.2** — Dashboard Layout & Performance Optimization _(2026-02-16)_
**Version 2.1** — Collapsible Sidebar Toggle _(2026-02-16)_
**Version 2.0** — Advanced Interactive Features & Accessibility _(2026-02-13)_
**Version 1.1** — Chart Layout & Visibility Fixes _(2026-02-12)_
**Version 1.0** — Initial Release _(2026-02-12)_
