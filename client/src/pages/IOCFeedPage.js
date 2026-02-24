import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Utility to safely format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};


export default function IOCFeedPage() {
  const [iocs, setIocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchIocs = async () => {
      try {
        const { data } = await api.get('/intel/iocs');
        setIocs(data);
      } catch (err) {
        console.error('Failed to fetch IOCs', err);
        setError('Failed to load IOC feed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchIocs();
  }, []);

  const filtered = useMemo(() => {
    return iocs.filter((ioc) => {
      const matchesType = typeFilter === 'all' || ioc.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesQuery = ioc.value.toLowerCase().includes(query.toLowerCase()) || 
                           ioc.type.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [iocs, query, typeFilter]);

  if (loading) return <div className="text-white/50 p-6">Loading IOC feed...</div>;

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="text-red-400 text-4xl">⚠</div>
      <p className="text-red-400 font-semibold">{error}</p>
      <button
        onClick={() => { setError(null); setLoading(true); }}
        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
      >Retry</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">IOC Feed</h1>
          <p className="text-slate-400 mt-1">Indicators of Compromise and Reputation Scores</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
             <input
               type="text"
               placeholder="Search IOCs..."
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
             />
           </div>
           
           <div className="relative w-32">
             <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <select 
               value={typeFilter}
               onChange={(e) => setTypeFilter(e.target.value)}
               className="w-full pl-9 pr-8 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:border-indigo-500/50"
             >
               <option value="all">All Types</option>
               <option value="ip">IP</option>
               <option value="domain">Domain</option>
               <option value="hash">Hash</option>
               <option value="url">URL</option>
             </select>
           </div>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-white/5">
           <div className="col-span-2">Type</div>
           <div className="col-span-5">Value</div>
           <div className="col-span-2">Reputation</div>
           <div className="col-span-3 text-right">First Seen</div>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No IOCs found</div>
          ) : (
            filtered.map((ioc) => {
              return (
                <div key={ioc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group">
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-700/50 text-slate-300 border border-white/5">
                      {ioc.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-5 font-mono text-sm text-slate-300 truncate" title={ioc.value}>
                    {ioc.value}
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${ioc.reputation > 70 ? 'bg-red-500' : (ioc.reputation > 40 ? 'bg-orange-500' : 'bg-green-500')}`} 
                        style={{ width: `${ioc.reputation || 0}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-bold ${ioc.reputation > 70 ? 'text-red-400' : 'text-slate-400'}`}>
                      {ioc.reputation}
                    </span>
                  </div>
                  <div className="col-span-3 text-right text-sm text-slate-400">
                    {formatDate(ioc.seenAt || ioc.createdAt)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
