import React from 'react';
import Loadable from 'react-loadable';
import { CircularProgress, Box } from '@mui/material';

// Loading component for code splitting
const LoadingComponent = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress size={60} thickness={4} sx={{ color: '#6366F1' }} />
  </Box>
);

// Lazy load dashboard pages for better performance
export const DraggableDashboardLazy = Loadable({
  loader: () => import('../pages/DraggableDashboard'),
  loading: LoadingComponent,
});

export const OverviewPageLazy = Loadable({
  loader: () => import('../pages/OverviewPage'),
  loading: LoadingComponent,
});

export const DashboardsPageLazy = Loadable({
  loader: () => import('../pages/DashboardsPage'),
  loading: LoadingComponent,
});

// Lazy load heavy chart components
export const AlertsTrendCardLazy = Loadable({
  loader: () => import('../components/AlertsTrendCard'),
  loading: () => <div>Loading chart...</div>,
});

export const IocDistributionCardLazy = Loadable({
  loader: () => import('../components/IocDistributionCard'),
  loading: () => <div>Loading chart...</div>,
});

/**
 * Performance optimization utilities
 */

// Debounce function for expensive operations
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll/resize handlers
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization helper for expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
  return result;
};

// Report Web Vitals
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Log performance metrics
export const logPerformanceMetrics = () => {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const metrics = {
      'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
      'TCP Connection': timing.connectEnd - timing.connectStart,
      'Request Time': timing.responseStart - timing.requestStart,
      'Response Time': timing.responseEnd - timing.responseStart,
      'DOM Processing': timing.domComplete - timing.domLoading,
      'Total Load Time': timing.loadEventEnd - timing.navigationStart,
    };

    console.table(metrics);
    return metrics;
  }
};
