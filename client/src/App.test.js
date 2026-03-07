import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
import App from './App';

test('renders SOC Dashboard header', async () => {
  render(
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    </AuthProvider>
  );
  const titleElement = await screen.findByText(/SOC Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});
