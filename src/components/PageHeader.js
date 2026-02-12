import * as React from 'react';
import { Box, Typography } from '@mui/material';

export default function PageHeader({ title, subtitle, right }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {right ? <Box sx={{ ml: 'auto' }}>{right}</Box> : null}
    </Box>
  );
}

