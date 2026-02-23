import * as React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatUtc } from '../utils/format';
import showToast from '../utils/toast';

function buildAlertsOverTime(alerts) {
  const counts = new Map();

  alerts.forEach((a) => {
    const timeVal = a.timestamp || a.time;
    if (!timeVal) return;
    const d = new Date(timeVal);
    if (isNaN(d.getTime())) return;
    const key = d.toISOString().slice(0, 13); // group by hour (YYYY-MM-DDTHH)
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, count]) => {
      const label = formatUtc(key + ':00:00Z');
      return { key, label, count, date: label };
    });
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-slate-400 block mb-1">
          {label}
        </p>
        <p className="text-lg font-bold text-indigo-500">
          {payload[0].value} alerts
        </p>
        <p className="text-[10px] text-slate-500 mt-1 block">
          Click to filter by this time
        </p>
      </div>
    );
  }
  return null;
};

export default function AlertsTrendCard({ alerts, onTimeRangeClick }) {
  const data = React.useMemo(() => buildAlertsOverTime(alerts), [alerts]);

  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, d) => sum + d.count, 0);
    const previous = data.slice(-6, -3).reduce((sum, d) => sum + d.count, 0);
    if (previous === 0) return 0;
    return Math.round(((recent - previous) / previous) * 100);
  };

  const trend = calculateTrend();

  // Handle chart click
  const handleChartClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedData = data.activePayload[0].payload;
      showToast.info(
        'Time range selected',
        `Showing ${clickedData.count} alerts from ${clickedData.label}`
      );
      if (onTimeRangeClick) {
        onTimeRangeClick(clickedData);
      }
    }
  };

  return (
    <div className="p-6 h-full min-h-[400px] flex flex-col border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-extrabold text-white">Alerts Trend</h3>
          <p className="text-slate-400 text-sm">
            Real-time volume analysis • Click to filter
          </p>
        </div>
        {/* Trend Indicator */}
        <div className={`px-3 py-1.5 rounded-lg border flex flex-col items-center justify-center ${trend > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
          <span className={`text-lg font-black leading-none ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            7-day trend
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data}
            onClick={handleChartClick}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            style={{ cursor: 'pointer' }}
          >
            <defs>
              <linearGradient id="alertsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.15)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
              style={{ fontSize: 12, fontFamily: 'sans-serif' }}
            />
            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
              allowDecimals={false}
              domain={[0, 'auto']}
              style={{ fontSize: 12, fontFamily: 'sans-serif' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366F1', strokeWidth: 2 }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#6366F1"
              strokeWidth={3}
              fill="url(#alertsGradient)"
              dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#1E293B' }}
              activeDot={{ 
                r: 8, 
                fill: '#818CF8', 
                strokeWidth: 3, 
                stroke: '#1E293B',
                style: { cursor: 'pointer' }
              }}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
