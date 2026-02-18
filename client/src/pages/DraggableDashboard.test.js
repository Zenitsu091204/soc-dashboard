import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DraggableDashboard from './DraggableDashboard';

// Mock the toast utility
jest.mock('../utils/toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock Recharts ResponsiveContainer to avoid size issues in tests
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: 800, height: 800 }}>{children}</div>
    ),
  };
});

// Mock localStorage
const localStorageMock = (() => {
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
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Wrapper component for routing
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DraggableDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    test('should show loading spinner initially', () => {
      renderWithRouter(<DraggableDashboard />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('should render dashboard after loading', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      expect(await screen.findByText('Customizable Dashboard')).toBeInTheDocument();
    });

    test('should render all stat cards', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      expect(await screen.findByText('Total Alerts')).toBeInTheDocument();
      expect(await screen.findByText('Total Alerts')).toBeInTheDocument();
      const criticalElements = screen.getAllByText('Critical');
      expect(criticalElements.length).toBeGreaterThan(0);
      expect(screen.getAllByText('High Priority')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Risk Score')[0]).toBeInTheDocument();
    });

    test('should start in locked mode', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      expect(await screen.findByText('Unlock to Edit')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    test('should toggle edit mode when unlock button is clicked', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      const unlockButton = await screen.findByText('Unlock to Edit');
      expect(unlockButton).toBeInTheDocument();

      fireEvent.click(unlockButton);

      expect(await screen.findByText('Enterprise Edit Mode')).toBeInTheDocument();
      expect(screen.getByText('Save & Lock')).toBeInTheDocument();
    });

    test('should show edit mode instructions when unlocked', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      const unlockButton = await screen.findByText('Unlock to Edit');
      fireEvent.click(unlockButton);

      expect(await screen.findByText(/Drag using the handle/i)).toBeInTheDocument();
    });

    test('should show reset button in edit mode', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      const unlockButton = await screen.findByText('Unlock to Edit');
      fireEvent.click(unlockButton);

      expect(await screen.findByText('Reset Default')).toBeInTheDocument();
    });
  });

  describe('Keyboard Shortcuts', () => {
    test('should toggle edit mode with Ctrl+E', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await screen.findByText('Unlock to Edit');

      // Press Ctrl+E
      fireEvent.keyDown(window, { key: 'e', ctrlKey: true });

      expect(await screen.findByText('Enterprise Edit Mode')).toBeInTheDocument();
    });

    test('should exit edit mode with Escape key', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      const unlockButton = await screen.findByText('Unlock to Edit');
      fireEvent.click(unlockButton);

      await screen.findByText('Enterprise Edit Mode');

      // Press Escape
      fireEvent.keyDown(window, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByText('Enterprise Edit Mode')).not.toBeInTheDocument();
      });
    });

    test('should prevent default behavior for Ctrl+E', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await screen.findByText('Unlock to Edit');

      const event = new KeyboardEvent('keydown', { key: 'e', ctrlKey: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      
      fireEvent(window, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Layout Persistence', () => {
    test('should save layout to localStorage when Save & Lock is clicked', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      const unlockButton = await screen.findByText('Unlock to Edit');
      fireEvent.click(unlockButton);

      const saveButton = await screen.findByText('Save & Lock');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(localStorage.getItem('dashboard-layout-curr_user_123')).toBeTruthy();
      });
    });

    test('should load saved layout on mount', async () => {
      const mockLayout = {
        lg: [
          { i: 'stat1', x: 0, y: 0, w: 6, h: 2 },
        ],
      };
      
      localStorage.setItem('dashboard-layout-curr_user_123', JSON.stringify(mockLayout));

      renderWithRouter(<DraggableDashboard />);
      
      expect(await screen.findByText('Customizable Dashboard')).toBeInTheDocument();
    });

    test('should reset layout when Reset button is clicked', async () => {
      localStorage.setItem('dashboard-layout-curr_user_123', JSON.stringify({ lg: [] }));

      renderWithRouter(<DraggableDashboard />);
      
      const unlockButton = await screen.findByText('Unlock to Edit');
      fireEvent.click(unlockButton);

      const resetButton = await screen.findByText('Reset Default');
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(localStorage.getItem('dashboard-layout-curr_user_123')).toBeNull();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels on buttons', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      const unlockButton = await screen.findByLabelText(/Unlock dashboard for editing/i);
      expect(unlockButton).toBeInTheDocument();
    });

    test('should have main landmark role', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      const main = await screen.findByRole('main');
      expect(main).toHaveAttribute('aria-label', 'Customizable Dashboard');
    });

    test('should announce state changes to screen readers', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      const unlockButton = await screen.findByText('Unlock to Edit');
      fireEvent.click(unlockButton);

      const liveRegion = await screen.findByRole('status');
      expect(liveRegion).toHaveTextContent(/Edit mode enabled/i);
    });


  });

  describe('Loading States', () => {
    test('should show saving state when saving layout', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      const unlockButton = await screen.findByText('Unlock to Edit');
      fireEvent.click(unlockButton);

      const saveButton = await screen.findByText('Save & Lock');
      fireEvent.click(saveButton);

      // Should show "Saving..." briefly
      expect(await screen.findByText('Saving...')).toBeInTheDocument();
    });

    test('should disable buttons while saving', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      const unlockButton = await screen.findByText('Unlock to Edit');
      fireEvent.click(unlockButton);

      const saveButton = await screen.findByText('Save & Lock');
      fireEvent.click(saveButton);

      const resetButton = await screen.findByText('Reset Default');
      expect(resetButton).toBeDisabled();
    });
  });
});
