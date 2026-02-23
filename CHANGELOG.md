# Changelog

All notable changes to the SOC Dashboard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

**Version 3.0** — Premium Settings Page Redesign _(2026-02-23)_
**Version 2.5** — Page Navigation Bug Fix _(2026-02-20)_
**Version 2.4** — Campaign Timeline Design Refinement _(2026-02-18)_
**Version 2.3** — README Documentation Overhaul _(2026-02-17)_
**Version 2.2** — Dashboard Layout & Performance Optimization _(2026-02-16)_
**Version 2.1** — Collapsible Sidebar Toggle _(2026-02-16)_
**Version 2.0** — Advanced Interactive Features & Accessibility _(2026-02-13)_
**Version 1.1** — Chart Layout & Visibility Fixes _(2026-02-12)_
**Version 1.0** — Initial Release _(2026-02-12)_
