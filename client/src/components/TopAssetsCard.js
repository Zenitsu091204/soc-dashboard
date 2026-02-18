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

function buildAssetData(alerts) {
  const counts = new Map();
  alerts.forEach((a) => {
    const entity = a.entity || 'Unknown';
    counts.set(entity, (counts.get(entity) || 0) + 1);
  });

  const data = Array.from(counts.entries()).map(([entity, count]) => ({
    entity,
    count,
  }));

  // Sort descending, take top 5
  data.sort((a, b) => b.count - a.count);
  return data.slice(0, 5);
}

export default function TopAssetsCard({ alerts = [] }) {
  const data = React.useMemo(() => buildAssetData(alerts), [alerts]);

  return (
    <div className="p-6 h-full flex flex-col border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md shadow-lg transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]">
      <div className="mb-4 flex items-center gap-3">
        <LanIcon className="text-indigo-400" />
        <div>
          <h3 className="font-black text-lg text-white">
            Top Affected Assets
          </h3>
          <p className="text-white/60 text-sm mt-0.5">
            Assets with the highest alert volume.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center min-h-[150px]">
            <p className="text-slate-400 text-sm">
              No asset data available.
            </p>
          </div>
        ) : (
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data}
                margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  stroke="#94a3b8"
                  hide
                />
                <YAxis
                  type="category"
                  dataKey="entity"
                  stroke="#f1f5f9"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                  style={{ fontSize: 13, fontWeight: 600, fill: '#cbd5e1' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.98)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(99, 102, 241, 0.5)',
                    borderRadius: 8,
                    color: '#ffffff',
                    fontSize: 12,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  fill="#6366F1"
                  background={{ fill: 'rgba(255, 255, 255, 0.05)', radius: [0, 4, 4, 0] }}
                >
                  <LabelList
                    dataKey="count"
                    position="right"
                    style={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 700 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
