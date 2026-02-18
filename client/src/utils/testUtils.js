import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create theme for testing
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
  },
});

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui,
  {
    initialEntries = ['/'],
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Mock localStorage for testing
 */
export const createMockLocalStorage = () => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get store() {
      return store;
    },
  };
};

/**
 * Setup localStorage mock
 */
export function setupLocalStorageMock() {
  const mockLocalStorage = createMockLocalStorage();
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
  return mockLocalStorage;
}

/**
 * Generate mock alert data
 */
export function generateMockAlert(overrides = {}) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: 'Test Alert',
    severity: 'high',
    status: 'open',
    timestamp: new Date().toISOString(),
    source: 'Test Source',
    category: 'malware',
    affectedAssets: ['asset-1'],
    ...overrides,
  };
}

/**
 * Generate multiple mock alerts
 */
export function generateMockAlerts(count = 10, overrides = {}) {
  return Array.from({ length: count }, (_, i) =>
    generateMockAlert({ id: `alert-${i}`, ...overrides })
  );
}

/**
 * Wait for async operations
 */
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Mock window.matchMedia for responsive tests
 */
export function setupMatchMediaMock() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

/**
 * Mock ResizeObserver for grid layout tests
 */
export function setupResizeObserverMock() {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
}

/**
 * Create mock layout for react-grid-layout
 */
export function createMockLayout(items = []) {
  const defaultItems = [
    { i: 'stat1', x: 0, y: 0, w: 3, h: 2 },
    { i: 'stat2', x: 3, y: 0, w: 3, h: 2 },
    { i: 'stat3', x: 6, y: 0, w: 3, h: 2 },
    { i: 'stat4', x: 9, y: 0, w: 3, h: 2 },
  ];

  return {
    lg: items.length > 0 ? items : defaultItems,
  };
}

/**
 * Assert that an element has accessible name
 */
export function expectAccessibleName(element, name) {
  expect(element).toHaveAttribute('aria-label', name);
}

/**
 * Assert that keyboard shortcut works
 */
export function triggerKeyboardShortcut(key, modifiers = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...modifiers,
  });
  window.dispatchEvent(event);
  return event;
}

/**
 * Common test data
 */
export const testData = {
  alerts: generateMockAlerts(50),
  criticalAlerts: generateMockAlerts(10, { severity: 'critical' }),
  highAlerts: generateMockAlerts(15, { severity: 'high' }),
  mediumAlerts: generateMockAlerts(20, { severity: 'medium' }),
  lowAlerts: generateMockAlerts(5, { severity: 'low' }),
};

/**
 * Mock toast notifications
 */
export const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
};

/**
 * Setup common test environment
 */
export function setupTestEnvironment() {
  setupLocalStorageMock();
  setupMatchMediaMock();
  setupResizeObserverMock();
  
  // Mock toast
  jest.mock('../utils/toast', () => ({
    __esModule: true,
    default: mockToast,
  }));

  return {
    localStorage: window.localStorage,
    mockToast,
  };
}

/**
 * Cleanup test environment
 */
export function cleanupTestEnvironment() {
  localStorage.clear();
  jest.clearAllMocks();
}

// Re-export testing library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
