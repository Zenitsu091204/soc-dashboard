import * as React from 'react';
import WarningIcon from '@mui/icons-material/Warning';

export default function WafRulesCard({ rules = [] }) {
  return (
    <div className="p-6 h-full flex flex-col border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md shadow-lg transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_8px_32px_rgba(34,211,238,0.15)]">
      <div className="mb-4 flex items-center gap-3">
        <WarningIcon className="text-cyan-400" />
        <div>
          <h3 className="font-black text-lg text-white">
            Top Triggered WAF Rules
          </h3>
          <p className="text-white/60 text-sm mt-0.5">
            Most common blocked attack patterns in last 7 days
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {rules.map((rule) => {
          // Custom progress bar calculation
          const percentage = Math.min(100, Math.max(0, rule.progress));
          
          return (
            <div key={rule.id}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-semibold text-slate-200">
                  {rule.name}
                </span>
                <span className="text-xs text-slate-400">
                  {rule.id} • <span className="text-white font-bold">{rule.count}</span>
                </span>
              </div>
              
              {/* Custom Linear Progress */}
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {rules.length === 0 && (
           <p className="text-slate-400 text-sm text-center mt-8">
             No WAF triggers detected.
           </p>
        )}
      </div>
    </div>
  );
}
