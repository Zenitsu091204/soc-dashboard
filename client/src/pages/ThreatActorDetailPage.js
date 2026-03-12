import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowLeftIcon, 
  GlobeAltIcon, 
  ServerIcon, 
  UserGroupIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LanRoundedIcon from '@mui/icons-material/LanRounded';

// ── Helpers ─────────────────────────────────────────────────────────────────
const SECTOR_ICONS = {
  Financial: <BriefcaseIcon className="w-4 h-4" />,
  Government: <AcademicCapIcon className="w-4 h-4" />,
  Healthcare: <ShieldCheckIcon className="w-4 h-4" />,
  Energy: <ServerIcon className="w-4 h-4" />,
  Telecommunications: <GlobeAltIcon className="w-4 h-4" />,
};

const THREAT_LEVELS = {
  Critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]' },
  High: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]' },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]' },
  Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]' },
};

// Expanded Mock Data Generator (Deterministic)
function getExtendedActorData(actor) {
  if (!actor) return {};
  let h = 0;
  for (let i = 0; i < (actor.name || '').length; i++) {
    h = (Math.imul(31, h) + actor.name.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(h);
  
  const origins = ['Russia', 'China', 'North Korea', 'Iran', 'Eastern Europe', 'Vietnam', 'Unknown'];
  const motives = ['Espionage', 'Financial Gain', 'Disruption', 'Political Influence', 'State Sponsored'];
  const sectors = ['Financial', 'Government', 'Healthcare', 'Energy', 'Telecommunications', 'Defense'];
  const vectors = ['Spear Phishing', 'Supply Chain Attack', 'Zero-day Exploits', 'Credential Stuffing', 'Ransomware-as-a-Service'];
  const malwares = ['Cobalt Strike', 'Mimikatz', 'PlugX', 'ShadowPad', 'Emotet', 'Qakbot'];
  const techniques = ['T1566.001', 'T1190', 'T1071.001', 'T1059.001', 'T1003.001'];

  return {
    origin: origins[abs % origins.length],
    motive: motives[abs % motives.length],
    sectors: sectors.slice(abs % 3, (abs % 3) + 3),
    vectors: vectors.slice(abs % 2, (abs % 2) + 3),
    malware: malwares.slice(abs % 4, (abs % 4) + 2),
    techniques: techniques.slice(abs % 3, (abs % 3) + 4),
    campaignCount: (abs % 15) + 5,
    iocCount: (abs % 200) + 45,
    activityPeriod: `201${abs % 9} - Present`,
    intensity: Array.from({ length: 12 }, (_, i) => Math.sin(abs + i) * 10 + 20),
  };
}

// ── Page Component ───────────────────────────────────────────────────────────
export default function ThreatActorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [openCtiMatches, setOpenCtiMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actorRes, ctiRes] = await Promise.all([
          api.get(`/intel/threat-actors/${id}`),
          api.get('/intel/opencti-matches')
        ]);
        setActor(actorRes.data);
        setOpenCtiMatches(ctiRes.data || []);
      } catch (err) {
        console.error('Failed to fetch Actor data:', err);
        setError('Actor profile not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const extended = useMemo(() => actor ? getExtendedActorData(actor) : {}, [actor]);
  const ctiMatches = useMemo(() => 
    actor ? openCtiMatches.filter(m => m.actor?.toLowerCase().includes(actor.name?.toLowerCase())) : [],
    [actor, openCtiMatches]
  );
  
  const levelKey = actor?.threatLevel || 'Medium';
  const level = THREAT_LEVELS[levelKey] || THREAT_LEVELS.Medium;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !actor) {
    return (
      <div className="p-8 text-center bg-slate-900/50 border border-white/5 rounded-3xl mt-12">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Error</h2>
        <p className="text-slate-400 mb-6">{error || 'Actor profile not available.'}</p>
        <button 
          onClick={() => navigate('/threat-actors')}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-bold"
        >
          Return to List
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Navigation & Breadcrumbs */}
      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
        <Link to="/threat-actors" className="hover:text-indigo-400 transition-colors">Threat Actors</Link>
        <span>/</span>
        <span className="text-slate-300">Sophisticated Adversary Profile</span>
      </div>

      {/* Profile Header Hero */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
          <button 
            onClick={() => navigate('/threat-actors')}
            className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl transition-all border border-white/5"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>

          <div className="relative">
             <div className="w-24 h-24 rounded-3xl bg-slate-950 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                <div className={`w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center`}>
                   <UserGroupIcon className="w-12 h-12 text-indigo-400" />
                </div>
             </div>
             <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center bg-slate-950 ${level.glow}`}>
                <div className={`w-3 h-3 rounded-full animate-pulse ${level.color.replace('text', 'bg')}`} />
             </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
               <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">{actor.type || 'ADVANCED THREAT'}</span>
               <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${level.bg} ${level.color} ${level.border}`}>{levelKey} THREAT LEVEL</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-1">{actor.name}</h1>
            <p className="text-slate-500 text-sm font-bold flex items-center justify-center md:justify-start gap-2 italic">
               <GlobeAltIcon className="w-4 h-4" /> Origin: {extended.origin} • Active Since {extended.activityPeriod.split('-')[0]}
            </p>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4 px-8 border-l border-white/5">
             <div className="text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Campaigns</p>
                <p className="text-2xl font-black text-white">{extended.campaignCount}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Linked IOCs</p>
                <p className="text-2xl font-black text-white">{extended.iocCount}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Intelligence Matrix (Span 8) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
           
           {/* Operational Profile */}
           <section className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden">
               <div className="p-8 space-y-6">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <DescriptionRoundedIcon className="text-lg" /> Operational Profile
                  </h3>
                  <div className="bg-slate-950/60 rounded-2xl p-6 border border-white/5">
                     <p className="text-slate-300 leading-relaxed text-sm italic">
                        "{actor.description || `Highly organized and resource-rich threat group primarily focused on ${extended.motive?.toLowerCase()} campaigns against critical infrastructure.`}"
                     </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Primary Motive</p>
                        <p className="text-sm font-black text-indigo-400">{extended.motive}</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Operational Area</p>
                        <p className="text-sm font-black text-slate-200">{extended.origin}</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Active Window</p>
                        <p className="text-sm font-black text-slate-200">{extended.activityPeriod}</p>
                     </div>
                  </div>
               </div>
           </section>

           {/* Capabilities Matrix */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 space-y-6">
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <ServerIcon className="w-5 h-5 text-orange-400" /> Attack Vectors
                 </h3>
                 <div className="space-y-3">
                    {extended.vectors.map(v => (
                       <div key={v} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                          <span className="text-xs font-bold text-slate-300">{v}</span>
                       </div>
                    ))}
                 </div>
              </section>

              <section className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 space-y-6">
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <GlobeAltIcon className="w-5 h-5 text-rose-400" /> Target Sectors
                 </h3>
                 <div className="flex flex-wrap gap-3">
                    {extended.sectors.map(s => (
                       <div key={s} className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                          <span className="text-rose-400">{SECTOR_ICONS[s] || <ServerIcon className="w-4 h-4" />}</span>
                          <span className="text-[10px] font-black text-rose-200 uppercase">{s}</span>
                       </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Campaign Intensity History */}
           <section className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                 <TimelineRoundedIcon className="text-lg" /> Campaign Intensity (12 Months)
              </h3>
              <div className="h-32 flex items-end justify-between gap-2 px-4">
                 {extended.intensity.map((val, i) => (
                    <div 
                       key={i} 
                       className="flex-1 bg-gradient-to-t from-indigo-600/40 to-indigo-400/80 rounded-t-sm hover:from-indigo-500 transition-all cursor-crosshair group relative"
                       style={{ height: `${val * 2}%` }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[8px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Month {i + 1}: {Math.round(val)} Evt
                       </div>
                    </div>
                 ))}
              </div>
           </section>

        </div>

        {/* Right Column: Toolkit & Intel (Span 4) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           
           {/* Adversary Toolbox */}
           <section className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                 <TuneRoundedIcon className="text-lg" /> Adversary Toolbox
              </h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Malware & Utilities</p>
                    <div className="flex flex-wrap gap-2">
                       {extended.malware.map(m => (
                          <span key={m} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black rounded-lg uppercase">{m}</span>
                       ))}
                    </div>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">MITRE ATT&CK® Techniques</p>
                    <div className="grid grid-cols-2 gap-2">
                       {extended.techniques.map(t => (
                          <div key={t} className="p-2 bg-slate-950/80 border border-white/5 rounded-lg text-center">
                             <span className="text-[10px] font-mono font-bold text-slate-400">{t}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </section>

           {/* Live Intel Correlation */}
           <section className="bg-rose-950/10 border border-rose-500/20 rounded-3xl p-8 space-y-6 backdrop-blur-xl group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-rose-500/10 transition-colors" />
              <h3 className="text-xs font-black text-rose-400 uppercase tracking-[0.3em] flex items-center gap-3">
                 <LanRoundedIcon className="text-lg" /> OpenCTI Correlations
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                 {ctiMatches.length === 0 ? (
                    <div className="text-center py-8">
                       <ShieldCheckIcon className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No Active Matches</p>
                    </div>
                 ) : (
                    ctiMatches.map((match, idx) => (
                       <div key={idx} className="p-4 bg-slate-950/80 border border-white/5 rounded-2xl hover:border-rose-500/30 transition-all space-y-3 group/item">
                          <div className="flex justify-between items-start">
                             <div className="text-[10px] font-black text-rose-400 uppercase tracking-tighter">Correlation match</div>
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${match.risk === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {match.risk} Risk
                             </span>
                          </div>
                          <p className="text-xs font-bold text-slate-300 line-clamp-2 leading-relaxed">{match.description}</p>
                          <div className="pt-2 flex justify-between items-center border-t border-white/5">
                             <span className="text-[9px] text-slate-600 font-mono italic">CTI-OBJ-{idx + 10}</span>
                             <button className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">View Intel</button>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </section>

           <div className="text-center pt-4">
              <p className="text-[9px] text-slate-600 font-mono tracking-widest uppercase mb-1">Last Database Update</p>
              <p className="text-[9px] text-slate-700 font-mono italic">{new Date(actor.updatedAt || actor.lastSeen).toISOString()}</p>
           </div>

        </div>
      </div>
    </div>
  );
}
