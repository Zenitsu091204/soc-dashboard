import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useWebSockets } from '../hooks/useWebSockets';

// Components
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import AlertsTrendCard from '../components/AlertsTrendCard';
import RecentActivityFeed from '../components/RecentActivityFeed';
import SlaPerformanceCard from '../components/SlaPerformanceCard';
import TopAssetsCard from '../components/TopAssetsCard';
import WafRulesCard from '../components/WafRulesCard';
import ThreatIntelFeedCard from '../components/ThreatIntelFeedCard';
import OpenCtiMatchesCard from '../components/OpenCtiMatchesCard';
import FilterPanel, { FilterButton } from '../components/FilterPanel';

// Icons
import {
  ShieldExclamationIcon,
  TicketIcon,
  CpuChipIcon,
  SignalIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const REFRESH_INTERVAL = 30; // seconds

// Stable deterministic confidence score derived from actor ID (avoids Math.random in useMemo)
function deterministicConfidence(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return (Math.abs(h) % 20) + 80; // always 80–99
}

// ─── Live Refresh Bar ─────────────────────────────────────────────────────────
function LiveRefreshBar({ countdown, total, onRefresh, loading }) {
  const pct = ((total - countdown) / total) * 100;
  return (
    <div className="flex items-center gap-3 bg-slate-800/60 border border-white/5 rounded-xl px-4 py-2">
      {/* Pulsing dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Live</span>

      {/* Progress bar */}
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      <span className="text-xs text-slate-400 font-mono w-12">
        {loading ? 'syncing…' : `${countdown}s`}
      </span>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition disabled:opacity-40"
        title="Refresh now"
      >
        <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OverviewPage() {
  const [stats, setStats] = useState({ totalAlerts: 0, criticalAlerts: 0, openCases: 0, activeIocs: 0 });
  const [alerts, setAlerts] = useState([]);
  const [iocs, setIocs] = useState([]);
  const [threatActors, setThreatActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  const countdownRef = useRef(null);

  // WebSockets for Real-time Updates
  useWebSockets({
    onNewAlert: useCallback((newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
      setStats((prev) => ({
        ...prev,
        totalAlerts: prev.totalAlerts + 1,
        criticalAlerts: newAlert.severity === 'critical' ? prev.criticalAlerts + 1 : prev.criticalAlerts,
      }));
      toast(`🚨 New ${newAlert.severity.toUpperCase()} Alert: ${newAlert.title}`, {
        duration: 5000,
        style: {
          background: newAlert.severity === 'critical' ? '#EF4444' : '#F59E0B',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
      setLastUpdated(new Date());
      setCountdown(REFRESH_INTERVAL);
    }, []),
    onAlertUpdated: useCallback((updatedAlert) => {
      setAlerts((prev) => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
      toast(`ℹ️ Alert Updated: ${updatedAlert.title}`, {
        duration: 3000,
        style: { background: '#6366F1', color: '#fff', fontWeight: 'bold' }
      });
      setLastUpdated(new Date());
      setCountdown(REFRESH_INTERVAL);
    }, [])
  });

  // Pre-compute stable random confidence values once per threatActors load
  const actorMatches = React.useMemo(() =>
    threatActors.slice(0, 5).map((t) => ({
      id: t.id,
      actor: t.name,
      type: t.type,
      risk: 'Critical',
      confidence: deterministicConfidence(t.id), // stable, ID-based hash
    })),
    [threatActors]
  );

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      let alertsUrl = '/alerts';
      if (activeFilters) {
        const params = new URLSearchParams();
        if (activeFilters.dateRange?.startDate) params.append('startDate', activeFilters.dateRange.startDate);
        if (activeFilters.dateRange?.endDate) params.append('endDate', activeFilters.dateRange.endDate);
        if (activeFilters.threatActor) params.append('threatActor', activeFilters.threatActor);
        if (params.toString()) {
          alertsUrl += `?${params.toString()}`;
        }
      }

      const [statsRes, alertsRes, iocsRes, actorsRes] = await Promise.all([
        api.get('/alerts/stats'),
        api.get(alertsUrl),
        api.get('/intel/iocs'),
        api.get('/intel/threat-actors'),
      ]);

      let fetchedAlerts = alertsRes.data;
      if (activeFilters) {
        fetchedAlerts = fetchedAlerts.filter(a => {
          const s = a.severity || 'low';
          if (!activeFilters.severity[s]) return false;
          const status = a.status || 'open';
          if (activeFilters.status[status] === false) return false;
          // Note: "in-progress" is not a status in backend (it's "investigating" or similar, but the UI checks 'in-progress'. Let's relax status filtering if not exact match)
          if (status === 'investigating' && activeFilters.status['in-progress'] === false) return false;
          return true;
        });
      }

      setStats(statsRes.data);
      setAlerts(fetchedAlerts);
      setIocs(iocsRes.data);
      setThreatActors(actorsRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setError('Failed to load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
      setCountdown(REFRESH_INTERVAL);
    }
  }, [activeFilters]);

  // Initial fetch
  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Countdown timer + auto-refresh
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchData(true); // silent background refresh
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [fetchData]);

  const statCards = [
    {
      title: 'Total Alerts',
      value: loading ? '—' : stats.totalAlerts,
      trend: +12,
      icon: ShieldExclamationIcon,
      color: 'blue',
    },
    {
      title: 'Critical Threats',
      value: loading ? '—' : stats.criticalAlerts,
      trend: +5,
      icon: SignalIcon,
      color: 'red',
      severity: stats.criticalAlerts > 0 ? 'critical' : undefined,
    },
    {
      title: 'Open Cases',
      value: loading ? '—' : stats.openCases,
      trend: -2,
      icon: TicketIcon,
      color: 'yellow',
    },
    {
      title: 'Active IOCs',
      value: loading ? '—' : stats.activeIocs,
      trend: +8,
      icon: CpuChipIcon,
      color: 'indigo',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <span>⚠ {error}</span>
          <button
            onClick={() => fetchData(true)}
            className="ml-auto text-xs underline hover:text-red-300"
          >Retry</button>
        </div>
      )}
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <PageHeader
          title="Live Monitor"
          subtitle={
            lastUpdated
              ? `Last updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
              : 'Connecting…'
          }
          showTimeRange={false}
        />
        <div className="flex items-center gap-2">
          <FilterButton 
            onClick={() => setIsFilterOpen(true)} 
            activeCount={
              activeFilters ? 
              (Object.values(activeFilters.severity).filter(v => !v).length + Object.values(activeFilters.status).filter(v => !v).length + (activeFilters.threatActor ? 1 : 0) + (activeFilters.dateRange?.startDate ? 1 : 0) + (activeFilters.dateRange?.endDate ? 1 : 0)) 
              : 0
            } 
          />
          <LiveRefreshBar
            countdown={countdown}
            total={REFRESH_INTERVAL}
            onRefresh={() => fetchData(false)}
            loading={loading}
          />
        </div>
        <FilterPanel 
          open={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)} 
          onApplyFilters={setActiveFilters} 
        />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Row 2: Trend + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch" style={{ height: 460 }}>
        <div className="lg:col-span-2 h-full">
          <AlertsTrendCard alerts={alerts} liveIndicator />
        </div>
        <div className="h-full bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden">
          <RecentActivityFeed alerts={alerts} />
        </div>
      </div>

      {/* Row 3: Performance & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <SlaPerformanceCard />
        <TopAssetsCard alerts={alerts} />
        <WafRulesCard />
      </div>

      {/* Row 4: Threat Intel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-6 items-stretch">
        <ThreatIntelFeedCard
          feed={iocs.slice(0, 5).map((i) => ({
            id: i.id,
            type: i.type,
            value: i.value,
            time: new Date(i.createdAt || i.created_at || Date.now()).toLocaleTimeString(),
            severity: i.severity || 'low',
          }))}
        />
        <OpenCtiMatchesCard matches={actorMatches} />
      </div>
    </div>
  );
}
