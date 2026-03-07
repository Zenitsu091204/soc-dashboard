import React from 'react';

export default function StatCard({ title, label, value, helper, icon: Icon, trend, severity }) {
  // Support both title and label (API uses title, mock used label)
  const displayLabel = label || title || '';
  
  // Dynamic color based on severity or value
  const getValueColor = () => {
    if (severity === 'critical') return 'text-red-500';
    if (severity === 'high') return 'text-orange-500';
    if (severity === 'medium') return 'text-yellow-500';
    if (severity === 'low') return 'text-green-500';
    
    // Safety check: ensure displayLabel is a string before calling toLowerCase
    if (value > 0 && String(displayLabel).toLowerCase().includes('alert')) return 'text-orange-500';
    
    return 'text-slate-200';
  };

  return (
    <div className="relative w-full h-full p-6 overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-800/10 backdrop-blur-md border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.9)] hover:border-indigo-500/50 group animate-fade-in before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-indigo-500 before:to-cyan-500">
      
      {/* Icon in top right */}
      {Icon && (
        <div className="absolute top-4 right-4 opacity-20 text-slate-100 transform group-hover:scale-110 transition-transform duration-300">
          <Icon style={{ fontSize: 32 }} />
        </div>
      )}

      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
        {displayLabel}
      </p>

      <h3 className={`text-4xl font-black leading-none ${getValueColor()}`}>
        {value !== undefined && value !== null && !Number.isNaN(value) 
          ? (typeof value === 'number' ? value.toLocaleString('en-US') : String(value)) 
          : '0'}
      </h3>

      {/* Trend indicator */}
      {(trend !== undefined && trend !== null) && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`text-xs font-bold ${trend > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-slate-500">
            vs last 7 days
          </span>
        </div>
      )}

      {helper && (
        <p className="text-sm text-slate-400 mt-3">
          {helper}
        </p>
      )}
    </div>
  );
}
