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
import LanIcon from '@mui/icons-material/Lan';

const SEV_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

function buildAssetData(alerts) {
  const counts = new Map();
  const sevCounts = new Map();

  alerts.forEach((a) => {
    const entity = a.entity || 'Unknown';
    counts.set(entity, (counts.get(entity) || 0) + 1);
    const existing = sevCounts.get(entity) || { critical: 0, high: 0, medium: 0, low: 0 };
    const sev = (a.severity || 'low').toLowerCase();
    if (existing[sev] !== undefined) existing[sev]++;
    sevCounts.set(entity, existing);
  });

  const data = Array.from(counts.entries()).map(([entity, count]) => ({
    entity: entity.length > 14 ? entity.slice(0, 12) + '…' : entity,
    count,
    topSev: Object.entries(sevCounts.get(entity) || {}).sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a[0]] - order[b[0]];
    })[0]?.[0] || 'low',
  }));

  data.sort((a, b) => b.count - a.count);
  return data.slice(0, 6);
}

const CustomBar = (props) => {
  const { x, y, width, height, topSev } = props;
  const color = SEV_COLORS[topSev] || '#6366f1';
  const gradient = `bar-grad-${topSev}`;
  return (
    <g>
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={width} height={height} fill={`url(#${gradient})`} rx={4} ry={4} />
    </g>
  );
};

const BarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-slate-900/95 border border-white/10 rounded-xl p-3 shadow-xl text-xs">
      <p className="text-white font-semibold mb-1">{payload[0]?.payload?.entity}</p>
      <p className="text-slate-400">{payload[0]?.value} alerts</p>
      <span className="capitalize font-bold mt-1 block" style={{ color: SEV_COLORS[d?.topSev] }}>
        Peak: {d?.topSev}
      </span>
    </div>
  );
};

export default function TopAssetsCard({ alerts = [] }) {
  const data = React.useMemo(() => buildAssetData(alerts), [alerts]);

  return (
    <div className="p-5 h-full flex flex-col border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md shadow-lg transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
          <LanIcon className="text-indigo-400" fontSize="small" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Top Affected Assets</h3>
          <p className="text-slate-500 text-xs mt-0.5">Highest alert volume · color = peak severity</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-[180px]">
        {data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            No asset data
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
                dataKey="entity"
                tickLine={false}
                axisLine={false}
                width={110}
                style={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar
                dataKey="count"
                barSize={16}
                shape={<CustomBar />}
                background={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }}
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
