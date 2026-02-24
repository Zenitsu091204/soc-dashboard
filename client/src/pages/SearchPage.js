import React, { useState, useEffect, useMemo } from 'react';
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
import api from '../services/api';
import { formatUtc } from '../utils/format';

// Helper for text matching
const matchesText = (text, query) => {
  return String(text || '').toLowerCase().includes(query.toLowerCase());
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState({ alerts: [], iocs: [], threatActors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, iocsRes, actorsRes] = await Promise.all([
          api.get('/alerts'),
          api.get('/intel/iocs'),
          api.get('/intel/threat-actors')
        ]);
        setData({
          alerts: alertsRes.data,
          iocs: iocsRes.data,
          threatActors: actorsRes.data
        });
      } catch (err) {
        console.error('Failed to fetch search data', err);
        setError('Failed to load search index. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return { alerts: [], iocs: [], threatActors: [] };

    return {
      alerts: data.alerts.filter((a) =>
        matchesText([a.title, a.entity, a.severity].join(' '), query)
      ),
      iocs: data.iocs.filter((i) =>
        matchesText([i.type, i.value, i.source, ...(i.tags || [])].join(' '), query)
      ),
      threatActors: data.threatActors.filter((t) =>
        matchesText([t.name, t.region, t.motive, ...(t.knownFor || [])].join(' '), query)
      ),
    };
  }, [query, data]);

  if (loading) return <div className="p-6 text-slate-500">Loading search index...</div>;

  if (error) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
      <Typography color="error">⚠ {error}</Typography>
      <button
        onClick={() => { setError(null); setLoading(true); }}
        style={{ padding: '8px 16px', background: '#6366F1', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}
      >Retry</button>
    </Box>
  );

  return (
    <Box>
      <PageHeader
        title="Search"
        subtitle="Live filtering across multiple entity types."
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
                          {a.entity} • {formatUtc(a.timestamp || a.time)}
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
                          {t.origin || 'Unknown'} • {t.type || 'Unknown'} • last activity {formatUtc(t.lastSeen || t.updatedAt)}
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
