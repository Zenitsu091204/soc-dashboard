import * as React from 'react';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const MetricItem = ({ label, value, highlight = false }) => (
  <div className="flex-1 p-3 rounded-xl bg-white/5 text-center">
    <h4 className={`text-xl font-extrabold ${highlight ? 'text-rose-500' : 'text-white'}`}>
      {value}
    </h4>
    <span className="text-xs text-slate-400 block mt-1">
      {label}
    </span>
  </div>
);

// Custom SVG ring for SLA Compliance
const SlaRing = ({ value }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value > 90 ? 'text-green-500' : 'text-yellow-500';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-20 h-20 transform -rotate-90">
         <circle
          className="text-white/10"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
        <circle
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center top-0 left-0 right-0 bottom-0">
         <span className="text-[0.6rem] text-slate-400 leading-none">SLA</span>
         <span className="text-base font-bold text-white leading-tight">{value}%</span>
      </div>
    </div>
  );
};

export default function SlaPerformanceCard({ metrics = { 
  slaCompliance: 98, 
  avgResponseTime: '8m', 
  avgResolutionTime: '45m', 
  slaBreaches: 0,
  trend: '+2.4%',
  trendType: 'positive'
} }) {
  // if (!metrics) return null; // Removed early return

  return (
    <div className="p-6 h-full flex flex-col border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md shadow-lg transition-all duration-300 hover:border-green-500/30 hover:shadow-[0_8px_32px_rgba(34,197,94,0.15)]">
      <div className="mb-4 flex items-center gap-3">
        <SpeedIcon className="text-green-500" />
        <div>
          <h3 className="font-black text-lg text-white">
            Response Time & SLA
          </h3>
          <p className="text-white/60 text-sm mt-0.5">
            Operational efficiency in incident handling
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5">
        {/* Main Rings Section */}
        <div className="flex items-center justify-between px-2">
           <SlaRing value={metrics.slaCompliance} />

          <div className="text-right">
            <p className="text-slate-400 text-sm mb-1">Efficiency Trend</p>
             <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${metrics.trendType === 'negative' ? 'bg-rose-500/10 text-rose-500' : 'bg-green-500/10 text-green-500'}`}>
               {metrics.trendType === 'negative' ? <TrendingDownIcon style={{fontSize: 14}} /> : <TrendingUpIcon style={{fontSize: 14}} />}
               {metrics.trend}
             </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="flex gap-3">
          <MetricItem label="Avg Response" value={metrics.avgResponseTime} />
          <MetricItem label="Avg Resolution" value={metrics.avgResolutionTime} />
          <MetricItem label="Breaches" value={metrics.slaBreaches} highlight={metrics.slaBreaches > 0} />
        </div>
      </div>
    </div>
  );
}
