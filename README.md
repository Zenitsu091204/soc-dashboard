# SOC Dashboard

A professional, enterprise-grade Security Operations Center (SOC) dashboard built with React and Material-UI. This dashboard provides real-time monitoring, threat intelligence visualization, and alert management capabilities.

![SOC Dashboard](https://img.shields.io/badge/React-18.x-blue) ![Material-UI](https://img.shields.io/badge/MUI-5.x-blue) ![Recharts](https://img.shields.io/badge/Recharts-2.x-green)

## 🚀 Features

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
- **IOC Workbench**: Indicator of Compromise analysis tools
- **Threat Actors**: Detailed threat actor profiles
- **Search**: Advanced search and filtering capabilities

### Design Highlights
- **Data-Dense Layout**: Professional SOC-style information hierarchy
- **Dark Theme**: High-contrast design optimized for 24/7 monitoring
- **Glassmorphism Effects**: Modern UI with backdrop blur and subtle gradients
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Enterprise-Grade Styling**: Consistent 24px padding, clean typography, professional tooltips

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Material-UI (MUI) 5** - Component library and theming
- **Recharts** - Data visualization library
- **React Router DOM** - Client-side routing
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
│   │   ├── AlertsTrendCard.js
│   │   ├── IocDistributionCard.js
│   │   ├── RecentActivityFeed.js
│   │   ├── SeveritySnapshotRow.js
│   │   ├── StatCard.js
│   │   ├── TopAssetsCard.js
│   │   └── TopThreatActorsCard.js
│   ├── data/                # Mock data and utilities
│   │   └── mockSocData.js
│   ├── layout/              # Layout components
│   │   └── SOCLayout.js
│   ├── pages/               # Page components
│   │   ├── OverviewPage.js
│   │   ├── DashboardsPage.js
│   │   ├── IOCFeedPage.js
│   │   ├── SearchPage.js
│   │   └── ThreatActorsPage.js
│   ├── theme.js             # MUI theme configuration
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

### AlertsTrendCard
Hero section with gradient area chart showing 7-day alert volume trends.

### IocDistributionCard
Donut chart with centered total count and legend showing IOC type distribution.

### TopAssetsCard
Horizontal bar chart displaying assets with the highest alert volume.

### TopThreatActorsCard
List of active threat groups with risk badges and sophistication levels.

### RecentActivityFeed
Scrollable feed of recent alerts with severity chips and relative timestamps.

## 🎨 Customization

### Theme
Edit `src/theme.js` to customize colors, typography, and component styles.

### Mock Data
Update `src/data/mockSocData.js` to modify sample alerts, IOCs, and threat actors.

### Layout
Adjust grid columns and spacing in `src/pages/OverviewPage.js` for different layouts.

## 📊 Data Integration

Currently using mock data. To integrate with real SOC data:

1. Replace mock data imports with API calls
2. Implement data fetching hooks (e.g., `useAlerts`, `useIOCs`)
3. Add WebSocket connections for real-time updates
4. Implement authentication and authorization

## 🚀 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: This is a one-way operation!** Ejects from Create React App for full configuration control.

## 🐛 Troubleshooting

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

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for Security Operations Centers**
