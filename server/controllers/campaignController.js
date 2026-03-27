const prisma = require('../utils/prisma');

// @desc Get campaigns with summary stats
// @route GET /api/campaigns
// @access Private
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { startDate: 'desc' },
    });

    const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    campaigns.forEach(c => { if (severityCounts[c.severity] !== undefined) severityCounts[c.severity]++; });

    const statusCounts = campaigns.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});

    const trendData = campaigns.slice(0, 7).reverse().map((c, i) => ({
      date: new Date(c.startDate).toLocaleDateString('en-US', { weekday: 'short' }),
      campaigns: campaigns.filter(x => {
        const d = new Date(x.startDate);
        const ref = new Date(c.startDate);
        return d.toDateString() === ref.toDateString();
      }).length,
    }));

    const severityDistribution = [
      { name: 'Critical', value: severityCounts.Critical, color: '#EF4444' },
      { name: 'High',     value: severityCounts.High,     color: '#F97316' },
      { name: 'Medium',   value: severityCounts.Medium,   color: '#EAB308' },
      { name: 'Low',      value: severityCounts.Low,      color: '#3B82F6' },
    ].filter(d => d.value > 0);

    res.json({
      timeline: campaigns,
      stats: {
        totalCampaigns: campaigns.length,
        activeCampaigns: statusCounts['Active'] || 0,
        severityDistribution,
        trendData,
        mitreTechniques: [
          { name: 'Phishing', value: severityCounts.Critical * 20 + 25 },
          { name: 'Command & Control', value: severityCounts.High * 15 + 20 },
          { name: 'Lateral Movement', value: severityCounts.Medium * 10 + 15 },
          { name: 'Data Exfiltration', value: (campaigns.length * 3) + 5 },
          { name: 'Privilege Escalation', value: (campaigns.length * 2) + 3 },
        ],
      },
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCampaigns };
