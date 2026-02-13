# Changelog

All notable changes to the SOC Dashboard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-13

### Added - Advanced Interactive Features

#### 🔔 Toast Notifications
- Custom toast notification system with SOC-themed styling
- 4 variants: Success, Error, Warning, Info
- Auto-dismiss functionality with configurable duration
- Promise support for async operations
- Quick toast for brief messages
- Integrated into login page and throughout application
- Files: `src/utils/toast.js`

#### 🔍 Global Search (⌘K)
- Keyboard shortcut support (`Cmd+K` / `Ctrl+K`)
- Real-time search across alerts, IOCs, and threat actors
- Categorized results with icons
- Glassmorphism dialog with dark theme
- Auto-focus on search input
- Press `Esc` to close
- Files: `src/components/GlobalSearch.js`

#### 📊 Interactive Charts
- Click handlers on chart data points
- Custom tooltips with enhanced styling
- Hover effects and smooth animations
- Callback support for time-based filtering
- Visual feedback on interaction
- Files: `src/components/AlertsTrendCard.js` (enhanced)

#### 🎛️ Advanced Filters Panel
- Multi-criteria filtering (Severity + Status)
- Right-side drawer with glassmorphism
- Color-coded checkboxes matching severity levels
- Active filter count badge
- Reset functionality
- Integrated into Overview page
- Files: `src/components/FilterPanel.js`

#### 🎯 Draggable Dashboard
- Drag and drop widgets to customize layout
- Resize widgets from bottom-right corner
- Edit mode toggle with lock/unlock icon
- Save layout to localStorage (persists across sessions)
- Reset to default layout option
- Responsive grid system
- Visual feedback during editing
- Files: `src/pages/DraggableDashboard.js`

### Enhanced

#### Authentication
- Added loading spinner during authentication check
- Prevents blank screen on initial load
- Improved user experience with visual feedback
- Files: `src/App.js`

#### Login Page
- Integrated toast notifications for feedback
- Success/error toasts for login attempts
- Info toast for password reset
- Error toast for missing credentials
- Files: `src/pages/LoginPage.js`

#### Overview Page
- Integrated advanced filters panel
- Filter state management
- Alert filtering by severity and status
- Active filter count display
- Files: `src/pages/OverviewPage.js`

#### Layout
- Added global search to navbar
- Added custom dashboard to sidebar navigation
- Improved navigation structure
- Files: `src/layout/SOCLayout.js`

### Dependencies

#### Added
- `react-hot-toast@^2.6.0` - Toast notification system
- `react-grid-layout@^2.2.2` - Draggable and resizable grid

#### Updated
- React to version 19.2.4
- Material-UI to version 7.3.7
- React Router DOM to version 6.30.3

### Fixed
- Blank screen issue on initial load (added loading spinner)
- Import errors with react-grid-layout (fixed WidthProvider import)
- Unused variable warnings (removed unused imports and variables)
- Compilation errors (fixed all import and export issues)

### Documentation

#### Added
- Comprehensive README.md update with all features
- FEATURES.md with detailed technical documentation
- Testing guide with step-by-step instructions
- Walkthrough documentation with all implementations
- Implementation plan with technical details

### Files Created (4)
1. `src/utils/toast.js` - Toast notification utilities
2. `src/components/GlobalSearch.js` - Global search component
3. `src/components/FilterPanel.js` - Advanced filters panel
4. `src/pages/DraggableDashboard.js` - Draggable dashboard page

### Files Modified (6)
1. `src/App.js` - Routes, Toaster, LoadingScreen
2. `src/pages/LoginPage.js` - Toast integration
3. `src/layout/SOCLayout.js` - Search & navigation
4. `src/components/AlertsTrendCard.js` - Interactive features
5. `src/pages/OverviewPage.js` - Filter integration
6. `src/utils/toast.js` - Cleanup

### Technical Improvements
- Consistent dark theme and glassmorphism across all features
- Smooth animations and transitions
- Responsive design for all new components
- LocalStorage integration for layout persistence
- Keyboard shortcut support
- Loading states and error handling

---

## [1.0.0] - Previous Release

### Initial Features
- Overview Dashboard with KPI cards
- Severity snapshot and alert trends
- IOC distribution and top assets
- Threat actor intelligence
- Recent activity feed
- Alert status breakdown
- Dark theme with glassmorphism
- Responsive grid layout
- Mock data for demonstration
- Multiple pages (Dashboards, IOC Feed, Search, Threat Actors)

---

## Future Enhancements

### Planned Features
- Backend integration for real data
- WebSocket support for real-time updates
- User authentication with backend
- Advanced analytics and reporting
- Export functionality
- More chart types (zoom, pan)
- Additional filter criteria
- Widget library for dashboard customization
- User preferences API
- Mobile app version

---

**Version 2.0** - Advanced Interactive Features Release
