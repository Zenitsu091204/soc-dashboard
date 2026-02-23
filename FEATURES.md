# Advanced Features Documentation

This document provides detailed information about all advanced interactive features implemented in the SOC Dashboard.

**Last Updated:** 2026-02-23 12:15 IST — v3.0.0

## Table of Contents

1. [Settings Page](#settings-page) _(v3.0.0)_
2. [Toast Notifications](#toast-notifications) _(v2.0.0)_
3. [Global Search](#global-search) _(v2.0.0)_
4. [Interactive Charts](#interactive-charts) _(v2.0.0)_
5. [Advanced Filters](#advanced-filters) _(v2.0.0)_
6. [Draggable Dashboard](#draggable-dashboard) _(v2.0.0)_

---

## ⚙️ Settings Page

> **Added:** v3.0.0 — 2026-02-23 12:15 IST

### Overview
A fully redesigned, premium Settings page with a sticky sidebar navigation and 5 distinct configuration sections. Built entirely with Tailwind CSS utility classes and MUI icons — no MUI Box/sx props.

### Location
`src/pages/SettingsPage.js`

### Sidebar Navigation Sections

| Section | Icon Color | Description |
|---------|-----------|-------------|
| Profile | Indigo | Personal info, avatar, password change |
| User Management | Cyan | Team members, roles, add/remove users |
| Integrations | Violet | SIEM, Slack, VirusTotal, MISP connections |
| Alert Rules | Amber | Notification channels, SLA thresholds |
| Dashboard | Emerald | Display preferences, layout & locale |

### Reusable Primitives

```javascript
// InputField — styled text / email / password / number input
<InputField label="Full Name" id="name" value={v} onChange={fn} error={err} />

// SelectField — styled native select
<SelectField label="Role" id="role" value={v} onChange={fn} options={[...]} />

// Toggle — accessible switch (role="switch", aria-checked)
<Toggle label="Auto-Refresh" description="..." checked={bool} onChange={fn} />

// SectionCard — glassmorphism card with optional header + action button
<SectionCard title="Title" description="..." icon={Icon} action={<PrimaryBtn>Save</PrimaryBtn>}>
  {children}
</SectionCard>

// Modal — backdrop blur dialog (sm / md / lg sizes)
<Modal isOpen={bool} onClose={fn} title="Title" size="md">{children}</Modal>

// SaveBanner — emerald flash message
<SaveBanner visible={bool} message="Changes saved successfully" />

// PrimaryBtn / GhostBtn — indigo primary and ghost action buttons
<PrimaryBtn onClick={fn}>Save</PrimaryBtn>
<GhostBtn danger onClick={fn}>Delete</GhostBtn>
```

### Profile Tab

**Features:**
- Gradient avatar (`from-indigo-500 to-cyan-500`) with emerald online dot
- Editable: Full Name, Email, Phone; Role (read-only)
- Inline validation (required name, valid email format)
- Password change: Current → New → Confirm with 8-char minimum check
- Flash `SaveBanner` on success (auto-hides after 3 s)

### User Management Tab

**Features:**
- User list with per-user gradient avatar (4 rotating color schemes)
- Role badge (Admin highlighted in cyan, Analyst in slate)
- One-click Active ↔ Inactive status toggle button per row
- Ghost delete button revealed on row hover
- **Add User Modal**: Name, Email, Role with full validation
- **Delete Confirm Modal**: Destructive action with explicit confirmation

### Integrations Tab

**Integrations Configured:**

| ID | Name | Description | Default State |
|----|------|-------------|---------------|
| siem | SIEM Platform | Splunk / QRadar event ingestion | Connected |
| slack | Slack | Push alert notifications | Disconnected |
| virustotal | VirusTotal | IOC enrichment & threat analysis | Connected |
| misp | MISP | Pull threat feeds | Disconnected |

**Features:**
- Integration cards with color-coded icon, connection badge
- Connect / Disconnect toggle per card
- Configure Modal: API Key (masked), Endpoint URL, Sync Frequency select
- API key validation: ≥ 10 characters required
- Confirmation banner on successful save

### Alert Rules Tab

**Notification Channels (Toggle switches):**
- Email Alerts
- Slack Notifications
- Browser Sound (audio chime)

**Alert Behaviour (Toggle switches):**
- Critical Only Mode (suppress medium / low)
- Auto-Escalate (trigger on SLA breach)
- Weekly Summary Report (email digest)

**SLA & Retention Fields:**
- Critical SLA (minutes) — must be ≥ 1
- High SLA (minutes) — must be ≥ 1
- Retention (days) — minimum 7 days

### Dashboard Tab

**Display Preferences (Toggle switches):**
- Auto-Refresh, Compact Mode, User Avatars, Dark Charts, Sticky Header, UI Animations

**Layout & Locale (Select / Input):**
- Default Landing Page
- Refresh Interval (10–3600 seconds, validated)
- Date Format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
- Timezone (UTC, US/Eastern, Europe/London, Asia/Kolkata, Asia/Tokyo, …)

### Color Accent System

```javascript
const COLOR_MAP = {
  indigo:  { bg, text, border, ring },
  cyan:    { bg, text, border, ring },
  violet:  { bg, text, border, ring },
  amber:   { bg, text, border, ring },
  emerald: { bg, text, border, ring },
};
```
The section header bar and active sidebar item dynamically apply the accent for the currently active section.

### Styling
- Card background: `bg-slate-800/40 border-white/6 rounded-2xl`
- Input: `bg-slate-800/60 border-white/8 rounded-xl`
- Sidebar: `bg-slate-800/50 border-white/6 rounded-2xl` (sticky)
- Focus rings: `ring-2 ring-indigo-500/50`
- Transition: `duration-200` on all interactive elements

### Accessibility
- `role="switch"` + `aria-checked` on all toggle buttons
- `htmlFor` on all labels
- Keyboard-focusable modals with close button
- Color-contrast–safe text colors (slate-200 on slate-900)

---

## 🔔 Toast Notifications

> **Added:** v2.0.0 — 2026-02-13

### Overview
Custom toast notification system with SOC-themed styling and glassmorphism effects.

### Location
`src/utils/toast.js`

### Features
- 4 variants: Success, Error, Warning, Info
- Auto-dismiss with configurable duration
- Custom icons and colors
- Glassmorphism styling
- Promise support for async operations
- Quick toast for brief messages

### Usage

```javascript
import showToast from '../utils/toast';

showToast.success('Operation completed!', 'Data saved successfully');
showToast.error('Operation failed', 'Please try again');
showToast.warning('Low disk space', 'Consider cleaning up');
showToast.info('New update available', 'Version 3.0 ready');
showToast.quick('Saved!', 'success');
showToast.promise(fetchData(), { loading: 'Loading…', success: 'Loaded!', error: 'Failed' });
```

### Styling
- Background: `rgba(21, 30, 50, 0.95)` with blur
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Position: Top-right
- Duration: 2–4 seconds (varies by type)

---

## 🔍 Global Search

> **Added:** v2.0.0 — 2026-02-13

### Overview
Powerful global search with keyboard shortcut support and real-time results.

### Location
`src/components/GlobalSearch.js`

### Features
- Keyboard shortcut: `Cmd+K` (Mac) or `Ctrl+K` (Windows)
- Real-time search as you type
- Searches across alerts, IOCs, and threat actors
- Categorized results with icons
- Glassmorphism dialog
- Auto-focus on search input
- Press `Esc` to close

### Search Algorithm
- Case-insensitive matching
- Searches in: alert titles, entities, severity; IOC values and types; threat actor names
- Results limited to 5 per category

### Styling
- Dialog: Centered, max-width `md`
- Background: `rgba(21, 30, 50, 0.95)` with blur
- Border: `1px solid rgba(99, 102, 241, 0.3)`

---

## 📊 Interactive Charts

> **Added:** v2.0.0 — 2026-02-13

### Overview
Enhanced chart components with click handlers, custom tooltips, and animations.

### Location
`src/components/AlertsTrendCard.js`

### Features
- Click handlers on data points
- Custom tooltips with glassmorphism
- Hover effects on chart dots
- Smooth animations
- Callback support for filtering

### Usage

```javascript
<AlertsTrendCard
  alerts={alerts}
  onTimeRangeClick={(data) => {
    console.log('Clicked:', data);
  }}
/>
```

### Styling
- Tooltip background: `rgba(15, 23, 42, 0.98)` with blur
- Active dot: Larger size, lighter color
- Animation: 1000ms ease-in-out

---

## 🎛️ Advanced Filters

> **Added:** v2.0.0 — 2026-02-13

### Overview
Multi-criteria filtering panel with severity and status filters.

### Location
`src/components/FilterPanel.js`

### Features
- Right-side drawer UI
- Severity filtering: Critical, High, Medium, Low
- Status filtering: Open, In Progress, Resolved, False Positive
- Color-coded checkboxes
- Active filter count badge
- Reset + Apply functionality

### Filter Structure

```javascript
{
  severity: { critical, high, medium, low },
  status:   { open, 'in-progress', resolved, 'false-positive' }
}
```

### Checkbox Colors
- Critical: `#EF4444`, High: `#F59E0B`, Medium: `#EAB308`, Low: `#10B981`, Status: `#6366F1`

---

## 🎯 Draggable Dashboard

> **Added:** v2.0.0 — 2026-02-13

### Overview
Fully customizable dashboard with drag-and-drop widgets and layout persistence.

### Location
`src/pages/DraggableDashboard.js`

### Features
- Drag and drop widgets
- Resize from bottom-right corner
- Edit mode toggle (lock/unlock)
- Save layout to localStorage (`dashboard-layouts`)
- Reset to default layout
- Responsive grid system

### Widgets Included
1. Total Alerts, 2. Critical Alerts, 3. High Priority, 4. Risk Score
5. Alerts Trend, 6. Alert Status, 7. Top Assets, 8. Top Threats, 9. IOC Distribution

### Grid Configuration
```javascript
breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
cols:        { lg: 12,   md: 10,  sm: 6,   xs: 4,   xxs: 2  }
rowHeight: 30
```

---

## 🎨 Design System

All features share a consistent design language:

| Token | Value |
|-------|-------|
| Primary | `#6366F1` (Indigo) |
| Background | `#0B1120`, `#1E293B` |
| Success | `#10B981` |
| Error | `#EF4444` |
| Warning | `#F59E0B` |
| Glassmorphism | `backdrop-filter: blur(20px)` |
| Transition | 0.2s – 0.3s ease |

---

## 📱 Responsive Design

All features adapt to mobile screens:
- Settings sidebar collapses on small viewports
- Toast notifications adapt to screen width
- Global search is full-width on mobile
- Charts use responsive containers
- Draggable Dashboard has responsive breakpoints

---

## ♿ Accessibility

- `role="switch"` + `aria-checked` on toggles
- Keyboard navigation throughout
- Focus indicators on all interactive elements
- ARIA labels where appropriate
- Color-contrast–compliant text

---

**Version 3.0** — Premium Settings Page Redesign  
**Version 2.0** — Advanced Interactive Features
