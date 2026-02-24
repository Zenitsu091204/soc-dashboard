import React from 'react';
import { CircularProgress, Box } from '@mui/material';

// Loading fallback component used by React.lazy (in App.js)
export const LoadingComponent = () => (
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

// Memoize with bounded LRU cache (max 100 entries) to prevent memory leaks
export const memoize = (fn, maxSize = 100) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    if (cache.size >= maxSize) {
      // Evict the oldest entry
      cache.delete(cache.keys().next().value);
    }
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

// Log performance metrics using modern PerformanceNavigationTiming API
export const logPerformanceMetrics = () => {
  const [navEntry] = performance.getEntriesByType('navigation');
  if (navEntry) {
    const metrics = {
      'DNS Lookup': navEntry.domainLookupEnd - navEntry.domainLookupStart,
      'TCP Connection': navEntry.connectEnd - navEntry.connectStart,
      'Request Time': navEntry.responseStart - navEntry.requestStart,
      'Response Time': navEntry.responseEnd - navEntry.responseStart,
      'DOM Processing': navEntry.domComplete - navEntry.domInteractive,
      'Total Load Time': navEntry.loadEventEnd - navEntry.startTime,
    };
    console.table(metrics);
    return metrics;
  }
};
