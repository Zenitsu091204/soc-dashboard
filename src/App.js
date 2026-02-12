import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SOCLayout from './layout/SOCLayout';
import OverviewPage from './pages/OverviewPage';
import DashboardsPage from './pages/DashboardsPage';
import IOCFeedPage from './pages/IOCFeedPage';
import SearchPage from './pages/SearchPage';
import ThreatActorsPage from './pages/ThreatActorsPage';

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
