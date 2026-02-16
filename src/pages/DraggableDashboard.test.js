import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DraggableDashboard from '../DraggableDashboard';

// Mock the toast utility
jest.mock('../../utils/toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

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
      
      await waitFor(() => {
        expect(screen.getByText('Customizable Dashboard')).toBeInTheDocument();
      });
    });

    test('should render all stat cards', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Alerts')).toBeInTheDocument();
        expect(screen.getByText('Critical')).toBeInTheDocument();
        expect(screen.getByText('High Priority')).toBeInTheDocument();
        expect(screen.getByText('Risk Score')).toBeInTheDocument();
      });
    });

    test('should start in locked mode', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Unlock to Edit')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Mode', () => {
    test('should toggle edit mode when unlock button is clicked', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Unlock to Edit')).toBeInTheDocument();
      });

      const unlockButton = screen.getByText('Unlock to Edit');
      fireEvent.click(unlockButton);

      await waitFor(() => {
        expect(screen.getByText('Enterprise Edit Mode')).toBeInTheDocument();
        expect(screen.getByText('Save & Lock')).toBeInTheDocument();
      });
    });

    test('should show edit mode instructions when unlocked', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const unlockButton = screen.getByText('Unlock to Edit');
        fireEvent.click(unlockButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Drag using the handle/i)).toBeInTheDocument();
      });
    });

    test('should show reset button in edit mode', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const unlockButton = screen.getByText('Unlock to Edit');
        fireEvent.click(unlockButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Reset Default')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Shortcuts', () => {
    test('should toggle edit mode with Ctrl+E', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Unlock to Edit')).toBeInTheDocument();
      });

      // Press Ctrl+E
      fireEvent.keyDown(window, { key: 'e', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByText('Enterprise Edit Mode')).toBeInTheDocument();
      });
    });

    test('should exit edit mode with Escape key', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const unlockButton = screen.getByText('Unlock to Edit');
        fireEvent.click(unlockButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Enterprise Edit Mode')).toBeInTheDocument();
      });

      // Press Escape
      fireEvent.keyDown(window, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByText('Enterprise Edit Mode')).not.toBeInTheDocument();
      });
    });

    test('should prevent default behavior for Ctrl+E', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Unlock to Edit')).toBeInTheDocument();
      });

      const event = new KeyboardEvent('keydown', { key: 'e', ctrlKey: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      
      fireEvent(window, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Layout Persistence', () => {
    test('should save layout to localStorage when Save & Lock is clicked', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const unlockButton = screen.getByText('Unlock to Edit');
        fireEvent.click(unlockButton);
      });

      await waitFor(() => {
        const saveButton = screen.getByText('Save & Lock');
        fireEvent.click(saveButton);
      });

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
      
      await waitFor(() => {
        expect(screen.getByText('Customizable Dashboard')).toBeInTheDocument();
      });
    });

    test('should reset layout when Reset button is clicked', async () => {
      localStorage.setItem('dashboard-layout-curr_user_123', JSON.stringify({ lg: [] }));

      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const unlockButton = screen.getByText('Unlock to Edit');
        fireEvent.click(unlockButton);
      });

      await waitFor(() => {
        const resetButton = screen.getByText('Reset Default');
        fireEvent.click(resetButton);
      });

      await waitFor(() => {
        expect(localStorage.getItem('dashboard-layout-curr_user_123')).toBeNull();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels on buttons', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const unlockButton = screen.getByLabelText(/Unlock dashboard for editing/i);
        expect(unlockButton).toBeInTheDocument();
      });
    });

    test('should have main landmark role', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toHaveAttribute('aria-label', 'Customizable Dashboard');
      });
    });

    test('should announce state changes to screen readers', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const unlockButton = screen.getByText('Unlock to Edit');
        fireEvent.click(unlockButton);
      });

      await waitFor(() => {
        const liveRegion = screen.getByRole('status');
        expect(liveRegion).toHaveTextContent(/Edit mode enabled/i);
      });
    });

    test('should have aria-pressed state on toggle button', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const unlockButton = screen.getByLabelText(/Unlock dashboard for editing/i);
        expect(unlockButton).toHaveAttribute('aria-pressed', 'false');
      });

      fireEvent.click(screen.getByText('Unlock to Edit'));

      await waitFor(() => {
        const unlockButton = screen.getByLabelText(/Unlock dashboard for editing/i);
        expect(unlockButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  describe('Loading States', () => {
    test('should show saving state when saving layout', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const unlockButton = screen.getByText('Unlock to Edit');
        fireEvent.click(unlockButton);
      });

      await waitFor(() => {
        const saveButton = screen.getByText('Save & Lock');
        fireEvent.click(saveButton);
      });

      // Should show "Saving..." briefly
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    test('should disable buttons while saving', async () => {
      renderWithRouter(<DraggableDashboard />);
      
      await waitFor(() => {
        const unlockButton = screen.getByText('Unlock to Edit');
        fireEvent.click(unlockButton);
      });

      await waitFor(() => {
        const saveButton = screen.getByText('Save & Lock');
        fireEvent.click(saveButton);
      });

      const resetButton = screen.getByText('Reset Default');
      expect(resetButton).toBeDisabled();
    });
  });
});
