import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import IOCFeedPage from './IOCFeedPage';
import ThreatActorsPage from './ThreatActorsPage';
import SyncStatusWidget from '../components/SyncStatusWidget';
import PageHeader from '../components/PageHeader';
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
          </Tabs>
        </Box>
      </div>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <IOCFeedPage hideHeader={true} />}
        {activeTab === 1 && <ThreatActorsPage hideHeader={true} />}
      </Box>
    </div>
  );
}
