import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Utility to safely format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function ThreatActorsPage() {
  const [threatActors, setThreatActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchThreatActors = async () => {
      try {
        const { data } = await api.get('/intel/threat-actors');
        setThreatActors(data);
      } catch (error) {
        console.error('Failed to fetch threat actors', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreatActors();
  }, []);

  const filtered = useMemo(() => {
    return threatActors.filter((actor) => {
      const searchTerms = [
        actor.name,
        actor.origin,
        actor.type,
        actor.description
      ].join(' ').toLowerCase();
      return searchTerms.includes(query.toLowerCase());
    });
  }, [threatActors, query]);

  if (loading) {
     return <div className="text-white/50 p-6">Loading threat intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Threat Actors</h1>
          <p className="text-slate-400 mt-1">Global adversary profiles and attribution</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((actor) => (
          <div key={actor.id} className="p-5 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {actor.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {actor.origin && (
                    <span className="text-xs font-medium text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
                      {actor.origin}
                    </span>
                  )}
                  {actor.type && (
                     <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {actor.type}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">Last Seen</span>
                <span className="text-xs text-slate-300 font-mono">
                  {formatDate(actor.lastSeen || actor.updatedAt)}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4">
              {actor.description || 'No detailed description available.'}
            </p>

             <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
                <span>ID: {actor.id.substring(0, 8)}...</span>
                <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  View Profile &rarr;
                </button>
             </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No threat actors found matching "{query}"
        </div>
      )}
    </div>
  );
}
