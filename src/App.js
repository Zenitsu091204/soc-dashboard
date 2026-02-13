import * as React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import SOCLayout from './layout/SOCLayout.js';
import OverviewPage from './pages/OverviewPage.js';
import DashboardsPage from './pages/DashboardsPage.js';
import DraggableDashboard from './pages/DraggableDashboard.js';
import IOCFeedPage from './pages/IOCFeedPage.js';
import SearchPage from './pages/SearchPage.js';
import ThreatActorsPage from './pages/ThreatActorsPage.js';
import LoginPage from './pages/LoginPage.js';

// Loading component
function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0B1120',
      }}
    >
      <CircularProgress sx={{ color: '#6366F1' }} size={60} />
    </Box>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Login Route wrapper (redirect if already authenticated)
function LoginRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
}

function App() {
  return (
    <ErrorBoundary>
      <Toaster />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            element={
              <ProtectedRoute>
                <SOCLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboards" element={<DashboardsPage />} />
            <Route path="/custom-dashboard" element={<DraggableDashboard />} />
            <Route path="/" element={<OverviewPage />} />
            <Route path="/ioc-feed" element={<IOCFeedPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/threat-actors" element={<ThreatActorsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
