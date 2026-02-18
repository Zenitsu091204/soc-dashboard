import toast from 'react-hot-toast';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Custom toast notification utilities
 * Styled to match SOC Dashboard theme
 */

const ToastIcon = ({ type }) => {
  const icons = {
    success: <CheckCircleIcon sx={{ color: '#10B981' }} />,
    error: <ErrorIcon sx={{ color: '#EF4444' }} />,
    warning: <WarningIcon sx={{ color: '#F59E0B' }} />,
    info: <InfoIcon sx={{ color: '#6366F1' }} />,
  };
  return icons[type] || icons.info;
};

const CustomToast = ({ message, description, type = 'info' }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
      p: 2,
      minWidth: 300,
      maxWidth: 400,
      backgroundColor: 'rgba(21, 30, 50, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 2,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    }}
  >
    <ToastIcon type={type} />
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
        {message}
      </Typography>
      {description && (
        <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.5, display: 'block' }}>
          {description}
        </Typography>
      )}
    </Box>
  </Box>
);

// Toast notification functions
export const showToast = {
  success: (message, description) => {
    toast.custom((t) => (
      <CustomToast message={message} description={description} type="success" />
    ), {
      duration: 3000,
      position: 'top-right',
    });
  },

  error: (message, description) => {
    toast.custom((t) => (
      <CustomToast message={message} description={description} type="error" />
    ), {
      duration: 4000,
      position: 'top-right',
    });
  },

  warning: (message, description) => {
    toast.custom((t) => (
      <CustomToast message={message} description={description} type="warning" />
    ), {
      duration: 3500,
      position: 'top-right',
    });
  },

  info: (message, description) => {
    toast.custom((t) => (
      <CustomToast message={message} description={description} type="info" />
    ), {
      duration: 3000,
      position: 'top-right',
    });
  },

  // Quick toast without description
  quick: (message, type = 'info') => {
    toast(message, {
      icon: <ToastIcon type={type} />,
      style: {
        background: 'rgba(21, 30, 50, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#F1F5F9',
        borderRadius: '8px',
      },
      duration: 2000,
      position: 'top-right',
    });
  },

  // Promise toast for async operations
  promise: (promise, messages) => {
    toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Error occurred',
      },
      {
        style: {
          background: 'rgba(21, 30, 50, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#F1F5F9',
          borderRadius: '8px',
        },
        position: 'top-right',
      }
    );
  },
};

export default showToast;
