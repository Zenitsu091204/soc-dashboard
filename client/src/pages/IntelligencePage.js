import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Chip } from '@mui/material';
import IOCFeedPage from './IOCFeedPage';
import ThreatActorsPage from './ThreatActorsPage';
import OpenCtiSystemPage from './OpenCtiSystemPage';
import OpenCtiDataGrid from '../components/intel/OpenCtiDataGrid';
import SyncStatusWidget from '../components/SyncStatusWidget';
import PageHeader from '../components/PageHeader';

// Heroicons
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import RocketLaunchIcon from '@heroicons/react/24/outline/RocketLaunchIcon';
import DocumentChartBarIcon from '@heroicons/react/24/outline/DocumentChartBarIcon';
import BeakerIcon from '@heroicons/react/24/outline/BeakerIcon';
import BoltIcon from '@heroicons/react/24/outline/BoltIcon';
import CpuChipIcon from '@heroicons/react/24/outline/CpuChipIcon';

import CampaignTimeline from '../components/campaign/CampaignTimeline';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState({
    reports: [],
    malware: [],
    incidents: [],
    relationships: [],
    campaigns: []
  });
  const [loading, setLoading] = useState(false);

  const fetchTabDetails = async (tab) => {
    setLoading(true);
    try {
      if (tab === 2) { // Campaigns
         const res = await api.get('/campaigns');
         setData(prev => ({ ...prev, campaigns: res.data }));
      } else if (tab === 3) { // Knowledge (Reports)
         const res = await api.get('/intel/reports?important=true');
         const relRes = await api.get('/intel/relationships');
         setData(prev => ({ ...prev, reports: res.data, relationships: relRes.data }));
      } else if (tab === 4) { // Arsenal (Malware)
         const res = await api.get('/intel/malware?important=true');
         setData(prev => ({ ...prev, malware: res.data }));
      } else if (tab === 5) { // Events (Incidents)
         const res = await api.get('/intel/incidents?important=true');
         setData(prev => ({ ...prev, incidents: res.data }));
      }
    } catch (err) {
      toast.error('Failed to fetch intelligence details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab > 1) {
      fetchTabDetails(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="space-y-6">
      <div className="px-6 pt-6 mb-2">
        <SyncStatusWidget />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6">
        <PageHeader 
          title="Intelligence Hub" 
          subtitle="Tier-1 validated threat landscape from OpenCTI."
        />
        
        <Box sx={{ bgcolor: 'slate.900/40', borderRadius: '14px', p: 0.5, border: '1px solid rgba(255,255,255,0.05)' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: '44px',
              '& .MuiTabs-indicator': {
                height: '100%',
                borderRadius: '10px',
                zIndex: 0,
                backgroundColor: 'indigo.600',
                opacity: 0.15
              },
              '& .MuiTab-root': {
                minHeight: '40px',
                fontSize: '0.7rem',
                fontWeight: '700',
                color: 'slate.400',
                zIndex: 1,
                textTransform: 'none',
                px: 2,
                '&.Mui-selected': { color: 'indigo.400' }
              }
            }}
          >
            <Tab label="Indicators" icon={<ShieldCheckIcon className="w-4 h-4" />} iconPosition="start" />
            <Tab label="Adversaries" icon={<UserGroupIcon className="w-4 h-4" />} iconPosition="start" />
            <Tab label="Campaigns" icon={<RocketLaunchIcon className="w-4 h-4" />} iconPosition="start" />
            <Tab label="Knowledge" icon={<DocumentChartBarIcon className="w-4 h-4" />} iconPosition="start" />
            <Tab label="Arsenal" icon={<BeakerIcon className="w-4 h-4" />} iconPosition="start" />
            <Tab label="Events" icon={<BoltIcon className="w-4 h-4" />} iconPosition="start" />
            <Tab label="System" icon={<CpuChipIcon className="w-4 h-4" />} iconPosition="start" />
          </Tabs>
        </Box>
      </div>

      <Box sx={{ mt: 2, px: { xs: 0, md: 6 } }}>
        {activeTab === 0 && <IOCFeedPage hideHeader={true} importantOnly={true} />}
        {activeTab === 1 && <ThreatActorsPage hideHeader={true} importantOnly={true} />}
        
        {activeTab === 2 && (
          <div className="animate-fade-in space-y-6 pb-10">
            {data.campaigns?.length > 0 && (
              <CampaignTimeline events={data.campaigns.map(c => ({
                id: c.id,
                date: new Date(c.lastSeen || new Date()).toLocaleDateString(),
                title: c.title,
                description: c.description,
                status: c.status,
                severity: c.severity
              }))} />
            )}
            {(!data.campaigns || data.campaigns.length === 0) && (
               <Typography sx={{ color: 'slate.500', textAlign: 'center', py: 8 }}>No active campaigns synced.</Typography>
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
             <OpenCtiDataGrid 
               title="Validated Reports"
               data={data.reports}
               loading={loading}
               columns={[
                 { field: 'name', headerName: 'Report Name' },
                 { field: 'status', headerName: 'Status', renderCell: (row) => <Chip label={row.status} size="small" sx={{ bgcolor: 'indigo.500/20', color: 'indigo.300' }} /> },
                 { field: 'marking', headerName: 'TLP', renderCell: (row) => <Chip label={row.marking || 'CLEAR'} size="small" variant="outlined" /> }
               ]}
             />
             <OpenCtiDataGrid 
               title="Knowledge Graph (Latest)"
               data={data.relationships}
               loading={loading}
               columns={[
                 { field: 'sourceType', headerName: 'Source Type' },
                 { field: 'relationshipType', headerName: 'Relation', renderCell: (row) => <Typography sx={{ color: 'indigo.400', fontSize: '0.8rem' }}>{row.relationshipType}</Typography> },
                 { field: 'targetType', headerName: 'Target Type' }
               ]}
             />
          </div>
        )}

        {activeTab === 4 && (
          <div className="animate-fade-in pb-10">
             <OpenCtiDataGrid 
               title="Known Malware"
               data={data.malware}
               loading={loading}
               columns={[
                 { field: 'name', headerName: 'Malware Name' },
                 { field: 'description', headerName: 'Description' },
                 { field: 'lastSeen', headerName: 'Last Activity', renderCell: (row) => row.lastSeen ? new Date(row.lastSeen).toLocaleDateString() : 'Unknown' }
               ]}
             />
          </div>
        )}

        {activeTab === 5 && (
          <div className="animate-fade-in pb-10">
             <OpenCtiDataGrid 
               title="Threat Events (Incidents)"
               data={data.incidents}
               loading={loading}
               columns={[
                 { field: 'name', headerName: 'Incident Name' },
                 { field: 'severity', headerName: 'Severity', renderCell: (row) => <Chip label={row.severity} size="small" color={row.severity === 'Critical' ? 'error' : 'warning'} /> },
                 { field: 'lastSeen', headerName: 'Observed', renderCell: (row) => row.lastSeen ? new Date(row.lastSeen).toLocaleString() : 'N/A' }
               ]}
             />
          </div>
        )}

        {activeTab === 6 && <OpenCtiSystemPage />}
      </Box>
    </div>
  );
}
