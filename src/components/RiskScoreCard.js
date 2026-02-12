import * as React from 'react';
import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material';

function getRiskColor(score) {
  if (score < 40) return 'success.main';
  if (score < 70) return 'warning.main';
  return 'error.main';
}

export default function RiskScoreCard({ score = 72, trend = 5 }) {
  const rounded = Math.round(score);
  const barValue = Math.min(Math.max(score, 0), 100);
  const trendLabel = `${trend > 0 ? '+' : ''}${trend}%`;
  const trendColor = trend >= 0 ? 'error.main' : 'success.main';

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.6 }}>
        OVERALL RISK SCORE
      </Typography>

      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: getRiskColor(score),
          }}
        >
          {rounded}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          / 100
        </Typography>
      </Stack>

      <Box sx={{ mt: 1 }}>
        <LinearProgress
          variant="determinate"
          value={barValue}
          sx={{
            height: 6,
            borderRadius: 999,
            backgroundColor: 'rgba(148, 163, 184, 0.3)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
              background: 'linear-gradient(90deg, #22c55e, #6366f1)',
            },
          }}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
          <Typography variant="caption" color="text.secondary">
            Trend (7 days)
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: trendColor }}>
            {trendLabel}
          </Typography>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Mock score based on alert volume and severity. Replace with your own logic later.
      </Typography>
    </Paper>
  );
}

