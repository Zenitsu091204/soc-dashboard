import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  GlobeAltIcon,
  ShieldExclamationIcon,
  ClockIcon,
  ServerIcon,
  TagIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const SEV_STYLES = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
  high:     'bg-orange-500/15 text-orange-400 border-orange-500/25',
  medium:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  low:      'bg-blue-500/15 text-blue-400 border-blue-500/25',
};

// Deterministic "enrichment" data from an IOC value — gives consistent demo data
function getEnrichment(ioc) {
  let h = 0;
  for (let i = 0; i < (ioc.value || '').length; i++) {
    h = (Math.imul(31, h) + ioc.value.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(h);

  const countries = ['Russia', 'China', 'North Korea', 'Iran', 'United States', 'Netherlands', 'Germany', 'Ukraine'];
  const cities    = ['Moscow', 'Beijing', 'Pyongyang', 'Tehran', 'New York', 'Amsterdam', 'Berlin', 'Kyiv'];
  const asns      = ['AS15169 Google', 'AS3356 Lumen', 'AS1299 Telia', 'AS6939 Hurricane Electric', 'AS7922 Comcast'];
  const orgs      = ['Hosting Ltd', 'CloudFlare Inc', 'Digital Ocean', 'Linode LLC', 'AWS'];
  const threats   = ['C2 Server', 'Botnet Node', 'Phishing Host', 'Malware Dropper', 'Proxy Node', 'Ransomware C2'];
  const malware   = ['Emotet', 'TrickBot', 'Cobalt Strike', 'Lokibot', 'RedLine Stealer', 'AsyncRAT'];

  const idx = abs % countries.length;
  return {
    country:    countries[idx],
    city:       cities[idx],
    asn:        asns[abs % asns.length],
    org:        orgs[abs % orgs.length],
    threat:     threats[abs % threats.length],
    malwareFamily: ioc.reputation > 60 ? malware[abs % malware.length] : null,
    reportCount: (abs % 28) + 2,
    lastReported: new Date(Date.now() - (abs % 7) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    confidence:  50 + (abs % 45),
    tags: [
      threats[abs % threats.length],
      countries[idx],
      ioc.type?.toUpperCase(),
    ].filter(Boolean),
  };
}

// ── IOC Detail Modal (Centered Popup) ─────────────────────────────────────────
function IocDetailPanel({ ioc, onClose }) {
  const sev = (ioc.severity || 'low').toLowerCase();
  const enrich = useMemo(() => getEnrichment(ioc), [ioc]);

  return (
    <div
      className="fixed top-[110px] left-0 right-0 bottom-0 z-[200] flex items-start justify-center pt-4 px-4 pb-6"
      onClick={onClose}
    >
      {/* Backdrop — only covers the content area, not the nav/threat bar */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Centered Modal */}
      <div
        className="relative w-full max-w-3xl max-h-[calc(100vh-130px)] bg-slate-950 border border-indigo-500/20 rounded-2xl shadow-[0_0_60px_rgba(99,102,241,0.2)] flex flex-col overflow-hidden"
        style={{ animation: 'modalPop 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes modalPop { from { opacity:0; transform:scale(0.92) translateY(16px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/8 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              {ioc.type?.toLowerCase() === 'ip' ? (
                <GlobeAltIcon className="w-5 h-5 text-indigo-400" />
              ) : ioc.type?.toLowerCase() === 'hash' ? (
                <TagIcon className="w-5 h-5 text-orange-400" />
              ) : (
                <ServerIcon className="w-5 h-5 text-purple-400" />
              )}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{ioc.type} Indicator</p>
              <h2 className="text-base font-bold text-white font-mono mt-0.5 break-all">{ioc.value}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition ml-2 flex-shrink-0"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body — 2-column horizontal layout */}
        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">

            {/* ── LEFT COLUMN ── */}
            <div className="space-y-4">

              {/* Severity */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Severity</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${SEV_STYLES[sev] || SEV_STYLES.low} uppercase`}>
                  {sev}
                </span>
              </div>

              {/* Reputation */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Reputation Score</p>
                <p className={`text-3xl font-black ${ioc.reputation > 70 ? 'text-red-400' : ioc.reputation > 40 ? 'text-orange-400' : 'text-emerald-400'}`}>
                  {ioc.reputation}
                  <span className="text-xs text-slate-500 font-normal"> /100</span>
                </p>
                <div className="mt-2 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ioc.reputation > 70 ? 'bg-red-500' : ioc.reputation > 40 ? 'bg-orange-400' : 'bg-emerald-400'}`}
                    style={{ width: `${ioc.reputation || 0}%` }}
                  />
                </div>
              </div>

              {/* Sighting Data */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
                  <ClockIcon className="w-3.5 h-3.5" /> Sighting Data
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">First Seen</span>
                    <span className="text-slate-300 font-mono text-xs">{formatDate(ioc.seenAt || ioc.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Reported</span>
                    <span className="text-slate-300 font-mono text-xs">{enrich.lastReported}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Report Count</span>
                    <span className="text-white font-bold">{enrich.reportCount} feeds</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {enrich.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-4">

              {/* Threat Classification */}
              <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                <p className="text-[10px] text-red-400 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
                  <ShieldExclamationIcon className="w-3.5 h-3.5" /> Threat Classification
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Threat Type</span>
                    <span className="text-white font-semibold">{enrich.threat}</span>
                  </div>
                  {enrich.malwareFamily && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Malware Family</span>
                      <span className="text-orange-400 font-semibold">{enrich.malwareFamily}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${enrich.confidence}%` }} />
                      </div>
                      <span className="text-slate-300 text-xs font-bold">{enrich.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geolocation (IPs only) */}
              {ioc.type?.toLowerCase() === 'ip' && (
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
                    <GlobeAltIcon className="w-3.5 h-3.5" /> Geolocation & Network
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Country</span>
                      <span className="text-white font-semibold">{enrich.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">City</span>
                      <span className="text-slate-300">{enrich.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ASN</span>
                      <span className="text-slate-300 font-mono text-xs">{enrich.asn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Organisation</span>
                      <span className="text-slate-300">{enrich.org}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* IOC ID */}
              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] text-slate-600 font-mono break-all">IOC ID: {ioc.id || 'N/A'}</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function IOCFeedPage() {
  const [iocs, setIocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [retryKey, setRetryKey] = useState(0);
  const [selectedIoc, setSelectedIoc] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchIocs = async () => {
      try {
        const { data } = await api.get('/intel/iocs');
        setIocs(data);
      } catch (err) {
        console.error('Failed to fetch IOCs', err);
        setError('Failed to load IOC feed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchIocs();
  }, [retryKey]);

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedIoc(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => {
    return iocs.filter((ioc) => {
      const matchesType = typeFilter === 'all' || ioc.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesQuery = ioc.value.toLowerCase().includes(query.toLowerCase()) ||
                           ioc.type.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [iocs, query, typeFilter]);

  const exportToCSV = useCallback(() => {
    if (filtered.length === 0) return;
    const headers = ['Type', 'Value', 'Severity', 'Reputation', 'First Seen'];
    const csvContent = [
      headers.join(','),
      ...filtered.map(ioc =>
        `"${ioc.type}","${ioc.value}","${ioc.severity || 'low'}","${ioc.reputation}","${formatDate(ioc.seenAt || ioc.createdAt)}"`
      ),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ioc_feed_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }, [filtered]);

  if (loading) return <div className="text-white/50 p-6">Loading IOC feed...</div>;

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="text-red-400 text-4xl">⚠</div>
      <p className="text-red-400 font-semibold">{error}</p>
      <button
        onClick={() => setRetryKey((k) => k + 1)}
        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
      >Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Detail Panel */}
      {selectedIoc && (
        <IocDetailPanel ioc={selectedIoc} onClose={() => setSelectedIoc(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">IOC Feed</h1>
          <p className="text-slate-400 mt-1">
            Indicators of Compromise — <span className="text-indigo-400 font-medium">click any row</span> to view details
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-indigo-600/20 text-indigo-400 font-medium hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export CSV
          </button>
          <div className="relative flex-1 md:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search IOCs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          <div className="relative w-32">
            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:border-indigo-500/50"
            >
              <option value="all">All Types</option>
              <option value="ip">IP</option>
              <option value="domain">Domain</option>
              <option value="hash">Hash</option>
              <option value="url">URL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-white/5">
          <div className="col-span-2">Type</div>
          <div className="col-span-4">Value</div>
          <div className="col-span-2">Severity</div>
          <div className="col-span-2">Reputation</div>
          <div className="col-span-2 text-right">First Seen</div>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No IOCs found</div>
          ) : (
            filtered.map((ioc) => {
              const sev = (ioc.severity || 'low').toLowerCase();
              const isSelected = selectedIoc?.id === ioc.id;
              return (
                <div
                  key={ioc.id}
                  onClick={() => setSelectedIoc(ioc)}
                  className={`grid grid-cols-12 gap-4 p-4 items-center cursor-pointer transition-all duration-150 group
                    ${isSelected
                      ? 'bg-indigo-500/10 border-l-2 border-indigo-500'
                      : 'hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                >
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-700/50 text-slate-300 border border-white/5">
                      {ioc.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-4 font-mono text-sm text-slate-300 truncate group-hover:text-indigo-300 transition-colors" title={ioc.value}>
                    {ioc.value}
                  </div>
                  <div className="col-span-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${SEV_STYLES[sev] || SEV_STYLES.low} uppercase`}>
                      {sev}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${ioc.reputation > 70 ? 'bg-red-500' : (ioc.reputation > 40 ? 'bg-orange-500' : 'bg-green-500')}`}
                        style={{ width: `${ioc.reputation || 0}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${ioc.reputation > 70 ? 'text-red-400' : 'text-slate-400'}`}>
                      {ioc.reputation}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1 text-sm text-slate-400">
                    {formatDate(ioc.seenAt || ioc.createdAt)}
                    <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
