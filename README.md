# SOC Dashboard

A professional, enterprise-grade Security Operations Center (SOC) dashboard built with React and Material-UI. This dashboard provides real-time monitoring, threat intelligence visualization, alert management capabilities, and advanced interactive features.

![SOC Dashboard](https://img.shields.io/badge/React-19.x-blue) ![Material-UI](https://img.shields.io/badge/MUI-7.x-blue) ![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen) ![Linting](https://img.shields.io/badge/Linting-Strict-green) ![Recharts](https://img.shields.io/badge/Recharts-3.x-green)

## ✨ Advanced Features

### 🔔 Toast Notifications
- **Custom SOC-themed notifications** with glassmorphism styling
- **4 variants**: Success, Error, Warning, Info
- **Auto-dismiss** with configurable duration
- **Promise support** for async operations
- Integrated throughout the application for user feedback

### 🔍 Global Search (⌘K)
- **Keyboard shortcut**: `Cmd+K` (Mac) or `Ctrl+K` (Windows)
- **Real-time search** across alerts, IOCs, and threat actors
- **Categorized results** with icons and metadata
- **Glassmorphism dialog** with dark theme
- Press `Esc` to close

### 📊 Interactive Charts
- **Click handlers** on chart data points
- **Custom tooltips** with enhanced styling
- **Hover effects** and smooth animations
- **Time-based filtering** via chart interaction
- Real-time visual feedback

### 🎛️ Advanced Filters Panel
- **Multi-criteria filtering** (Severity + Status)
- **Right-side drawer** with glassmorphism
- **Color-coded checkboxes** matching severity levels
- **Active filter count** badge
- **Reset functionality** to clear all filters
- Integrated into Overview page

### 🎯 Draggable Dashboard
- **Drag and drop** widgets to customize layout
- **Resize widgets** from bottom-right corner
- **Edit mode toggle** with lock/unlock icon
- **Save layout** to localStorage (persists across sessions)
- **Reset to default** layout option
- **Responsive grid** adapts to screen size
- Visual feedback during editing

## 🚀 Core Features

### Overview Dashboard
- **Real-time KPI Cards**: Total alerts, critical/high priority counts, and dynamic risk score calculation
- **Severity Snapshot**: Color-coded severity distribution with trend indicators
- **Alert Activity Trends**: 7-day volume visualization with gradient area charts
- **IOC Distribution**: Donut chart showing indicator types (IP, Domain, Hash, URL)
- **Top Affected Assets**: Horizontal bar chart of assets with highest alert volume
- **Threat Actor Intelligence**: Active threat groups with risk levels and sophistication ratings
- **Recent Activity Feed**: Live-updating alert stream with severity chips
- **Alert Status Breakdown**: Distribution by status (Open, In Progress, Resolved, False Positive)

### Additional Pages
- **Dashboards**: Custom dashboard management
- **Custom Dashboard**: Fully customizable draggable widget layout
- **IOC Workbench**: Indicator of Compromise analysis tools
- **Threat Actors**: Detailed threat actor profiles
- **Search**: Advanced search and filtering capabilities

### Authentication
- **Login page** with modern dark theme and glassmorphism
- **Protected routes** requiring authentication
- **Session persistence** with "Remember Me" option
- **Password reset** functionality

### Design Highlights
- **Data-Dense Layout**: Professional SOC-style information hierarchy
- **Dark Theme**: High-contrast design optimized for 24/7 monitoring
- **Glassmorphism Effects**: Modern UI with backdrop blur and subtle gradients
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Enterprise-Grade Styling**: Consistent 24px padding, clean typography, professional tooltips
- **Smooth Animations**: All transitions are fluid and professional
- **Loading States**: Spinner during authentication checks

## 🛡️ Code Quality

This project maintains high engineering standards through:

- **Strict Linting**: Zero tolerance for ESLint errors or warnings.
- **Type Safety**: PropType validation on all components.
- **Testing Strategy**:
    - **Unit Tests**: For individual components and utilities.
    - **Integration Tests**: Ensuring modules work together.
    - **Performance**: Automated benchmarks for render times.
    - **Accessibility**: ARIA compliance checks.
- **Asset Optimization**: Efficient loading and rendering of charts.

## 🛠️ Technology Stack

- **React 19** - Modern React with hooks
- **Material-UI (MUI) 7** - Component library and theming
- **Recharts 3** - Data visualization library
- **React Router DOM 6** - Client-side routing
- **React Hot Toast 2** - Toast notification system
- **React Grid Layout 2** - Draggable and resizable grid
- **Mock Data** - Realistic SOC data for demonstration

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd soc-dashboard

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## 🎨 Project Structure

```
soc-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AlertStatusCard.js
│   │   ├── AlertsTrendCard.js      # ✨ Enhanced with interactivity
│   │   ├── ErrorBoundary.js
│   │   ├── FilterPanel.js          # ✨ NEW: Advanced filters
│   │   ├── GlobalSearch.js         # ✨ NEW: Global search
│   │   ├── IocDistributionCard.js
│   │   ├── LoadingSpinner.js
│   │   ├── PageHeader.js
│   │   ├── RecentActivityFeed.js
│   │   ├── RiskPulseBar.js
│   │   ├── SeverityChip.js
│   │   ├── SeveritySnapshotRow.js
│   │   ├── StatCard.js
│   │   ├── TopAssetsCard.js
│   │   └── TopThreatActorsCard.js
│   ├── context/             # React context providers
│   │   └── AuthContext.js
│   ├── data/                # Mock data and utilities
│   │   └── mockSocData.js
│   ├── layout/              # Layout components
│   │   └── SOCLayout.js
│   ├── pages/               # Page components
│   │   ├── DashboardsPage.js
│   │   ├── DraggableDashboard.js   # ✨ NEW: Customizable dashboard
│   │   ├── IOCFeedPage.js
│   │   ├── LoginPage.js            # ✨ Enhanced with toasts
│   │   ├── OverviewPage.js         # ✨ Enhanced with filters
│   │   ├── SearchPage.js
│   │   └── ThreatActorsPage.js
│   ├── utils/               # Utility functions
│   │   └── toast.js                # ✨ NEW: Toast utilities
│   ├── theme.js             # MUI theme configuration
│   ├── index.css            # Global styles
│   ├── App.js               # Main application component
│   └── index.js             # Application entry point
├── public/
└── package.json
```

## 🎯 Key Components

### StatCard
Displays KPI metrics with trend indicators and dynamic severity-based coloring.

### SeveritySnapshotRow
Color-coded cards showing alert distribution across severity levels (Critical, High, Medium, Low).

### AlertsTrendCard ✨ Enhanced
Hero section with gradient area chart showing 7-day alert volume trends. Now includes:
- Interactive click handlers
- Custom tooltips with glassmorphism
- Hover effects and animations
- Callback support for filtering

### IocDistributionCard
Donut chart with centered total count and legend showing IOC type distribution.

### TopAssetsCard
Horizontal bar chart displaying assets with the highest alert volume.

### TopThreatActorsCard
List of active threat groups with risk badges and sophistication levels.

### RecentActivityFeed
Scrollable feed of recent alerts with severity chips and relative timestamps.

### GlobalSearch ✨ New
Global search component with keyboard shortcut support and real-time results.

### FilterPanel ✨ New
Advanced filtering panel with multi-criteria selection and active filter tracking.

### DraggableDashboard ✨ New
Fully customizable dashboard with drag-and-drop widgets and layout persistence.

## 🎨 Customization

### Theme
Edit `src/theme.js` to customize colors, typography, and component styles.

### Mock Data
Update `src/data/mockSocData.js` to modify sample alerts, IOCs, and threat actors.

### Layout
Adjust grid columns and spacing in `src/pages/OverviewPage.js` for different layouts.

### Dashboard Widgets
Modify `src/pages/DraggableDashboard.js` to add or remove widgets from the customizable dashboard.

## 📊 Data Integration

Currently using mock data. To integrate with real SOC data:

1. Replace mock data imports with API calls
2. Implement data fetching hooks (e.g., `useAlerts`, `useIOCs`)
3. Add WebSocket connections for real-time updates
4. Implement authentication and authorization with backend
5. Connect filter panel to backend filtering
6. Integrate search with backend search API

## 🚀 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode.

**Features:**
- **Unit Tests**: Comprehensive coverage for components and utilities
- **Integration Tests**: Verifies user flows (Login, Dashboard customization)
- **Performance Tests**: Benchmarks render times and memory usage
- **Accessibility Tests**: Ensures ARIA compliance and screen reader support

To run specific test suites:
```bash
# Run performance benchmarks
npm test performance

# Run dashboard tests
npm test DraggableDashboard
```

### `npx eslint src`
Runs the linter to ensure code quality and adherence to best practices. Include `--fix` to automatically correct fixable issues.

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: This is a one-way operation!** Ejects from Create React App for full configuration control.

## 🎮 Usage Guide

### Login
1. Navigate to http://localhost:3000
2. You'll see the login page (any credentials work for demo)
3. Toast notifications will appear for login feedback

### Global Search
1. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) anywhere in the app
2. Type to search across alerts, IOCs, and threat actors
3. Press `Esc` to close

### Interactive Charts
1. Go to Overview page
2. Hover over chart data points to see custom tooltips
3. Click on data points to trigger filtering actions

### Advanced Filters
1. On the Overview page, click the "Filters" button (top-right)
2. Select severity levels (Critical, High, Medium, Low)
3. Select status types (Open, In Progress, Resolved, False Positive)
4. Click "Apply Filters" to filter the data
5. Click "Reset" to clear all filters

### Draggable Dashboard
1. Click "Custom Dashboard" in the sidebar
2. Click the lock icon to enable edit mode
3. Drag widgets to reposition them
4. Resize widgets from the bottom-right corner
5. Click "Save Layout" to persist your changes
6. Click "Reset" to restore default layout
7. Click the lock icon again to exit edit mode

## 🐛 Troubleshooting

### Blank Screen
- Navigate directly to: http://localhost:3000/login
- Check browser console for errors (F12)
- Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`

### Charts Not Displaying
Ensure Recharts is properly installed:
```bash
npm install recharts
```

### Layout Issues
Clear browser cache and ensure you're using the latest version:
```bash
npm install
npm start
```

### Keyboard Shortcuts Not Working
- Ensure the page has focus (click on the page first)
- Try both `Ctrl+K` and `Cmd+K`
- Check if another app is using the shortcut

### Draggable Dashboard Not Saving
- Check browser localStorage is enabled
- Open DevTools → Application → Local Storage
- Look for `dashboard-layouts` key

## 📝 Dependencies

### Core
- `react`: ^19.2.4
- `react-dom`: ^19.2.4
- `react-router-dom`: ^6.30.3

### UI Framework
- `@mui/material`: ^7.3.7
- `@mui/icons-material`: ^7.3.7
- `@emotion/react`: ^11.14.0
- `@emotion/styled`: ^11.14.1

### Data Visualization
- `recharts`: ^3.7.0

### Advanced Features
- `react-hot-toast`: ^2.6.0 - Toast notifications
- `react-grid-layout`: ^2.2.2 - Draggable dashboard

### Testing
- `@testing-library/react`: ^16.3.2
- `@testing-library/jest-dom`: ^6.9.1
- `@testing-library/user-event`: ^13.5.0

## 🎨 Color Palette

- **Primary (Indigo)**: `#6366F1`
- **Secondary (Cyan)**: `#22D3EE`
- **Background Dark**: `#0B1120`
- **Surface Dark**: `#1E293B`
- **Critical**: `#EF4444`
- **High**: `#F59E0B`
- **Medium**: `#EAB308`
- **Low**: `#10B981`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for Security Operations Centers**

**Version 2.0** - Now with advanced interactive features!
