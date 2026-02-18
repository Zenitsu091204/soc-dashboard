import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Reusable loading spinner component
 * Can be used inline in buttons or as a full-page loader
 */
const LoadingSpinner = ({ 
  size = 40, 
  fullPage = false, 
  message = 'Loading...',
  color = 'primary' 
}) => {
  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: 2,
        }}
      >
        <CircularProgress 
          size={size} 
          sx={{
            color: color === 'primary' ? '#6366F1' : undefined,
          }}
        />
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <CircularProgress 
      size={size}
      sx={{
        color: color === 'primary' ? '#6366F1' : undefined,
      }}
    />
  );
};

export default LoadingSpinner;
