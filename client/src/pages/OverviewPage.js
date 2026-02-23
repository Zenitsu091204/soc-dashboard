import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

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

// Icons
import {
  ShieldExclamationIcon,
  TicketIcon,
  CpuChipIcon,
  SignalIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const REFRESH_INTERVAL = 30; // seconds

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
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [lastUpdated, setLastUpdated] = useState(null);
  const countdownRef = useRef(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [statsRes, alertsRes, iocsRes, actorsRes] = await Promise.all([
        api.get('/alerts/stats'),
        api.get('/alerts'),
        api.get('/intel/iocs'),
        api.get('/intel/threat-actors'),
      ]);
      setStats(statsRes.data);
      setAlerts(alertsRes.data);
      setIocs(iocsRes.data);
      setThreatActors(actorsRes.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
      setCountdown(REFRESH_INTERVAL); // reset countdown
    }
  }, []);

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
        <LiveRefreshBar
          countdown={countdown}
          total={REFRESH_INTERVAL}
          onRefresh={() => fetchData(false)}
          loading={loading}
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
            time: new Date(i.created_at || Date.now()).toLocaleTimeString(),
            severity: i.severity || 'low',
          }))}
        />
        <OpenCtiMatchesCard
          matches={threatActors.slice(0, 5).map((t) => ({
            id: t.id,
            actor: t.name,
            type: t.type,
            risk: 'Critical',
            confidence: Math.floor(Math.random() * 20) + 80,
          }))}
        />
      </div>
    </div>
  );
}
