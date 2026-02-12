import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SOCLayout from './layout/SOCLayout.js';
import OverviewPage from './pages/OverviewPage.js';
import DashboardsPage from './pages/DashboardsPage.js';
import IOCFeedPage from './pages/IOCFeedPage.js';
import SearchPage from './pages/SearchPage.js';
import ThreatActorsPage from './pages/ThreatActorsPage.js';

function App() {
  return (
    <Routes>
      <Route element={<SOCLayout />}>
        <Route path="/dashboards" element={<DashboardsPage />} />
        <Route path="/" element={<OverviewPage />} />
        <Route path="/ioc-feed" element={<IOCFeedPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/threat-actors" element={<ThreatActorsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
