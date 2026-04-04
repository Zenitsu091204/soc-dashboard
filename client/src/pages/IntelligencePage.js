import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import IOCFeedPage from './IOCFeedPage';
import ThreatActorsPage from './ThreatActorsPage';
import SyncStatusWidget from '../components/SyncStatusWidget';
import PageHeader from '../components/PageHeader';
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import RocketLaunchIcon from '@heroicons/react/24/outline/RocketLaunchIcon';
import DocumentChartBarIcon from '@heroicons/react/24/outline/DocumentChartBarIcon';
import CampaignTimeline from '../components/campaign/CampaignTimeline';
import MitreTechniquesChart from '../components/campaign/MitreTechniquesChart';
import SeverityDonutChart from '../components/campaign/SeverityDonutChart';
import CampaignKpiCard from '../components/campaign/CampaignKpiCard';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/campaigns');
      setCampaignData(data);
    } catch (err) {
      toast.error('Failed to fetch campaign intelligence');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 2 && !campaignData) {
      fetchCampaigns();
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-6 pt-6 mb-2">
        <SyncStatusWidget />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6">
        <PageHeader 
          title="Intelligence Hub" 
          subtitle="Unified threat intelligence, indicators, and adversary profiles."
        />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'slate.900/40', borderRadius: '12px', p: 0.5 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="intelligence tabs"
            sx={{
              '& .MuiTabs-indicator': {
                height: '100%',
                borderRadius: '8px',
                zIndex: 0,
                backgroundColor: 'indigo.600',
                opacity: 0.2
              },
              '& .MuiTab-root': {
                minHeight: '40px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: 'slate.400',
                zIndex: 1,
                textTransform: 'none',
                minWidth: '140px',
                '&.Mui-selected': {
                  color: 'indigo.400',
                }
              }
            }}
          >
            <Tab label="Indicators" icon={<ShieldCheckIcon className="w-4 h-4" />} iconPosition="start" />
            <Tab label="Adversaries" icon={<UserGroupIcon className="w-4 h-4" />} iconPosition="start" />
            <Tab label="Campaigns" icon={<RocketLaunchIcon className="w-4 h-4" />} iconPosition="start" />
            <Tab label="Reports" icon={<DocumentChartBarIcon className="w-4 h-4" />} iconPosition="start" />
          </Tabs>
        </Box>
      </div>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <IOCFeedPage hideHeader={true} />}
        {activeTab === 1 && <ThreatActorsPage hideHeader={true} />}
        {activeTab === 2 && (
          <div className="px-6 space-y-6 pb-10 animate-fade-in">
            {loading ? (
              <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>
            ) : campaignData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <CampaignKpiCard title="Total Campaigns" value={campaignData.stats.totalCampaigns} />
                  <CampaignKpiCard title="Active Threats" value={campaignData.stats.activeCampaigns} color="red" />
                  <CampaignKpiCard title="Avg Confidence" value="82%" color="blue" />
                  <CampaignKpiCard title="MTTD" value="14m" color="green" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <CampaignTimeline events={campaignData.timeline.map(c => ({
                      id: c.id,
                      date: new Date(c.startDate).toLocaleDateString(),
                      title: c.title,
                      description: c.description,
                      status: c.status,
                      severity: c.severity,
                      actor: c.actor,
                      indicators: c.indicators
                    }))} />
                  </div>
                  <div className="space-y-6">
                    <SeverityDonutChart data={campaignData.stats.severityDistribution} />
                    <MitreTechniquesChart data={campaignData.stats.mitreTechniques} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-20 text-slate-500">No campaign data available.</div>
            )}
          </div>
        )}
        {activeTab === 3 && (
          <div className="px-6 space-y-6 pb-10 animate-fade-in text-center p-20">
             <div className="max-w-md mx-auto p-8 bg-slate-900/40 border border-white/5 rounded-3xl">
                <DocumentChartBarIcon className="w-16 h-16 text-indigo-500/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Threat Intelligence Reporter</h3>
                <p className="text-slate-400 mb-6">Generate executive-ready PDF reports of current threats, campaigns, and system health.</p>
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                  Generate Full Report
                </button>
             </div>
          </div>
        )}
      </Box>
    </div>
  );
}
