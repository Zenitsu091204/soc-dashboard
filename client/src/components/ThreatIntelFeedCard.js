import * as React from 'react';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import PublicIcon from '@mui/icons-material/Public'; // Domain/URL
import RouterIcon from '@mui/icons-material/Router'; // IP
import TagIcon from '@mui/icons-material/Tag'; // Hash

const getIcon = (type) => {
  switch (type) {
    case 'IP': return <RouterIcon className="text-lg text-purple-500" />;
    case 'Domain':
    case 'URL': return <PublicIcon className="text-lg text-blue-500" />;
    case 'Hash': return <TagIcon className="text-lg text-orange-500" />;
    default: return <PublicIcon className="text-lg" />;
  }
};

const getSeverityStyles = (severity) => {
  switch (severity.toLowerCase()) {
    case 'critical': return { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-500' };
    case 'high': return { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-500' };
    case 'medium': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-500' };
    case 'low': return { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-500' };
    default: return { bg: 'bg-slate-400/20', border: 'border-slate-400/40', text: 'text-slate-400' };
  }
};

export default function ThreatIntelFeedCard({ feed = [] }) {
  return (
    <div className="p-6 h-full flex flex-col border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-800/70 rounded-2xl backdrop-blur-md shadow-lg transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)]">
       <div className="mb-4 flex items-center gap-3">
        <RssFeedIcon className="text-purple-500" />
        <div>
          <h3 className="font-black text-lg text-white">
            Recent Indicators
          </h3>
          <p className="text-white/60 text-sm mt-0.5">
            New IOCs synced automatically from MISP
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {feed.map((item) => {
          const styles = getSeverityStyles(item.severity);
          
          return (
            <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 flex items-center justify-center">
                  {getIcon(item.type)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {item.value}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.type} • {item.time}
                  </p>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded text-[0.7rem] font-bold border ${styles.bg} ${styles.border} ${styles.text}`}>
                {item.severity}
              </span>
            </div>
          );
        })}
        {feed.length === 0 && (
           <p className="text-slate-400 text-sm text-center mt-8">
             No recent threat intel updates.
           </p>
        )}
      </div>
    </div>
  );
}
