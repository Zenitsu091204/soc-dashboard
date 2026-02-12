import * as React from 'react';
import {
  Box,
  Chip,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PageHeader from '../components/PageHeader';
import SeverityChip from '../components/SeverityChip';
import { iocs as allIocs, formatUtc, matchesText } from '../data/mockSocData';

export default function IOCFeedPage() {
  const [query, setQuery] = React.useState('');
  const [type, setType] = React.useState('all');
  const [minConfidence, setMinConfidence] = React.useState(0);
  const [severity, setSeverity] = React.useState('all');

  const filtered = React.useMemo(() => {
    return allIocs
      .filter((ioc) => (type === 'all' ? true : ioc.type === type))
      .filter((ioc) => (severity === 'all' ? true : ioc.severity === severity))
      .filter((ioc) => ioc.confidence >= minConfidence)
      .filter((ioc) => {
        const haystack = [
          ioc.type,
          ioc.value,
          ioc.source,
          ...(ioc.tags || []),
        ].join(' ');
        return matchesText(haystack, query);
      })
      .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));
  }, [query, type, minConfidence, severity]);

  return (
    <Box>
      <PageHeader
        title="IOC Feed"
        subtitle="Filter and review indicators (mock data)."
      />

      <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          alignItems={{ md: 'center' }}
        >
          <TextField
            label="Search"
            placeholder="IP, domain, hash, tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="IP">IP</MenuItem>
            <MenuItem value="Domain">Domain</MenuItem>
            <MenuItem value="URL">URL</MenuItem>
            <MenuItem value="SHA256">SHA256</MenuItem>
          </TextField>
          <TextField
            select
            label="Severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </TextField>
          <TextField
            select
            label="Min confidence"
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value={0}>0%</MenuItem>
            <MenuItem value={50}>50%</MenuItem>
            <MenuItem value={70}>70%</MenuItem>
            <MenuItem value={85}>85%</MenuItem>
            <MenuItem value={90}>90%</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      <Stack spacing={1.25} sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing <b>{filtered.length}</b> indicators
        </Typography>

        {filtered.map((ioc) => (
          <Paper key={ioc.id} variant="outlined" sx={{ p: 1.5 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1}
              alignItems={{ md: 'center' }}
              justifyContent="space-between"
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ fontWeight: 900 }}>{ioc.type}</Typography>
                  <SeverityChip severity={ioc.severity} />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${ioc.confidence}% confidence`}
                    sx={{ fontWeight: 700 }}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={ioc.source}
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>
                <Typography
                  sx={{
                    mt: 0.5,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    wordBreak: 'break-all',
                  }}
                >
                  {ioc.value}
                </Typography>
                <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: 'wrap' }}>
                  {(ioc.tags || []).map((t) => (
                    <Chip key={t} size="small" label={t} sx={{ fontWeight: 700 }} />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ textAlign: { md: 'right' }, whiteSpace: 'nowrap' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  First seen
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {formatUtc(ioc.firstSeen)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Last seen
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {formatUtc(ioc.lastSeen)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

