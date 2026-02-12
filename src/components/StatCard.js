import * as React from 'react';
import { Paper, Stack, Typography } from '@mui/material';

export default function StatCard({ label, value, helper }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.9)',
          borderColor: 'primary.main',
        },
      }}
    >
      <Stack spacing={0.25}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {value}
        </Typography>
        {helper ? (
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}

