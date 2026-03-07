import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

describe('StatCard', () => {
  it('renders title, value, and helper text correctly', () => {
    render(
      <StatCard 
        title="Total Alerts" 
        value="1,200" 
        icon={ExclamationCircleIcon} 
        color="error" 
        helper="+15% from last week" 
      />
    );

    expect(screen.getByText('Total Alerts')).toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('+15% from last week')).toBeInTheDocument();
  });
});
