import React, { useState, useEffect } from 'react';
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
} from '@heroicons/react/24/outline';

export default function OverviewPage() {
  const [stats, setStats] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    openCases: 0,
    activeIocs: 0,
  });
  const [loading, setLoading] = useState(true);

  const [alerts, setAlerts] = useState([]);
  const [iocs, setIocs] = useState([]);
  const [threatActors, setThreatActors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, alertsRes, iocsRes, actorsRes] = await Promise.all([
          api.get('/alerts/stats'),
          api.get('/alerts'),
          api.get('/intel/iocs'),
          api.get('/intel/threat-actors')
        ]);
        setStats(statsRes.data);
        setAlerts(alertsRes.data);
        setIocs(iocsRes.data);
        setThreatActors(actorsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Overview"
        subtitle="Real-time monitoring and threat analysis"
        showTimeRange={true}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Alerts"
          value={loading ? '...' : stats.totalAlerts.toString()}
          trend={+12}
          icon={ShieldExclamationIcon}
          color="blue"
        />
        <StatCard
          title="Critical Threats"
          value={loading ? '...' : stats.criticalAlerts.toString()}
          trend={+5}
          icon={SignalIcon}
          color="red"
          isUrgent={stats.criticalAlerts > 0}
        />
        <StatCard
          title="Open Cases"
          value={loading ? '...' : stats.openCases.toString()}
          trend={-2}
          icon={TicketIcon}
          color="yellow"
        />
        <StatCard
          title="Active IOCs"
          value={loading ? '...' : stats.activeIocs.toString()}
          trend={+8}
          icon={CpuChipIcon}
          color="indigo"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch h-[580px]">
        {/* Left Column: Alerts Trend (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col h-full bg-transparent overflow-hidden">
           <AlertsTrendCard alerts={alerts} /> 
        </div>

        {/* Right Column: Recent Activity (1/3 width) */}
        <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden">
          <RecentActivityFeed />
        </div>
      </div>

      {/* Row 3: Performance & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
         <SlaPerformanceCard />
         <TopAssetsCard alerts={alerts} /> 
         <WafRulesCard />
      </div>

      {/* Row 4: Threat Intel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 items-stretch">
        <ThreatIntelFeedCard 
          feed={iocs.slice(0, 5).map(i => ({
             id: i.id,
             type: i.type,
             value: i.value,
             time: new Date(i.created_at || Date.now()).toLocaleTimeString(),
             severity: i.severity || 'low'
          }))} 
        />
        <OpenCtiMatchesCard 
          matches={threatActors.slice(0, 5).map(t => ({
             id: t.id,
             actor: t.name,
             type: t.type,
             risk: 'Critical', // Mocking risk for now as it's not in DB
             confidence: Math.floor(Math.random() * 20) + 80 // Mock reliability
          }))} 
        />
      </div>
    </div>
  );
}
