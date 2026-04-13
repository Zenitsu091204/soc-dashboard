import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ServerIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Utility to safely format dates (local display)
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function ThreatActorsPage({ hideHeader = false, importantOnly = false }) {
  const navigate = useNavigate();
  const [threatActors, setThreatActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchThreatActors = useCallback(async (pageNum = 1, isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    setError(null);
    try {
      const baseUrl = `/intel/threat-actors?page=${pageNum}&limit=12`;
      const url = importantOnly ? `${baseUrl}&important=true` : baseUrl;
      const { data } = await api.get(url);
      
      let newActors = [];
      if (data.data && data.meta) {
        newActors = data.data;
        setHasMore((pageNum * data.meta.limit) < data.meta.total);
      } else {
        newActors = data;
        setHasMore(false);
      }
      
      setThreatActors(prev => isLoadMore ? [...prev, ...newActors] : newActors);
    } catch (err) {
      console.error('Failed to fetch threat actors', err);
      setError('Failed to load threat actor data. Please try again.');
    } finally {
      if (!isLoadMore) setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchThreatActors(1, false);
  }, [fetchThreatActors, retryKey]);

  const filtered = useMemo(() => {
    return threatActors.filter((actor) => {
      const searchTerms = [
        actor.name,
        actor.origin,
        actor.type,
        actor.description,
      ].join(' ').toLowerCase();
      return searchTerms.includes(query.toLowerCase());
    });
  }, [threatActors, query]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="text-red-400 text-4xl">⚠</div>
        <p className="text-red-400 font-semibold">{error}</p>
        <button
          onClick={() => setRetryKey(prev => prev + 1)}
          className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pb-20 space-y-6">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
               <Link to="/" className="hover:text-indigo-400 transition-colors">Dashboard</Link>
               <span>/</span>
               <span className="text-slate-300">Threat Actors</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none mb-1">Adversary Intelligence</h1>
            <p className="text-slate-400 text-xs font-medium">Global threat profiles and attribution data</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setRetryKey(prev => prev + 1)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="relative flex-1 md:w-80">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search actors, origins, type..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Actor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((actor) => (
          <div
            key={actor.id}
            onClick={() => navigate(`/threat-actors/${actor.id}`)}
            className="p-6 rounded-3xl bg-slate-900/30 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            {/* Background Glow Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors" />

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center text-xl font-black text-indigo-400 group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:text-white transition-all transform group-hover:scale-105 duration-300 shadow-lg">
                  {actor.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors leading-tight">
                    {actor.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {actor.origin && (
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {actor.origin}
                      </span>
                    )}
                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                    <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-wider">
                      {actor.type || 'Campaign'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-6 min-h-[2.5rem] group-hover:text-slate-300 transition-colors">
              {actor.description || 'Global adversary specialized in persistent network exploitation.'}
            </p>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-slate-500 tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <ServerIcon className="w-3.5 h-3.5" />
                <span>Last Activity: {new Date(actor.lastSeen || actor.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-slate-700 group-hover:text-indigo-400 transition-all transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !query && (
        <div className="flex justify-center pt-8 mb-4">
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchThreatActors(nextPage, true);
            }}
            className="px-6 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-sm font-bold rounded-full transition-colors border border-indigo-500/30 shadow-lg"
          >
            Load More Adversaries
          </button>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-slate-900 border border-white/5 rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <GlobeAltIcon className="w-10 h-10 text-slate-700" />
          </div>
          <h2 className="text-xl font-bold text-slate-300 mb-2">No adversaries identified</h2>
          <p className="text-slate-500 text-sm max-w-sm">No threat actors matching &quot;{query}&quot; were found in our intelligence databases.</p>
          <button onClick={() => setQuery('')} className="mt-6 text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-200 transition-colors">Clear Search query</button>
        </div>
      )}
    </div>
  );
}
