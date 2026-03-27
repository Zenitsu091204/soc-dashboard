import * as React from 'react';

function getRiskColor(score) {
  if (score < 40) return 'text-emerald-400';
  if (score < 70) return 'text-amber-400';
  return 'text-red-500';
}

function getRiskGradient(score) {
  if (score < 40) return 'from-emerald-500 to-cyan-500';
  if (score < 70) return 'from-amber-400 to-orange-500';
  return 'from-red-500 to-rose-600';
}

export default function RiskScoreCard({ score = 72, trend = 5 }) {
  const rounded = Math.round(score);
  const barValue = Math.min(Math.max(score, 0), 100);
  const trendLabel = `${trend > 0 ? '+' : ''}${trend}%`;
  const trendColor = trend >= 0 ? 'text-red-400' : 'text-emerald-400';

  return (
    <div className="p-5 h-full flex flex-col justify-between border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md shadow-lg transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]">
      <div className="flex justify-between items-start">
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          OVERALL RISK SCORE
        </h3>
      </div>

      <div className="flex items-baseline gap-2 mt-4">
        <span className={`text-5xl font-black ${getRiskColor(score)}`}>
          {rounded}
        </span>
        <span className="text-sm text-slate-500 font-medium">/ 100</span>
      </div>

      <div className="mt-6 mb-2">
        {/* Progress Bar Background */}
        <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
          {/* Progress Bar Fill */}
          <div
            className={`h-full bg-gradient-to-r ${getRiskGradient(score)} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-1000 ease-out`}
            style={{ width: `${barValue}%` }}
          />
        </div>
        
        {trend !== null && trend !== undefined && (
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-slate-400 font-medium">Trend (7 days)</span>
            <span className={`text-xs font-bold ${trendColor}`}>
              {trendLabel}
            </span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
        Composite score based on current active threat volume, unmitigated critical alerts, and OpenCTI intelligence matches.
      </p>
    </div>
  );
}
