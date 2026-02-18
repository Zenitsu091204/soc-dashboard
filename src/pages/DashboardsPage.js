import * as React from 'react';
import { Box, Grid } from '@mui/material';
import PageHeader from '../components/PageHeader.js';
import StatCard from '../components/StatCard.js';
import AlertsTrendCard from '../components/AlertsTrendCard';
import AlertStatusCard from '../components/AlertStatusCard';
import TopAssetsCard from '../components/TopAssetsCard';
import IocDistributionCard from '../components/IocDistributionCard';
import TopThreatActorsCard from '../components/TopThreatActorsCard';
import RecentActivityFeed from '../components/RecentActivityFeed';
import { alerts, iocs, threatActors } from '../data/mockSocData.js';



export default function DashboardsPage() {
  const totalAlerts = alerts.length;
  const uniqueAssets = React.useMemo(
    () => new Set(alerts.map((a) => a.entity)).size,
    []
  );
  const totalActors = threatActors.length;
  const totalIocs = iocs.length;

  return (
    <Box sx={{ p: 3 }} className="animate-fade-in">
      <PageHeader
        title="Security Operations Center"
        subtitle="Real-time monitoring and threat intelligence overview."
      />

      {/* KPI row for this dashboards page */}
      <Grid container spacing={3} sx={{ mt: 1, mb: 4 }} alignItems="stretch">
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ animationDelay: '0.1s' }} className="animate-slide-in">
          <StatCard
            label="Total alerts"
            value={totalAlerts}
            helper="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ animationDelay: '0.2s' }} className="animate-slide-in">
          <StatCard
            label="Unique assets"
            value={uniqueAssets}
            helper="Active entities"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ animationDelay: '0.3s' }} className="animate-slide-in">
          <StatCard
            label="Threat actors"
            value={totalActors}
            helper="Tracked profiles"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ animationDelay: '0.4s' }} className="animate-slide-in">
          <StatCard
            label="Active IOCs"
            value={totalIocs}
            helper="Intelligence feed"
          />
        </Grid>
      </Grid>

      {/* Main Content Layout */}
      <Grid container spacing={3}>
        {/* Left Column - Main Charts */}
        <Grid item xs={12} md={9}>
          {/* Main Charts Row */}
          <Grid container spacing={3} alignItems="stretch" sx={{ mb: 3 }}>
            <Grid item xs={12} lg={8}>
              <Box sx={{ height: '100%', minHeight: 400 }}>
                 <AlertsTrendCard alerts={alerts} />
              </Box>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Box sx={{ height: '100%', minHeight: 400 }}>
                 <AlertStatusCard alerts={alerts} />
              </Box>
            </Grid>
          </Grid>

          {/* Secondary Charts Row */}
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} lg={4}>
              <Box sx={{ height: '100%', minHeight: 400 }}>
                 <TopAssetsCard alerts={alerts} />
              </Box>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Box sx={{ height: '100%', minHeight: 400 }}>
                 <TopThreatActorsCard threatActors={threatActors} />
              </Box>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Box sx={{ height: '100%', minHeight: 400 }}>
                 <IocDistributionCard iocs={iocs} />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Feed */}
        <Grid item xs={12} md={3}>
           <Box sx={{ height: 450 }}>
             <RecentActivityFeed alerts={alerts} maxItems={15} />
           </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
