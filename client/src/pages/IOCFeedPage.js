import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  GlobeAltIcon,
  ShieldExclamationIcon,
  ClockIcon,
  ServerIcon,
  TagIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function IOCFeedPage({ hideHeader = false }) {
  const navigate = useNavigate();
  const [iocs, setIocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
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
  }, [retryKey]);

  // Combined filtering logic
  const filteredIocs = useMemo(() => {
    return iocs.filter((ioc) => {
      const matchesSearch = ioc.value?.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === 'all' || ioc.type?.toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [iocs, query, typeFilter]);

  if (loading) return <div className="text-white/50 p-6 flex items-center justify-center min-h-[400px]">
    <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
  </div>;

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="text-red-400 text-4xl">⚠</div>
      <p className="text-red-400 font-semibold">{error}</p>
      <button
        onClick={() => setRetryKey((k) => k + 1)}
        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
      >Retry</button>
    </div>
  );

  return (
    <div className="p-6 pb-20 space-y-6">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
               <Link to="/" className="hover:text-indigo-400 transition-colors">Dashboard</Link>
               <span>/</span>
               <span className="text-slate-300">Threat Intel Feed</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Indicators of Compromise</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setRetryKey(prev => prev + 1)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search indicator (IP, hash, URL)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        {/* Type Filter */}
        <div className="flex bg-slate-900/50 border border-white/10 rounded-xl p-1">
          {['all', 'IP', 'HASH', 'URL'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === type 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* IOC Table */}
      <div className="bg-slate-900/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Indicator</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Confidence</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">First Seen</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredIocs.map((ioc) => (
                <tr 
                  key={ioc.id} 
                  className="group hover:bg-white/[0.02] cursor-pointer transition-all border-l-2 border-l-transparent hover:border-l-indigo-500"
                  onClick={() => navigate(`/ioc-feed/${ioc.id}`)}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                        {ioc.type?.toLowerCase() === 'ip' ? (
                          <GlobeAltIcon className="w-5 h-5 text-indigo-400" />
                        ) : ioc.type?.toLowerCase() === 'hash' ? (
                          <TagIcon className="w-5 h-5 text-orange-400" />
                        ) : (
                          <ServerIcon className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors font-mono break-all">{ioc.value}</div>
                        <div className="text-[10px] font-black text-slate-600 mt-1 uppercase tracking-widest">{ioc.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1.5 max-w-[120px] mx-auto">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            ioc.confidence > 70 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                            ioc.confidence > 40 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 
                            'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                          }`}
                          style={{ width: `${ioc.confidence}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-500">{ioc.confidence} / 100</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="text-xs font-bold text-slate-300 font-mono">
                      {new Date(ioc.seenAt || ioc.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-[9px] font-black text-slate-600 uppercase mt-0.5">UTC TIME</div>
                  </td>
                  <td className="px-4 py-5 text-right">
                    <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-all transform group-hover:translate-x-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredIocs.length === 0 && !loading && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                 <FunnelIcon className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-bold">No indicators matching your filters</p>
              <button onClick={() => {setQuery(''); setTypeFilter('all')}} className="mt-4 text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
