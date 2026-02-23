import React, { useEffect, useRef, useState } from 'react';
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ServerStackIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const getIcon = (source) => {
  switch (source) {
    case 'Firewall': return <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />;
    case 'EDR':      return <ServerStackIcon className="w-4 h-4 text-blue-400" />;
    case 'NDR':      return <GlobeAltIcon className="w-4 h-4 text-indigo-400" />;
    case 'IAM':      return <UserIcon className="w-4 h-4 text-purple-400" />;
    default:         return <ExclamationTriangleIcon className="w-4 h-4 text-slate-400" />;
  }
};

const SEV = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
  high:     'bg-orange-500/15 text-orange-400 border-orange-500/25',
  medium:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  low:      'bg-blue-500/15 text-blue-400 border-blue-500/25',
};

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// Single activity row — animates in when NEW
function ActivityRow({ alert, isNew }) {
  return (
    <div
      className={`group p-3 rounded-xl border transition-all duration-300
        ${isNew
          ? 'bg-indigo-500/10 border-indigo-500/30 animate-pulse-once'
          : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/70 hover:border-indigo-500/20'
        }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 rounded-lg bg-slate-900/60 border border-white/5 mt-0.5 flex-shrink-0">
          {getIcon(alert.source)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
              {alert.title}
            </h3>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 whitespace-nowrap flex-shrink-0">
              <ClockIcon className="w-3 h-3" />
              {timeAgo(alert.timestamp)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-1.5 line-clamp-1">
            {alert.description || `Entity: ${alert.entity || 'N/A'}`}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${SEV[(alert.severity || 'low').toLowerCase()] || SEV.low}`}>
              {(alert.severity || 'LOW').toUpperCase()}
            </span>
            {alert.source && (
              <span className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded-full">{alert.source}</span>
            )}
            {isNew && (
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">NEW</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RecentActivityFeed({ alerts: propAlerts = [] }) {
  const [newIds, setNewIds] = useState(new Set());
  const prevIdsRef = useRef(new Set());

  // Detect newly added alerts when prop updates
  useEffect(() => {
    const incoming = new Set(propAlerts.map((a) => a.id));
    const fresh = [...incoming].filter((id) => !prevIdsRef.current.has(id));
    if (fresh.length > 0) {
      setNewIds(new Set(fresh));
      setTimeout(() => setNewIds(new Set()), 5000); // reset after 5s
    }
    prevIdsRef.current = incoming;
  }, [propAlerts]);

  const sorted = [...propAlerts]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20);

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-white">Activity Feed</h2>
          <p className="text-[11px] text-slate-500">{sorted.length} recent events</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          AUTO
        </span>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1 min-h-0">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-600">
            <ShieldCheckIcon className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          sorted.map((alert) => (
            <ActivityRow
              key={alert.id}
              alert={alert}
              isNew={newIds.has(alert.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
