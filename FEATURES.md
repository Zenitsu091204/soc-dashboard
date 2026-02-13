# Advanced Features Documentation

This document provides detailed information about the advanced interactive features implemented in the SOC Dashboard.

## Table of Contents

1. [Toast Notifications](#toast-notifications)
2. [Global Search](#global-search)
3. [Interactive Charts](#interactive-charts)
4. [Advanced Filters](#advanced-filters)
5. [Draggable Dashboard](#draggable-dashboard)

---

## 🔔 Toast Notifications

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

// Success toast
showToast.success('Operation completed!', 'Data saved successfully');

// Error toast
showToast.error('Operation failed', 'Please try again');

// Warning toast
showToast.warning('Low disk space', 'Consider cleaning up');

// Info toast
showToast.info('New update available', 'Version 2.0 ready');

// Quick toast (no description)
showToast.quick('Saved!', 'success');

// Promise toast (for async operations)
showToast.promise(
  fetchData(),
  {
    loading: 'Loading...',
    success: 'Loaded!',
    error: 'Failed to load',
  }
);
```

### Integration
- Login page: Login success/failure, missing credentials, password reset
- Charts: Time range selection feedback
- Filters: Filter application confirmation
- Draggable Dashboard: Layout save/reset confirmation

### Styling
- Background: `rgba(21, 30, 50, 0.95)` with blur
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Position: Top-right
- Duration: 2-4 seconds (varies by type)

---

## 🔍 Global Search

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

### Usage

**Opening Search:**
- Press `Cmd+K` or `Ctrl+K` anywhere in the app
- Click the search bar in the navbar

**Searching:**
- Type your query
- Results appear instantly
- Results are categorized:
  - ALERTS (with notification icon)
  - INDICATORS OF COMPROMISE (with bug icon)
  - THREAT ACTORS (with person icon)

**Closing:**
- Press `Esc`
- Click outside the dialog

### Search Algorithm
- Case-insensitive matching
- Searches in:
  - Alert titles, entities, severity
  - IOC values and types
  - Threat actor names and categories
- Results limited to 5 per category

### Styling
- Dialog: Centered, max-width 'md'
- Background: `rgba(21, 30, 50, 0.95)` with blur
- Border: `1px solid rgba(99, 102, 241, 0.3)`
- Icons: Color-coded by category

---

## 📊 Interactive Charts

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
- Visual feedback on interaction

### Usage

```javascript
<AlertsTrendCard 
  alerts={alerts}
  onTimeRangeClick={(data) => {
    console.log('Clicked:', data);
    // Handle filtering by time range
  }}
/>
```

### Interactions

**Hover:**
- Custom tooltip appears
- Shows alert count and time
- Displays "Click to filter by this time" hint

**Click:**
- Triggers toast notification
- Calls `onTimeRangeClick` callback with data
- Visual feedback with active dot styling

### Tooltip Content
- Time label (formatted)
- Alert count (large, indigo color)
- Action hint (click to filter)

### Styling
- Tooltip background: `rgba(15, 23, 42, 0.98)` with blur
- Border: `1px solid rgba(99, 102, 241, 0.4)`
- Active dot: Larger size, lighter color
- Animation: 1000ms ease-in-out

---

## 🎛️ Advanced Filters

### Overview
Multi-criteria filtering panel with severity and status filters.

### Location
`src/components/FilterPanel.js`

### Features
- Right-side drawer UI
- Severity filtering (Critical, High, Medium, Low)
- Status filtering (Open, In Progress, Resolved, False Positive)
- Color-coded checkboxes
- Active filter count badge
- Reset functionality
- Apply button to confirm changes

### Usage

```javascript
import FilterPanel, { FilterButton } from '../components/FilterPanel';

// In your component
const [filterPanelOpen, setFilterPanelOpen] = useState(false);
const [activeFilters, setActiveFilters] = useState({
  severity: { critical: true, high: true, medium: true, low: true },
  status: { open: true, 'in-progress': true, resolved: false, 'false-positive': false }
});

// Filter button
<FilterButton 
  onClick={() => setFilterPanelOpen(true)} 
  activeCount={activeFiltersCount} 
/>

// Filter panel
<FilterPanel
  open={filterPanelOpen}
  onClose={() => setFilterPanelOpen(false)}
  onApplyFilters={(filters) => {
    setActiveFilters(filters);
  }}
/>
```

### Filter Structure

```javascript
{
  severity: {
    critical: boolean,
    high: boolean,
    medium: boolean,
    low: boolean
  },
  status: {
    open: boolean,
    'in-progress': boolean,
    resolved: boolean,
    'false-positive': boolean
  }
}
```

### Checkbox Colors
- Critical: `#EF4444` (Red)
- High: `#F59E0B` (Orange)
- Medium: `#EAB308` (Yellow)
- Low: `#10B981` (Green)
- Status: `#6366F1` (Indigo)

### Actions
- **Reset**: Clears all filters to default
- **Apply Filters**: Closes drawer and applies filters
- **Close**: Closes drawer without applying

---

## 🎯 Draggable Dashboard

### Overview
Fully customizable dashboard with drag-and-drop widgets and layout persistence.

### Location
`src/pages/DraggableDashboard.js`

### Features
- Drag and drop widgets
- Resize from bottom-right corner
- Edit mode toggle (lock/unlock)
- Save layout to localStorage
- Reset to default layout
- Responsive grid system
- Visual feedback in edit mode

### Usage

**Accessing:**
- Navigate to "Custom Dashboard" in sidebar
- Or visit `/custom-dashboard`

**Edit Mode:**
1. Click lock icon to unlock
2. Drag widgets to reposition
3. Resize from bottom-right corner
4. Click "Save Layout" to persist
5. Click "Reset" to restore defaults
6. Click lock icon to exit edit mode

### Grid Configuration

```javascript
breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
rowHeight: 30
```

### Default Layout

```javascript
{
  lg: [
    { i: 'stat1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat2', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat3', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat4', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'trend', x: 0, y: 2, w: 8, h: 6, minW: 6, minH: 4 },
    { i: 'status', x: 8, y: 2, w: 4, h: 6, minW: 3, minH: 4 },
    { i: 'assets', x: 0, y: 8, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'threats', x: 4, y: 8, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'iocs', x: 8, y: 8, w: 4, h: 5, minW: 3, minH: 4 },
  ]
}
```

### Widgets Included
1. Total Alerts (StatCard)
2. Critical Alerts (StatCard)
3. High Priority (StatCard)
4. Risk Score (StatCard)
5. Alerts Trend (AlertsTrendCard)
6. Alert Status (AlertStatusCard)
7. Top Assets (TopAssetsCard)
8. Top Threats (TopThreatActorsCard)
9. IOC Distribution (IocDistributionCard)

### LocalStorage
- Key: `dashboard-layouts`
- Value: JSON stringified layout object
- Persists across sessions
- Cleared on reset

### Edit Mode Visual Feedback
- Blue info banner at top
- Dashed outline on hover
- Move cursor on drag
- Resize handle visible
- Lock/unlock icon changes color

---

## 🎨 Design Consistency

All features maintain consistent styling:

### Colors
- Primary: `#6366F1` (Indigo)
- Background: `#0B1120`, `#1E293B`
- Success: `#10B981`
- Error: `#EF4444`
- Warning: `#F59E0B`
- Info: `#6366F1`

### Effects
- Glassmorphism: `backdrop-filter: blur(20px)`
- Semi-transparent backgrounds
- Subtle borders with low opacity
- Smooth transitions (0.2s - 0.3s)

### Typography
- Headers: Font weight 700-800
- Body: Font weight 400-600
- Captions: Smaller size, secondary color

---

## 🚀 Performance Considerations

### Toast Notifications
- Auto-dismiss prevents accumulation
- Lightweight custom component
- No external dependencies beyond react-hot-toast

### Global Search
- Debounced search (via useCallback)
- Results limited to 5 per category
- Efficient filtering algorithms

### Interactive Charts
- Memoized data processing
- Optimized re-renders
- Smooth animations without jank

### Advanced Filters
- Controlled component pattern
- Efficient state updates
- Minimal re-renders

### Draggable Dashboard
- Layout saved to localStorage (not state)
- Conditional rendering in edit mode
- Optimized grid calculations

---

## 📱 Responsive Design

All features are mobile-friendly:

- **Toast Notifications**: Adapt to screen width
- **Global Search**: Full-width on mobile
- **Charts**: Responsive container
- **Filters**: Full-height drawer on mobile
- **Draggable Dashboard**: Responsive breakpoints

---

## ♿ Accessibility

- Keyboard navigation support
- Focus indicators
- ARIA labels where appropriate
- Color contrast compliance
- Screen reader friendly

---

## 🔧 Customization

### Toast Notifications
Edit `src/utils/toast.js`:
- Change colors
- Adjust duration
- Modify position
- Add new variants

### Global Search
Edit `src/components/GlobalSearch.js`:
- Change keyboard shortcut
- Modify search algorithm
- Add new categories
- Customize styling

### Interactive Charts
Edit `src/components/AlertsTrendCard.js`:
- Change chart type
- Modify tooltip content
- Adjust animations
- Add new interactions

### Advanced Filters
Edit `src/components/FilterPanel.js`:
- Add new filter criteria
- Change checkbox colors
- Modify drawer width
- Add filter presets

### Draggable Dashboard
Edit `src/pages/DraggableDashboard.js`:
- Add/remove widgets
- Change grid configuration
- Modify default layout
- Add widget library

---

**Version 2.0** - Advanced Interactive Features
