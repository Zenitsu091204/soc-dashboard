import React from 'react';
import PageHeader from '../components/PageHeader';
import { campaignStats, campaignTimeline } from '../data/mockCampaignData';

// Components
import CampaignKpiCard from '../components/campaign/CampaignKpiCard';
import SeverityDonutChart from '../components/campaign/SeverityDonutChart';
import CampaignTrendChart from '../components/campaign/CampaignTrendChart';
import MitreTechniquesChart from '../components/campaign/MitreTechniquesChart';
import CampaignTimeline from '../components/campaign/CampaignTimeline';

// Icons
import { FireIcon, BoltIcon } from '@heroicons/react/24/solid';

export default function CampaignTimelinePage() {
  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <PageHeader
        title="Campaign Timeline"
        subtitle="Track and analyze ongoing security campaigns."
      />

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CampaignKpiCard 
          title="Total Campaigns" 
          value={campaignStats.totalCampaigns} 
          icon={FireIcon} 
          color="text-orange-500" 
        />
        <CampaignKpiCard 
          title="Active Campaigns" 
          value={campaignStats.activeCampaigns} 
          icon={BoltIcon} 
          color="text-yellow-400" 
        />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        <SeverityDonutChart data={campaignStats.severityDistribution} />
        <CampaignTrendChart data={campaignStats.trendData} />
      </div>

      {/* Row 3: MITRE */}
      <div className="h-[350px]">
        <MitreTechniquesChart data={campaignStats.mitreTechniques} />
      </div>

      {/* Row 4: Timeline */}
      <div className="min-h-[400px]">
        <CampaignTimeline events={campaignTimeline} />
      </div>
    </div>
  );
}
