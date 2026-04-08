import * as React from 'react';
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from 'recharts';
import BugReportIcon from '@mui/icons-material/BugReport';

const SEV_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

function buildThreatData(alerts) {
  const counts = new Map();
  const sevCounts = new Map();

  alerts.forEach((a) => {
    const title = a.title || 'Unknown Threat';
    counts.set(title, (counts.get(title) || 0) + 1);
    
    // Track the highest severity logic
    const existing = sevCounts.get(title) || { critical: 0, high: 0, medium: 0, low: 0 };
    const sev = (a.severity || 'low').toLowerCase();
    if (existing[sev] !== undefined) existing[sev]++;
    sevCounts.set(title, existing);
  });

  const data = Array.from(counts.entries()).map(([title, count]) => {
    // Truncate long titles for the y-axis
    const shortTitle = title.length > 20 ? title.substring(0, 18) + '...' : title;
    return {
      title: shortTitle,
      fullTitle: title,
      count,
      topSev: Object.entries(sevCounts.get(title) || {}).sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a[0]] - order[b[0]];
      })[0]?.[0] || 'low',
    };
  });

  data.sort((a, b) => b.count - a.count);
  return data.slice(0, 5);
}

const BarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-slate-900/95 border border-white/10 rounded-xl p-3 shadow-xl text-xs z-50">
      <p className="text-white font-semibold mb-1">{d?.fullTitle}</p>
      <p className="text-slate-400">{payload[0]?.value} occurrences</p>
      <span className="capitalize font-bold mt-1 block" style={{ color: SEV_COLORS[d?.topSev] }}>
        Peak Severity: {d?.topSev}
      </span>
    </div>
  );
};

export default function TopActiveThreatsCard({ alerts = [] }) {
  const data = React.useMemo(() => buildThreatData(alerts), [alerts]);

  return (
    <div className="p-5 h-full flex flex-col border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md shadow-lg transition-all duration-300 hover:border-orange-500/30 hover:shadow-[0_8px_32px_rgba(249,115,22,0.15)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <BugReportIcon className="text-orange-400" fontSize="small" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Top Active Threats</h3>
          <p className="text-slate-500 text-xs mt-0.5">Most frequent attack vectors</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-[220px]">
        {data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            No active threat data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ left: 0, right: 36, top: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="title"
                tickLine={false}
                axisLine={false}
                width={140}
                style={{ fontSize: 12, fill: '#cbd5e1', fontWeight: 500 }}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar
                dataKey="count"
                barSize={16}
                background={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SEV_COLORS[entry.topSev] || '#3b82f6'} rx={4} ry={4} opacity={0.85} />
                ))}
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
