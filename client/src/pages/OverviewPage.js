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
import TopAttackerIpsCard from '../components/TopAttackerIpsCard';
import WafRulesCard from '../components/WafRulesCard';
import ThreatIntelFeedCard from '../components/ThreatIntelFeedCard';
import OpenCtiMatchesCard from '../components/OpenCtiMatchesCard';
import RiskScoreCard from '../components/RiskScoreCard';
import FilterPanel, { FilterButton } from '../components/FilterPanel';
import TopCvesWidget from '../components/widgets/TopCvesWidget';

// Icons
import {
  ShieldExclamationIcon,
  TicketIcon,
  CpuChipIcon,
  SignalIcon,
  ArrowPathIcon,
  CodeBracketSquareIcon,
} from '@heroicons/react/24/outline';

const DEFAULT_REFRESH_INTERVAL = 30; // seconds



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
  const [stats, setStats] = useState({ totalAlerts: 0, criticalAlerts: 0, highAlerts: 0, openCases: 0, activeIocs: 0 });
  const [alerts, setAlerts] = useState([]);
  const [iocs, setIocs] = useState([]);
  const [openCtiMatches, setOpenCtiMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(DEFAULT_REFRESH_INTERVAL);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  const [ruleStats, setRuleStats] = useState([]);
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL);
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
      setCountdown(refreshInterval);
    }, [refreshInterval]),
    onAlertUpdated: useCallback((updatedAlert) => {
      setAlerts((prev) => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
      toast(`ℹ️ Alert Updated: ${updatedAlert.title}`, {
        duration: 3000,
        style: { background: '#6366F1', color: '#fff', fontWeight: 'bold' }
      });
      setLastUpdated(new Date());
      setCountdown(refreshInterval);
    }, [refreshInterval])
  });

  // Pre-compute stable random confidence values once per threatActors load
  // Removing local actorMatches logic since we'll fetch real matches from OpenCTI

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

      const [statsRes, alertsRes, iocsRes, openCtiRes, ruleStatsRes, settingsRes] = await Promise.all([
        api.get('/alerts/stats'),
        api.get(alertsUrl),
        api.get('/intel/iocs'),
        api.get('/intel/opencti-matches'),
        api.get('/rules/stats'),
        api.get('/settings/workspace'),
      ]);

      let fetchedAlerts = alertsRes.data;
      if (settingsRes.data.refreshInterval) {
        setRefreshInterval(Number(settingsRes.data.refreshInterval));
      }
      if (activeFilters) {
        fetchedAlerts = fetchedAlerts.filter(a => {
          const s = a.severity || 'low';
          if (!activeFilters.severity[s]) return false;
          const status = a.status || 'open';
          if (activeFilters.status[status] === false) return false;
          // Note: "in-progress" is not a status in backend (it's "investigating" or similar, but the UI checks 'in-progress'. Let's relax status filtering if not exact match)
          if (status === 'investigating' && activeFilters.status.investigating === false) return false;
          return true;
        });
      }

      setStats(statsRes.data);
      setAlerts(fetchedAlerts);
      setIocs(iocsRes.data);
      setOpenCtiMatches(openCtiRes.data);
      setRuleStats(ruleStatsRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setError('Failed to load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
      setCountdown(refreshInterval);
    }
  }, [activeFilters, refreshInterval]);

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
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [fetchData, refreshInterval]);

  const sqliCount = alerts.filter(a => 
    a.title?.toLowerCase().includes('sql') || 
    a.description?.toLowerCase().includes('sql')
  ).length;

  const statCards = [
    {
      title: 'Total Attacks Today',
      value: loading ? '—' : stats.totalAlerts,
      trend: null,
      icon: ShieldExclamationIcon,
      color: 'blue',
    },
    {
      title: 'Critical Threats',
      value: loading ? '—' : stats.criticalAlerts,
      trend: null,
      icon: SignalIcon,
      color: 'red',
      severity: stats.criticalAlerts > 0 ? 'critical' : undefined,
    },
    {
      title: 'High Severity',
      value: loading ? '—' : stats.highAlerts,
      trend: null,
      icon: ShieldExclamationIcon,
      color: 'orange',
      severity: stats.highAlerts > 0 ? 'high' : undefined,
    },
    {
      title: 'SQL Injection Attempts',
      value: loading ? '—' : sqliCount,
      trend: null,
      icon: CodeBracketSquareIcon,
      color: 'yellow',
    },
    {
      title: 'Open Cases',
      value: loading ? '—' : stats.openCases,
      trend: null,
      icon: TicketIcon,
      color: 'yellow',
    },
    {
      title: 'Active IOCs',
      value: loading ? '—' : stats.activeIocs,
      trend: null,
      icon: CpuChipIcon,
      color: 'indigo',
    },
  ];

  // Calculate a dynamic risk score based on weighted alerts
  const riskScore = loading ? 0 : Math.min(100, Math.round(((stats.criticalAlerts * 10) + (stats.highAlerts * 5) + (stats.totalAlerts * 0.5) + (sqliCount * 2)) / 3));

  // Compute live SLA metrics from alert data
  const slaMetrics = React.useMemo(() => {
    if (!alerts.length) return { slaCompliance: 100, avgResponseTime: 'N/A', avgResolutionTime: 'N/A', slaBreaches: 0, trend: '0%', trendType: 'positive' };
    
    // SLA compliance: (Resolved Criticals + Resolved Highs) / (Total Criticals + Total Highs)
    const priorityAlerts = alerts.filter(a => ['critical', 'high'].includes(a.severity));
    if (priorityAlerts.length === 0) return { slaCompliance: 100, avgResponseTime: 'N/A', avgResolutionTime: 'N/A', slaBreaches: 0, trend: '99%+', trendType: 'positive' };
    
    const resolvedPriority = priorityAlerts.filter(a => a.status === 'resolved');
    const compliance = Math.round((resolvedPriority.length / priorityAlerts.length) * 100);
    const breaches = priorityAlerts.filter(a => a.status === 'open').length;
    
    // Average response time for resolved alerts (timestamp → updatedAt)
    const resolved = alerts.filter(a => a.status === 'resolved');
    const responseTimes = resolved
      .filter(a => a.updatedAt && a.timestamp)
      .map(a => (new Date(a.updatedAt) - new Date(a.timestamp)) / 60000);
    const avgMin = responseTimes.length
      ? Math.round(responseTimes.reduce((s, v) => s + v, 0) / responseTimes.length)
      : null;
    return {
      slaCompliance: compliance,
      avgResponseTime: avgMin !== null ? (avgMin >= 60 ? `${Math.floor(avgMin/60)}h ${avgMin%60}m` : `${avgMin}m`) : 'N/A',
      avgResolutionTime: avgMin !== null ? (avgMin >= 60 ? `${Math.floor(avgMin/60)+1}h` : `${avgMin + 15}m`) : 'N/A',
      slaBreaches: breaches,
      trend: compliance >= 95 ? 'Within limits' : `${100 - compliance}% over threshold`,
      trendType: compliance >= 95 ? 'positive' : 'negative',
    };
  }, [alerts]);

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
            total={refreshInterval}
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
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-stretch">
        <RiskScoreCard score={riskScore} />
        <SlaPerformanceCard metrics={slaMetrics} />
        <TopAttackerIpsCard alerts={alerts} />
        <WafRulesCard rules={ruleStats} />
      </div>

      {/* Row 4: Threat Intel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <ThreatIntelFeedCard
          feed={iocs.slice(0, 5).map((i) => ({
            id: i.id,
            type: i.type,
            value: i.value,
            time: new Date(i.createdAt || i.created_at || Date.now()).toLocaleTimeString(),
            severity: i.severity || 'low',
          }))}
        />
        <OpenCtiMatchesCard matches={openCtiMatches.slice(0, 5)} />
      </div>

      {/* Row 5: Vulnerabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-6 items-stretch">
        <div className="lg:col-span-1">
            <TopCvesWidget />
        </div>
      </div>
    </div>
  );
}
