import React, { useState, useEffect } from 'react';
import api from '../services/api';
// Icons
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ServerStackIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'; // v2 syntax

// Function to get the correct icon component based on source/type
const getIcon = (source) => {
  switch (source) {
    case 'Firewall':
      return <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />;
    case 'EDR':
      return <ServerStackIcon className="w-5 h-5 text-blue-400" />;
    case 'NDR':
      return <GlobeAltIcon className="w-5 h-5 text-indigo-400" />;
    case 'IAM':
      return <UserIcon className="w-5 h-5 text-purple-400" />;
    default:
      return <ExclamationTriangleIcon className="w-5 h-5 text-gray-400" />;
  }
};

// Function to map severity to color styles
const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'bg-red-500/10 text-red-500 border border-red-500/20';
    case 'high':
      return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
    case 'low':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  }
};

export default function RecentActivityFeed() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await api.get('/alerts');
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    // Optional: Poll every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
     return <div className="text-white/50 text-sm p-4">Loading activity...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white/90 font-display tracking-wide">
          Recent Activity
        </h2>
        <span className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors">
          View All
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="text-white/50 text-sm">No recent activity</div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="group p-3 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 hover:border-indigo-500/30 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                {/* Icon Container */}
                <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5 group-hover:border-indigo-500/20 transition-colors">
                  {getIcon(alert.source)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors truncate pr-2">
                       {alert.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 whitespace-nowrap bg-slate-900/50 px-1.5 py-0.5 rounded">
                      <ClockIcon className="w-3 h-3" />
                      {(() => {
                        const d = new Date(alert.timestamp);
                        return isNaN(d.getTime()) 
                          ? 'Unknown' 
                          : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      })()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-2 line-clamp-1">
                    {alert.description || `Detected on ${alert.entity} (${alert.sourceIp})`}
                  </p>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      {alert.severity?.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded-full bg-slate-900/50 border border-white/5">
                      {alert.source}
                    </span>
                    {alert.riskScore && (
                       <span className={`text-[10px] px-2 py-0.5 rounded-full bg-slate-900/50 border border-white/5 ${alert.riskScore > 80 ? 'text-red-400' : 'text-slate-400'}`}>
                         Risk: {alert.riskScore}
                       </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
