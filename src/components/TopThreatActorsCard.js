import * as React from 'react';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { threatActors } from '../data/mockSocData';

export default function TopThreatActorsCard() {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: 320 }}>
      <Typography sx={{ fontWeight: 900 }}>Top threat actors</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Mock list of actor profiles ranked by activity.
      </Typography>

      <Box sx={{ mt: 2 }}>
        {threatActors.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No actor intelligence loaded yet. Connect your TI platform to see
            profiles here.
          </Typography>
        ) : (
          threatActors.map((actor, index) => (
            <Box
              key={actor.id}
              sx={{
                mb: 1.5,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '999px',
                  bgcolor:
                    actor.sophistication === 'High'
                      ? 'error.main'
                      : actor.sophistication === 'Medium'
                      ? 'warning.main'
                      : 'success.main',
                  mr: 1.5,
                  mt: 0.7,
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                  {index + 1}. {actor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {actor.region} • {actor.motive}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={actor.sophistication}
                sx={{ ml: 1, textTransform: 'uppercase', fontSize: 10 }}
                color={
                  actor.sophistication === 'High'
                    ? 'error'
                    : actor.sophistication === 'Medium'
                    ? 'warning'
                    : 'success'
                }
              />
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}

