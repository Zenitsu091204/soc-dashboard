import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Utility to safely format dates (local display)
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
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedActor, setSelectedActor] = useState(null);

  const fetchThreatActors = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/intel/threat-actors');
      setThreatActors(data);
    } catch (err) {
      console.error('Failed to fetch threat actors', err);
      setError('Failed to load threat actor data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreatActors();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    return <div className="text-white/50 p-6">Loading threat intelligence...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="text-red-400 text-4xl">⚠</div>
        <p className="text-red-400 font-semibold">{error}</p>
        <button
          onClick={fetchThreatActors}
          className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Actor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((actor) => (
          <div
            key={actor.id}
            className="p-5 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group"
          >
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
              <span>ID: {actor.id ? actor.id.substring(0, 8) + '…' : 'N/A'}</span>
              <button
                onClick={() => setSelectedActor(actor)}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                View Profile →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No threat actors found matching &quot;{query}&quot;
        </div>
      )}

      {/* Profile Detail Modal */}
      {selectedActor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-start p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedActor.name}</h2>
                <div className="flex gap-2 mt-1">
                  {selectedActor.origin && (
                    <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded">
                      {selectedActor.origin}
                    </span>
                  )}
                  {selectedActor.type && (
                    <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                      {selectedActor.type}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedActor(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedActor.description || 'No description available.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Last Seen</p>
                  <p className="text-sm text-slate-300 font-mono">
                    {formatDate(selectedActor.lastSeen || selectedActor.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Actor ID</p>
                  <p className="text-sm text-slate-300 font-mono">
                    {selectedActor.id ? selectedActor.id.substring(0, 16) + '…' : 'N/A'}
                  </p>
                </div>
              </div>
              {selectedActor.motive && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Motive</p>
                  <p className="text-sm text-slate-300">{selectedActor.motive}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
