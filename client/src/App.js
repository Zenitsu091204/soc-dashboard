import * as React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded components for performance (Code Splitting)
const SOCLayout = React.lazy(() => import('./layout/SOCLayout.js'));
const OverviewPage = React.lazy(() => import('./pages/OverviewPage.js'));
const IOCFeedPage = React.lazy(() => import('./pages/IOCFeedPage.js'));
const SearchPage = React.lazy(() => import('./pages/SearchPage.js'));
const ThreatActorsPage = React.lazy(() => import('./pages/ThreatActorsPage.js'));
const IntelReportPage = React.lazy(() => import('./pages/IntelReportPage.js'));
const CampaignTimelinePage = React.lazy(() => import('./pages/CampaignTimelinePage.js'));
const LoginPage = React.lazy(() => import('./pages/LoginPage.js'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage.js'));

// Loading component
function LoadingScreen() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CircularProgress sx={{ color: theme.palette.primary.main }} size={60} />
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
        <React.Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route
              element={
                <ProtectedRoute>
                  <SOCLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<OverviewPage />} />
              <Route path="/ioc-feed" element={<IOCFeedPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/threat-actors" element={<ThreatActorsPage />} />
              <Route path="/intel-reports" element={<IntelReportPage />} />
              <Route path="/campaign-timeline" element={<CampaignTimelinePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </React.Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
