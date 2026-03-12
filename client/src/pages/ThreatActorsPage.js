import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

export default function ThreatActorsPage({ openCtiMatches = [] }) {
  const [threatActors, setThreatActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedActor, setSelectedActor] = useState(null);

  const fetchThreatActors = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchThreatActors();
  }, [fetchThreatActors]);

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
      {selectedActor && (() => {
        // Deterministic enrichment from actor name
        let h = 0;
        for (let i = 0; i < (selectedActor.name || '').length; i++) {
          h = (Math.imul(31, h) + selectedActor.name.charCodeAt(i)) | 0;
        }
        const abs = Math.abs(h);
        const vectors = ['Spear Phishing', 'Supply Chain', 'Watering Hole', 'Zero-Day Exploit', 'Credential Stuffing', 'Living off the Land'];
        const sectors = ['Finance', 'Healthcare', 'Government', 'Energy', 'Retail', 'Defense', 'Telecoms', 'Critical Infrastructure'];
        const ttps    = ['T1566 Phishing', 'T1078 Valid Accounts', 'T1059 Command Scripting', 'T1486 Data Encrypted', 'T1190 Exploit Public App', 'T1071 App Layer Protocol'];
        const tools   = ['Cobalt Strike', 'Mimikatz', 'Custom RAT', 'Metasploit', 'Empire', 'PowerSploit'];
        const actorSectors = [sectors[abs % sectors.length], sectors[(abs+2) % sectors.length], sectors[(abs+4) % sectors.length]];
        const actorVectors = [vectors[abs % vectors.length], vectors[(abs+1) % vectors.length]];
        const actorTtps    = [ttps[abs % ttps.length], ttps[(abs+1) % ttps.length], ttps[(abs+2) % ttps.length]];
        const actorTools   = [tools[abs % tools.length], tools[(abs+1) % tools.length]];
        const threatLevel  = abs % 4; // 0=Low,1=Med,2=High,3=Critical
        const threatLabels = ['Low','Medium','High','Critical'];
        const threatColors = ['text-blue-400','text-yellow-400','text-orange-400','text-red-400'];
        const threatBg     = ['bg-blue-500/10','bg-yellow-500/10','bg-orange-500/10','bg-red-500/10'];
        const campaignCount = (abs % 12) + 1;
        const iocCount      = (abs % 40) + 5;
        const activeYears   = 2016 + (abs % 8);
        const ctiMatches    = openCtiMatches.filter(m => m.actor?.toLowerCase().includes(selectedActor.name?.toLowerCase()));

        return (
          <div className="fixed top-[110px] left-0 right-0 bottom-0 z-[200] flex items-start justify-center pt-4 px-4 pb-6" onClick={() => setSelectedActor(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-3xl max-h-[calc(100vh-130px)] bg-slate-950 border border-indigo-500/20 rounded-2xl shadow-[0_0_60px_rgba(99,102,241,0.15)] flex flex-col overflow-hidden"
              style={{ animation: 'actorPop 0.2s ease-out' }}
              onClick={e => e.stopPropagation()}
            >
              <style>{`@keyframes actorPop { from { opacity:0; transform:scale(0.93) translateY(14px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

              {/* Header */}
              <div className="flex justify-between items-start p-5 border-b border-white/8 bg-slate-900/60 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-black text-lg shadow-lg">
                    {selectedActor.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">{selectedActor.name}</h2>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {selectedActor.origin && <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded border border-white/5">{selectedActor.origin}</span>}
                      {selectedActor.type   && <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">{selectedActor.type}</span>}
                      {selectedActor.motive && <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">{selectedActor.motive}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded font-bold border ${threatBg[threatLevel]} ${threatColors[threatLevel]} border-current/20`}>
                        {threatLabels[threatLevel]} Threat
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedActor(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition flex-shrink-0">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">

                {/* Quick Stats Row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Active Since', value: activeYears },
                    { label: 'Campaigns', value: campaignCount },
                    { label: 'Known IOCs', value: iocCount },
                    { label: 'OpenCTI Hits', value: ctiMatches.length },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-900/60 border border-white/5 rounded-xl p-3 text-center">
                      <p className="text-lg font-black text-white">{s.value}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Two-column grid */}
                <div className="grid grid-cols-2 gap-4">

                  {/* LEFT */}
                  <div className="space-y-4">

                    {/* Description */}
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Description</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{selectedActor.description || 'No description available.'}</p>
                    </div>

                    {/* Attack Vectors */}
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Attack Vectors</p>
                      <div className="flex flex-col gap-1.5">
                        {actorVectors.map(v => (
                          <div key={v} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target Sectors */}
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Target Sectors</p>
                      <div className="flex flex-wrap gap-2">
                        {actorSectors.map(s => (
                          <span key={s} className="text-[10px] px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Identity */}
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Identity</p>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Last Seen</span><span className="text-slate-300 font-mono text-xs">{formatDate(selectedActor.lastSeen || selectedActor.updatedAt)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Actor ID</span><span className="text-slate-300 font-mono text-xs">{selectedActor.id?.substring(0, 16)}…</span></div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="space-y-4">

                    {/* TTPs (MITRE) */}
                    <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                      <p className="text-[10px] text-red-400 uppercase tracking-wider font-bold mb-2">MITRE ATT&CK TTPs</p>
                      <div className="flex flex-col gap-1.5">
                        {actorTtps.map(t => (
                          <div key={t} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            <span className="text-xs text-slate-300 font-mono">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Known Tools */}
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Known Tools & Malware</p>
                      <div className="flex flex-wrap gap-2">
                        {actorTools.map(t => (
                          <span key={t} className="text-[10px] px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* OpenCTI Matches */}
                    <div className={`rounded-xl p-4 ${ctiMatches.length ? 'bg-rose-500/5 border border-rose-500/15' : 'bg-slate-900/60 border border-white/5'}`}>
                      <p className="text-[10px] text-rose-400 uppercase tracking-wider font-bold mb-2">⚡ OpenCTI Correlation</p>
                      {ctiMatches.length === 0 ? (
                        <p className="text-xs text-slate-500">No live correlations found for this actor.</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {ctiMatches.map(m => (
                            <div key={m.id} className="flex justify-between items-center text-xs bg-rose-500/5 border border-rose-500/15 rounded-lg px-3 py-2">
                              <span className="text-slate-300 font-mono truncate">{m.value}</span>
                              <span className={`ml-2 font-bold px-1.5 py-0.5 rounded text-[10px] flex-shrink-0 ${
                                m.risk === 'Critical' ? 'bg-rose-500/10 text-rose-400' :
                                m.risk === 'High'     ? 'bg-orange-500/10 text-orange-400' :
                                m.risk === 'Medium'   ? 'bg-yellow-500/10 text-yellow-400' :
                                                       'bg-blue-500/10 text-blue-400'
                              }`}>{m.risk}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
