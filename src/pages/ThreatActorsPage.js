import * as React from 'react';
import { Box, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import { threatActors as allThreatActors, formatUtc, matchesText } from '../data/mockSocData';

export default function ThreatActorsPage() {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    return allThreatActors
      .filter((t) =>
        matchesText([t.name, t.region, t.motive, t.sophistication, ...(t.knownFor || [])].join(' '), query)
      )
      .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
  }, [query]);

  return (
    <Box>
      <PageHeader
        title="Threat Actors"
        subtitle="A searchable list of actor profiles (mock data)."
        right={
          <TextField
            label="Filter"
            placeholder="Name, region, motive..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 340 } }}
          />
        }
      />

      <Stack spacing={1.25} sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing <b>{filtered.length}</b> actors
        </Typography>

        {filtered.map((t) => (
          <Paper key={t.id} variant="outlined" sx={{ p: 1.5 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ md: 'center' }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900, letterSpacing: 0.3 }}>
                  {t.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t.region} • {t.motive} • sophistication: {t.sophistication}
                </Typography>
                <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: 'wrap' }}>
                  {(t.knownFor || []).map((k) => (
                    <Chip key={k} size="small" label={k} sx={{ fontWeight: 700 }} />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ textAlign: { md: 'right' }, whiteSpace: 'nowrap' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Last activity
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 900 }}>
                  {formatUtc(t.lastActivity)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

