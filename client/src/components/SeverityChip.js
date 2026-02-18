import * as React from 'react';
import { Chip } from '@mui/material';

const severityToColor = {
  critical: 'error',
  high: 'warning',
  medium: 'info',
  low: 'default',
};

export default function SeverityChip({ severity }) {
  const value = String(severity || 'low').toLowerCase();
  const color = severityToColor[value] || 'default';

  return (
    <Chip
      label={value}
      size="small"
      color={color}
      variant={color === 'default' ? 'outlined' : 'filled'}
      sx={{ textTransform: 'capitalize', fontWeight: 700 }}
    />
  );
}

