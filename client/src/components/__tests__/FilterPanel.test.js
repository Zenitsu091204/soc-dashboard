import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import FilterPanel from '../FilterPanel';

// Mock matchMedia which FilterPanel uses for right drawer queries if needed
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
});

describe('FilterPanel', () => {
  const mockFilters = {
    severity: ['critical', 'high'],
    status: ['open']
  };
  
  const mockOnApply = jest.fn();
  const mockOnClose = jest.fn();

  it('renders filter panel correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterPanel 
            open={true} 
            onClose={mockOnClose} 
            filters={mockFilters} 
            onApplyFilters={mockOnApply} 
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    
    // Check that pre-selected filters are checked
    const criticalCheckbox = screen.getByLabelText('Critical');
    expect(criticalCheckbox).toBeChecked();
  });
  
  it('calls onApplyFilters when apply button is clicked', () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterPanel 
            open={true} 
            onClose={mockOnClose} 
            filters={mockFilters} 
            onApplyFilters={mockOnApply} 
        />
      </ThemeProvider>
    );
    
    // Click Apply filters
    const applyBtn = screen.getByRole('button', { name: /Apply Filters/i });
    fireEvent.click(applyBtn);
    
    expect(mockOnApply).toHaveBeenCalled();
  });
});
