import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import api from '../services/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Components
import CampaignKpiCard from '../components/campaign/CampaignKpiCard';
import SeverityDonutChart from '../components/campaign/SeverityDonutChart';
import CampaignTrendChart from '../components/campaign/CampaignTrendChart';
import MitreTechniquesChart from '../components/campaign/MitreTechniquesChart';
import CampaignTimeline from '../components/campaign/CampaignTimeline';

// Icons
import { FireIcon, BoltIcon } from '@heroicons/react/24/solid';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function CampaignTimelinePage() {
  const [campaignStats, setCampaignStats] = useState(null);
  const [campaignTimeline, setCampaignTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await api.get('/campaigns');
        setCampaignStats(data.stats);
        setCampaignTimeline(data.timeline);
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
        setError('Failed to load campaign data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleExportPDF = async () => {
    const element = document.getElementById('campaign-report');
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0B1120' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Campaign_Timeline_Report.pdf');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !campaignStats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="text-red-400 text-4xl">⚠</div>
        <p className="text-red-400 font-semibold">{error || 'No campaign data available.'}</p>
      </div>
    );
  }

  return (
    <div id="campaign-report" className="space-y-6 p-6 animate-fade-in bg-[#0B1120]">
      <div className="flex justify-between items-start mb-6">
        <PageHeader
          title="Campaign Timeline"
          subtitle="Track and analyze ongoing security campaigns."
        />
        <button
          onClick={handleExportPDF}
          className="mt-2 px-4 py-2 bg-indigo-600/20 text-indigo-400 font-medium hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg flex items-center gap-2 transition-colors text-sm"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          Export PDF
        </button>
      </div>

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
