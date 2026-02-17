import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
  describe('Rendering', () => {
    test('should render label correctly', () => {
      render(<StatCard label="Test Label" value={100} />);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    test('should render value correctly', () => {
      render(<StatCard label="Test" value={1234} />);
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    test('should render helper text', () => {
      render(<StatCard label="Test" value={100} helper="Helper text" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });
  });

  describe('Value Formatting', () => {
    test('should format large numbers with commas', () => {
      render(<StatCard label="Test" value={1000000} />);
      expect(screen.getByText('1,000,000')).toBeInTheDocument();
    });

    test('should handle zero value', () => {
      render(<StatCard label="Test" value={0} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('should handle NaN by showing 0', () => {
      render(<StatCard label="Test" value={NaN} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('should handle undefined value by showing 0', () => {
      render(<StatCard label="Test" value={undefined} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('should handle null value by showing 0', () => {
      render(<StatCard label="Test" value={null} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Trend Indicators', () => {
    test('should show positive trend with + sign', () => {
      render(<StatCard label="Test" value={100} trend={15} />);
      expect(screen.getByText('+15%')).toBeInTheDocument();
    });

    test('should show negative trend without + sign', () => {
      render(<StatCard label="Test" value={100} trend={-5} />);
      expect(screen.getByText('-5%')).toBeInTheDocument();
    });

    test('should show trend comparison text', () => {
      render(<StatCard label="Test" value={100} trend={10} />);
      expect(screen.getByText('vs last 7 days')).toBeInTheDocument();
    });

    test('should not show trend when undefined', () => {
      render(<StatCard label="Test" value={100} />);
      expect(screen.queryByText(/vs last 7 days/)).not.toBeInTheDocument();
    });
  });

  describe('Severity Colors', () => {
    test('should apply critical color for critical severity', () => {
      render(
        <StatCard label="Test" value={100} severity="critical" />
      );
      const valueElement = screen.getByText('100');
      expect(valueElement).toHaveStyle({ color: '#EF4444' });
    });

    test('should apply high color for high severity', () => {
      render(
        <StatCard label="Test" value={100} severity="high" />
      );
      const valueElement = screen.getByText('100');
      expect(valueElement).toHaveStyle({ color: '#F97316' });
    });

    test('should apply medium color for medium severity', () => {
      render(
        <StatCard label="Test" value={100} severity="medium" />
      );
      const valueElement = screen.getByText('100');
      expect(valueElement).toHaveStyle({ color: '#EAB308' });
    });

    test('should apply low color for low severity', () => {
      render(
        <StatCard label="Test" value={100} severity="low" />
      );
      const valueElement = screen.getByText('100');
      expect(valueElement).toHaveStyle({ color: '#22C55E' });
    });
  });

  describe('Accessibility', () => {
    test('should have proper semantic structure', () => {
      render(<StatCard label="Test Label" value={100} helper="Helper" />);
      
      // Label should be uppercase caption
      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
      
      // Value should be prominent
      const value = screen.getByText('100');
      expect(value).toBeInTheDocument();
      
      // Helper text should be present
      const helper = screen.getByText('Helper');
      expect(helper).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle very large numbers', () => {
      render(<StatCard label="Test" value={999999999} />);
      expect(screen.getByText('999,999,999')).toBeInTheDocument();
    });

    test('should handle decimal numbers by rounding', () => {
      render(<StatCard label="Test" value={123.456} />);
      // toLocaleString() will format decimals
      expect(screen.getByText(/123/)).toBeInTheDocument();
    });

    test('should handle negative numbers', () => {
      render(<StatCard label="Test" value={-100} />);
      expect(screen.getByText('-100')).toBeInTheDocument();
    });
  });
});
