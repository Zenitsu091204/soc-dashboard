import * as React from 'react';
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import RadarIcon from '@mui/icons-material/Radar'; // Good icon for tracking attackers

const SEV_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

// Generate deterministic mock IPs based on alert IDs/entities as we don't have source IP in the basic mock data
function generateIp(seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const o1 = Math.abs((hash >> 24) & 255);
    const o2 = Math.abs((hash >> 16) & 255);
    const o3 = Math.abs((hash >> 8) & 255);
    const o4 = Math.abs(hash & 255);
    // Avoid internal looking IPs for better demo effect
    return `${o1 === 10 || o1 === 192 || o1 === 172 ? 111 : o1}.${o2}.${o3}.${o4}`;
}

function buildAttackerData(alerts) {
  const counts = new Map();
  const sevCounts = new Map();

  alerts.forEach((a) => {
    // Determine a "source IP"
    const sourceIp = a.sourceIp || generateIp(a.entity || a.id || 'default');
    
    counts.set(sourceIp, (counts.get(sourceIp) || 0) + 1);
    
    const existing = sevCounts.get(sourceIp) || { critical: 0, high: 0, medium: 0, low: 0 };
    const sev = (a.severity || 'low').toLowerCase();
    if (existing[sev] !== undefined) existing[sev]++;
    sevCounts.set(sourceIp, existing);
  });

  const data = Array.from(counts.entries()).map(([ip, count]) => ({
    ip,
    count,
    topSev: Object.entries(sevCounts.get(ip) || {}).sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a[0]] - order[b[0]];
    })[0]?.[0] || 'low',
  }));

  data.sort((a, b) => b.count - a.count);
  return data.slice(0, 6);
}

const GradientDefs = () => (
  <defs>
    {Object.entries(SEV_COLORS).map(([sev, color]) => (
      <linearGradient key={`ip-grad-${sev}`} id={`ip-grad-${sev}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
        <stop offset="100%" stopColor={color} stopOpacity={0.4} />
      </linearGradient>
    ))}
  </defs>
);

const CustomBar = (props) => {
  const { x, y, width, height, topSev } = props;
  const gradient = `ip-grad-${topSev || 'low'}`;
  return (
    <rect x={x} y={y} width={width} height={height} fill={`url(#${gradient})`} rx={4} ry={4} />
  );
};

const BarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-slate-900/95 border border-white/10 rounded-xl p-3 shadow-xl text-xs">
      <p className="text-white font-mono font-semibold mb-1">{d?.ip}</p>
      <p className="text-slate-400">{payload[0]?.value} attacks observed</p>
      <span className="capitalize font-bold mt-1 block" style={{ color: SEV_COLORS[d?.topSev] }}>
        Peak Severity: {d?.topSev}
      </span>
    </div>
  );
};

export default function TopAttackerIpsCard({ alerts = [] }) {
  const data = React.useMemo(() => buildAttackerData(alerts), [alerts]);

  return (
    <div className="p-5 h-full flex flex-col border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md shadow-lg transition-all duration-300 hover:border-red-500/30 hover:shadow-[0_8px_32px_rgba(239,68,68,0.15)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
          <RadarIcon className="text-red-400" fontSize="small" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Top Attacker IPs</h3>
          <p className="text-slate-500 text-xs mt-0.5">Highest threat volumes · color = peak severity</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-[180px]">
        {data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            No attacker IP data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ left: 0, right: 36, top: 0, bottom: 0 }}
            >
              <GradientDefs />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="ip"
                tickLine={false}
                axisLine={false}
                width={120}
                style={{ fontSize: 13, fill: '#94a3b8', fontFamily: 'monospace', fontWeight: 500 }}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar
                dataKey="count"
                barSize={16}
                shape={<CustomBar />}
                background={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }}
                isAnimationActive={false}
              >
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
