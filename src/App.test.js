import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders SOC Dashboard header', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const titleElement = await screen.findByText(/SOC Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});
