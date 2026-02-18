import * as React from 'react';
import HubIcon from '@mui/icons-material/Hub';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// Custom lightweight SVG gauge to replace MUI CircularProgress for better control
const ConfidenceGauge = ({ value }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value > 80 ? 'text-rose-500' : 'text-orange-500';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-10 h-10 transform -rotate-90">
        {/* Background Circle */}
        <circle
          className="text-white/10"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="20"
          cy="20"
        />
        {/* Progress Circle */}
        <circle
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="20"
          cy="20"
        />
      </svg>
      <span className="absolute text-[0.65rem] font-bold text-white">
        {value}%
      </span>
    </div>
  );
};

export default function OpenCtiMatchesCard({ matches = [] }) {
  return (
    <div className="p-6 h-full flex flex-col border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md shadow-lg transition-all duration-300 hover:border-rose-500/30 hover:shadow-[0_8px_32px_rgba(244,63,94,0.15)]">
      <div className="mb-4 flex items-center gap-3">
        <HubIcon className="text-rose-500" />
        <div>
          <h3 className="font-black text-lg text-white">
            OpenCTI Correlation Matches
          </h3>
          <p className="text-white/60 text-sm mt-0.5">
            Threat actor associations detected via OpenCTI
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {matches.map((match) => {
          const isCritical = match.risk === 'Critical';
          const riskStyles = isCritical 
            ? 'bg-rose-500/10 text-rose-500' 
            : 'bg-orange-300/10 text-orange-200';

          return (
            <div key={match.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ConfidenceGauge value={match.confidence} />
                <div>
                  <p className="text-sm font-bold text-slate-50">
                    {match.actor}
                  </p>
                  <p className="text-xs text-slate-400">
                    Matched: <span className="text-slate-300">{match.type}</span>
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                 <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[0.7rem] font-bold ${riskStyles}`}>
                   <VerifiedUserIcon style={{ fontSize: 12 }} /> {match.risk} Risk
                 </span>
              </div>
            </div>
          );
        })}
         {matches.length === 0 && (
           <p className="text-slate-400 text-sm text-center mt-8">
             No OpenCTI correlations found.
           </p>
        )}
      </div>
    </div>
  );
}
