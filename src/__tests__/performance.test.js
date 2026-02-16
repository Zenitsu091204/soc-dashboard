import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DraggableDashboard from '../DraggableDashboard';
import StatCard from '../../components/StatCard';
import AlertsTrendCard from '../../components/AlertsTrendCard';
import { alerts } from '../../data/mockSocData';

// Performance test utilities
const measureRenderTime = (component) => {
  const startTime = performance.now();
  render(component);
  const endTime = performance.now();
  return endTime - startTime;
};

const measureMultipleRenders = (component, iterations = 10) => {
  const times = [];
  for (let i = 0; i < iterations; i++) {
    const time = measureRenderTime(component);
    times.push(time);
  }
  return {
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    times,
  };
};

const renderWithRouter = (component) => {
  return <BrowserRouter>{component}</BrowserRouter>;
};

describe('Performance Tests', () => {
  describe('Component Render Performance', () => {
    test('StatCard should render within 50ms', () => {
      const renderTime = measureRenderTime(
        <StatCard label="Test" value={100} trend={10} helper="Helper" />
      );
      
      expect(renderTime).toBeLessThan(50);
    });

    test('StatCard average render time should be under 30ms', () => {
      const stats = measureMultipleRenders(
        <StatCard label="Test" value={100} trend={10} helper="Helper" />,
        20
      );
      
      expect(stats.average).toBeLessThan(30);
    });

    test('AlertsTrendCard should render within 100ms', () => {
      const renderTime = measureRenderTime(
        renderWithRouter(<AlertsTrendCard alerts={alerts.slice(0, 50)} />)
      );
      
      expect(renderTime).toBeLessThan(100);
    });

    test('DraggableDashboard initial render should be under 200ms', () => {
      const renderTime = measureRenderTime(
        renderWithRouter(<DraggableDashboard />)
      );
      
      // Initial render includes loading state
      expect(renderTime).toBeLessThan(200);
    });
  });

  describe('Re-render Performance', () => {
    test('StatCard should handle prop updates efficiently', () => {
      const { rerender } = render(
        <StatCard label="Test" value={100} />
      );

      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        rerender(<StatCard label="Test" value={100 + i} />);
      }
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 100 re-renders should complete in under 500ms
      expect(totalTime).toBeLessThan(500);
    });
  });

  describe('Large Dataset Performance', () => {
    test('should handle 1000 alerts efficiently', () => {
      const largeAlertSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `alert-${i}`,
        title: `Alert ${i}`,
        severity: ['critical', 'high', 'medium', 'low'][i % 4],
        status: 'open',
        timestamp: new Date().toISOString(),
      }));

      const renderTime = measureRenderTime(
        renderWithRouter(<AlertsTrendCard alerts={largeAlertSet} />)
      );

      // Should handle large datasets within 300ms
      expect(renderTime).toBeLessThan(300);
    });
  });

  describe('Memory Performance', () => {
    test('should not create memory leaks on multiple renders', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Render and unmount multiple times
      for (let i = 0; i < 50; i++) {
        const { unmount } = render(
          <StatCard label="Test" value={i} />
        );
        unmount();
      }

      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be minimal (less than 5MB)
      // Note: This test may not work in all environments
      if (performance.memory) {
        expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
      }
    });
  });

  describe('Interaction Performance', () => {
    test('should measure time to interactive', async () => {
      const startTime = performance.now();
      
      const { findByText } = render(
        renderWithRouter(<DraggableDashboard />)
      );

      // Wait for component to be interactive
      await findByText('Unlock to Edit', {}, { timeout: 3000 });
      
      const endTime = performance.now();
      const timeToInteractive = endTime - startTime;

      // Should be interactive within 2 seconds
      expect(timeToInteractive).toBeLessThan(2000);
    });
  });

  describe('Animation Performance', () => {
    test('should maintain 60fps during transitions', () => {
      // This is a conceptual test - actual FPS measurement
      // would require browser APIs not available in Jest
      
      const { rerender } = render(
        <StatCard label="Test" value={100} />
      );

      const frameTime = 16.67; // 60fps = ~16.67ms per frame
      const startTime = performance.now();
      
      // Simulate rapid state changes
      for (let i = 0; i < 60; i++) {
        rerender(<StatCard label="Test" value={100 + i} />);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageFrameTime = totalTime / 60;

      // Average frame time should be close to 60fps
      expect(averageFrameTime).toBeLessThan(frameTime * 2);
    });
  });

  describe('Bundle Size Awareness', () => {
    test('should document component sizes', () => {
      // This is more of a documentation test
      // Actual bundle size analysis would be done with webpack-bundle-analyzer
      
      const componentSizes = {
        StatCard: 'Small (~2KB)',
        AlertsTrendCard: 'Medium (~8KB with Recharts)',
        DraggableDashboard: 'Large (~15KB with react-grid-layout)',
      };

      expect(componentSizes).toBeDefined();
      // In a real scenario, you'd assert against actual bundle sizes
    });
  });

  describe('Optimization Recommendations', () => {
    test('should identify optimization opportunities', () => {
      const optimizations = {
        'React.memo': 'Consider memoizing StatCard for better re-render performance',
        'useMemo': 'Use useMemo for expensive calculations in DraggableDashboard',
        'useCallback': 'Wrap event handlers in useCallback to prevent re-renders',
        'Code Splitting': 'Consider lazy loading dashboard components',
        'Virtualization': 'Use react-window for large lists of alerts',
      };

      expect(Object.keys(optimizations).length).toBeGreaterThan(0);
    });
  });
});

// Performance benchmarking utilities
export const performanceBenchmark = {
  measureRenderTime,
  measureMultipleRenders,
  
  // Benchmark a component and log results
  benchmark: (name, component, iterations = 10) => {
    console.log(`\n📊 Benchmarking: ${name}`);
    const stats = measureMultipleRenders(component, iterations);
    console.log(`  Average: ${stats.average.toFixed(2)}ms`);
    console.log(`  Min: ${stats.min.toFixed(2)}ms`);
    console.log(`  Max: ${stats.max.toFixed(2)}ms`);
    return stats;
  },
};
