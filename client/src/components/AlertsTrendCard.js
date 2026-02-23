import * as React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SEV_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

function buildMultiSeriesData(alerts) {
  const buckets = new Map();

  alerts.forEach((a) => {
    const timeVal = a.timestamp || a.time;
    if (!timeVal) return;
    const d = new Date(timeVal);
    if (isNaN(d.getTime())) return;
    const key = d.toISOString().slice(0, 13); // hourly
    if (!buckets.has(key)) buckets.set(key, { key, critical: 0, high: 0, medium: 0, low: 0, total: 0 });
    const b = buckets.get(key);
    const sev = (a.severity || 'low').toLowerCase();
    b[sev] = (b[sev] || 0) + 1;
    b.total += 1;
    const hour = new Date(key + ':00:00Z');
    b.label = hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  return Array.from(buckets.values())
    .sort((a, b) => (a.key < b.key ? -1 : 1))
    .slice(-24); // last 24 hours max
}

function buildSeverityPie(alerts) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  alerts.forEach((a) => {
    const s = (a.severity || 'low').toLowerCase();
    if (counts[s] !== undefined) counts[s]++;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const MultiTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="bg-slate-900/95 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs min-w-[140px]">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            <span className="capitalize text-slate-300">{p.dataKey}</span>
          </span>
          <span className="font-bold text-white">{p.value}</span>
        </div>
      ))}
      <div className="border-t border-white/10 mt-2 pt-2 flex justify-between">
        <span className="text-slate-400">Total</span>
        <span className="font-bold text-indigo-400">{total}</span>
      </div>
    </div>
  );
};

// ─── Severity Mini Bars (right side panel) ────────────────────────────────────
const SeverityBars = ({ alerts }) => {
  const pie = buildSeverityPie(alerts);
  const total = pie.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div className="space-y-2 min-w-[120px]">
      {pie.map(({ name, value }) => (
        <div key={name}>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span className="capitalize font-medium" style={{ color: SEV_COLORS[name] }}>{name}</span>
            <span className="text-slate-400">{value}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(value / total) * 100}%`, background: SEV_COLORS[name] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AlertsTrendCard({ alerts = [], liveIndicator = false }) {
  const data = React.useMemo(() => buildMultiSeriesData(alerts), [alerts]);

  const trend = React.useMemo(() => {
    if (data.length < 2) return 0;
    const recent = data.slice(-6).reduce((s, d) => s + d.total, 0);
    const prior = data.slice(-12, -6).reduce((s, d) => s + d.total, 0);
    if (prior === 0) return 0;
    return Math.round(((recent - prior) / prior) * 100);
  }, [data]);

  const [chartMode, setChartMode] = React.useState('area'); // 'area' | 'bar'

  return (
    <div className="p-4 h-full flex flex-col border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]">

      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-white">Alerts Trend</h3>
            {liveIndicator && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs">Hourly volume by severity</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Chart mode toggle */}
          <div className="flex rounded-lg border border-white/10 overflow-hidden text-[11px]">
            {['area', 'bar'].map((m) => (
              <button
                key={m}
                onClick={() => setChartMode(m)}
                className={`px-3 py-1.5 capitalize font-medium transition-colors ${
                  chartMode === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {/* Trend badge */}
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
            trend > 0 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        </div>
      </div>

      {/* Main layout */}
        <div className="flex-1 flex gap-3 min-h-0">
        {/* Chart */}
        <div className="flex-1 min-h-[160px]">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No alert data for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'area' ? (
                <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    {Object.entries(SEV_COLORS).map(([sev, color]) => (
                      <linearGradient key={sev} id={`grad-${sev}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="label" stroke="#475569" tickLine={false} axisLine={false} style={{ fontSize: 10 }} />
                  <YAxis stroke="#475569" tickLine={false} axisLine={false} allowDecimals={false} style={{ fontSize: 10 }} />
                  <Tooltip content={<MultiTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                  {Object.entries(SEV_COLORS).map(([sev, color]) => (
                    <Area key={sev} type="monotone" dataKey={sev} stroke={color} strokeWidth={2}
                      fill={`url(#grad-${sev})`} stackId="1"
                      dot={false} activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
                      animationDuration={800} />
                  ))}
                </AreaChart>
              ) : (
                <BarChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="label" stroke="#475569" tickLine={false} axisLine={false} style={{ fontSize: 10 }} />
                  <YAxis stroke="#475569" tickLine={false} axisLine={false} allowDecimals={false} style={{ fontSize: 10 }} />
                  <Tooltip content={<MultiTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                  {Object.entries(SEV_COLORS).map(([sev, color]) => (
                    <Bar key={sev} dataKey={sev} stackId="a" fill={color} radius={sev === 'critical' ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                      animationDuration={700} />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Severity breakdown panel */}
        <div className="flex flex-col justify-center gap-4 border-l border-white/5 pl-4">
          <SeverityBars alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
