import * as React from 'react';
import {
  Box,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PageHeader from '../components/PageHeader';
import SeverityChip from '../components/SeverityChip';
import { alerts, iocs, threatActors, formatUtc, matchesText } from '../data/mockSocData';

export default function SearchPage() {
  const [query, setQuery] = React.useState('');

  const results = React.useMemo(() => {
    if (!query.trim()) return { alerts: [], iocs: [], threatActors: [] };

    return {
      alerts: alerts.filter((a) =>
        matchesText([a.title, a.entity, a.severity].join(' '), query)
      ),
      iocs: iocs.filter((i) =>
        matchesText([i.type, i.value, i.source, ...(i.tags || [])].join(' '), query)
      ),
      threatActors: threatActors.filter((t) =>
        matchesText([t.name, t.region, t.motive, ...(t.knownFor || [])].join(' '), query)
      ),
    };
  }, [query]);

  return (
    <Box>
      <PageHeader
        title="Search"
        subtitle="Live filtering across multiple entity types (mock data)."
      />

      <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
        <TextField
          fullWidth
          label="Search"
          placeholder="Try: phishing, critical, IP, spider, vpn..."
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {query.trim()
            ? `Results: ${results.alerts.length} alerts, ${results.iocs.length} IOCs, ${results.threatActors.length} threat actors`
            : 'Tip: start typing to see results.'}
        </Typography>
      </Paper>

      {query.trim() ? (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 900 }}>Alerts</Typography>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {results.alerts.length === 0 ? (
                <Typography color="text.secondary">No matching alerts.</Typography>
              ) : (
                results.alerts.map((a) => (
                  <Paper key={a.id} variant="outlined" sx={{ p: 1.25, bgcolor: 'background.default' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
                      <Box>
                        <Typography sx={{ fontWeight: 800 }}>{a.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {a.entity} • {formatUtc(a.time)}
                        </Typography>
                      </Box>
                      <SeverityChip severity={a.severity} />
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 900 }}>IOCs</Typography>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {results.iocs.length === 0 ? (
                <Typography color="text.secondary">No matching IOCs.</Typography>
              ) : (
                results.iocs.map((ioc) => (
                  <Paper key={ioc.id} variant="outlined" sx={{ p: 1.25, bgcolor: 'background.default' }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Chip size="small" label={ioc.type} variant="outlined" sx={{ fontWeight: 800 }} />
                      <SeverityChip severity={ioc.severity} />
                      <Typography sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                        {ioc.value}
                      </Typography>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 900 }}>Threat actors</Typography>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              {results.threatActors.length === 0 ? (
                <Typography color="text.secondary">No matching threat actors.</Typography>
              ) : (
                results.threatActors.map((t) => (
                  <Paper key={t.id} variant="outlined" sx={{ p: 1.25, bgcolor: 'background.default' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
                      <Box>
                        <Typography sx={{ fontWeight: 900 }}>{t.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t.region} • {t.motive} • last activity {formatUtc(t.lastActivity)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
                        {(t.knownFor || []).map((k) => (
                          <Chip key={k} size="small" label={k} sx={{ fontWeight: 700 }} />
                        ))}
                      </Stack>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </Paper>
        </Stack>
      ) : null}
    </Box>
  );
}

