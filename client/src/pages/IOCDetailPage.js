import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowLeftIcon, 
  GlobeAltIcon, 
  ServerIcon, 
  TagIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import LanRoundedIcon from '@mui/icons-material/LanRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import RadarRoundedIcon from '@mui/icons-material/RadarRounded';

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const SEV_STYLES = {
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]' },
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]' },
};

function getEnrichment(ioc) {
  return {
    country: 'Unknown',
    city: 'Unknown',
    asn: 'N/A',
    org: 'N/A',
    threat: 'Unclassified',
    malwareFamily: null,
    reportCount: 0,
    lastReported: 'Never',
    confidence: 0,
    tags: [],
  };
}

// ── Page Component ───────────────────────────────────────────────────────────
export default function IOCDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ioc, setIoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIoc = async () => {
      try {
        const { data } = await api.get(`/intel/iocs/${id}`);
        setIoc(data);
      } catch (err) {
        console.error('Failed to fetch IOC:', err);
        setError('Indicator not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchIoc();
  }, [id]);

  const enrich = useMemo(() => ioc ? getEnrichment(ioc) : {}, [ioc]);
  const sevKey = (ioc?.severity || 'low').toLowerCase();
  const sev = SEV_STYLES[sevKey] || SEV_STYLES.low;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !ioc) {
    return (
      <div className="p-8 text-center bg-slate-900/50 border border-white/5 rounded-3xl mt-12">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Error</h2>
        <p className="text-slate-400 mb-6">{error || 'Indicator details not available.'}</p>
        <button 
          onClick={() => navigate('/ioc-feed')}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-bold"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Navigation & Breadcrumbs */}
      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
        <Link to="/ioc-feed" className="hover:text-indigo-400 transition-colors">IOC Feed</Link>
        <span>/</span>
        <span className="text-slate-300">Indicator Detail</span>
      </div>

      {/* Hero Header Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-4 border-b-indigo-500/20">
          <button 
            onClick={() => navigate('/ioc-feed')}
            className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl transition-all border border-white/5"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-indigo-500/20 shadow-2xl">
            {ioc.type?.toLowerCase() === 'ip' ? (
              <GlobeAltIcon className="w-10 h-10 text-white" />
            ) : ioc.type?.toLowerCase() === 'hash' ? (
              <TagIcon className="w-10 h-10 text-white" />
            ) : (
              <ServerIcon className="w-10 h-10 text-white" />
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1.5">{ioc.type} Indicator</p>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter font-mono break-all">{ioc.value}</h1>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 px-6 py-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Detection Status</p>
            <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest border ${sev.bg} ${sev.text} ${sev.border} ${sev.glow}`}>
              {ioc.severity} SEVERITY
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Detailed Intelligence (Span 8) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Intelligence Overview */}
          <section className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
              <SecurityRoundedIcon className="text-lg" /> Intelligence Overview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <RadarRoundedIcon className="text-indigo-400" />
                   <span className="text-lg font-bold text-slate-200">{enrich.threat}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm">
                  This indicator has been correlated with <span className="text-indigo-400 font-bold">{enrich.malwareFamily || 'persistent threat'}</span> campaigns. 
                  Behavioral analysis suggests it is used for <span className="text-slate-200 font-semibold">{enrich.threat?.toLowerCase()}</span> activity across critical infrastructure sectors.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {enrich.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black rounded-lg border border-white/5 uppercase">#{t}</span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-6 border border-white/5 space-y-4">
                 <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-xs font-bold text-slate-500">Confidence Score</span>
                    <span className="text-xl font-black text-white">{enrich.confidence}%</span>
                 </div>
                 <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-xs font-bold text-slate-500">Known Malware</span>
                    <span className="text-xs font-black text-indigo-400">{enrich.malwareFamily || 'NONE'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Report Frequency</span>
                    <span className="text-xs font-black text-slate-200">{enrich.reportCount} Global Feeds</span>
                 </div>
              </div>
            </div>
          </section>

          {/* Infrastructure & Geography */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <GlobeAltIcon className="w-5 h-5 text-indigo-400" /> Geolocation
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                   <span className="text-xs font-bold text-slate-500">Origin Country</span>
                   <span className="text-sm font-black text-white">{enrich.country}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                   <span className="text-xs font-bold text-slate-500">City / Region</span>
                   <span className="text-sm font-bold text-slate-300">{enrich.city}</span>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 space-y-6">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <ServerIcon className="w-5 h-5 text-purple-400" /> Infrastructure
              </h3>
              <div className="space-y-4">
                <div className="text-left p-4 bg-white/5 rounded-2xl space-y-1">
                   <p className="text-[10px] font-black text-slate-600 uppercase">ASN Identification</p>
                   <p className="text-sm font-mono font-bold text-slate-300">{enrich.asn}</p>
                </div>
                <div className="text-left p-4 bg-white/5 rounded-2xl space-y-1">
                   <p className="text-[10px] font-black text-slate-600 uppercase">Organization / Registrar</p>
                   <p className="text-sm font-black text-slate-200">{enrich.org}</p>
                </div>
              </div>
            </section>
          </div>

        </div>

        {/* Right Column: Stats & Actions (Span 4) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Reputation Radial Chart Mock */}
          <section className="bg-indigo-950/20 border border-indigo-500/20 rounded-3xl p-8 text-center relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Reputation Pulse</p>
            
            <div className="relative inline-flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle className="text-slate-800/50" strokeWidth="12" stroke="currentColor" fill="transparent" r="74" cx="80" cy="80" />
                  <circle 
                    className={`${ioc.reputation > 70 ? 'text-red-500' : ioc.reputation > 40 ? 'text-orange-500' : 'text-emerald-500'}`} 
                    strokeWidth="12" 
                    strokeDasharray={464.7} 
                    strokeDashoffset={464.7 - (464.7 * ioc.reputation) / 100} 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="74" cx="80" cy="80" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{ioc.reputation}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase">Points</span>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Status</p>
                <p className={`text-xs font-black ${ioc.reputation > 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {ioc.reputation > 60 ? 'BLACKLIST' : 'CLEAN'}
                </p>
              </div>
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Reports</p>
                <p className="text-xs font-black text-slate-200">{enrich.reportCount}</p>
              </div>
            </div>
          </section>

          {/* Sighting History */}
          <section className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
              <ClockIcon className="w-5 h-5 text-indigo-400" /> Indicator History
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Discovery Sighting</p>
                  <p className="text-xs font-bold text-slate-200 font-mono tracking-tight">{formatDate(ioc.seenAt || ioc.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-3 h-3 rounded-full bg-slate-700 mt-1" />
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Last Reported Match</p>
                    <p className="text-xs font-bold text-slate-400 font-mono tracking-tight">{enrich.lastReported}</p>
                 </div>
              </div>
            </div>
          </section>

          {/* Pivot Actions */}
          <section className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 space-y-6">
            <h3 className="text-xs font-black text-rose-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <LanRoundedIcon className="text-lg" /> External correlation
            </h3>
            <div className="grid grid-cols-1 gap-3">
               <button className="flex items-center justify-between p-4 bg-slate-950/80 hover:bg-slate-900 rounded-2xl border border-white/5 group transition-all">
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-indigo-400 uppercase">VirusTotal Investigation</span>
                  <span className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-indigo-500 transition-colors" />
               </button>
               <button className="flex items-center justify-between p-4 bg-slate-950/80 hover:bg-slate-900 rounded-2xl border border-white/5 group transition-all">
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-rose-400 uppercase">OpenCTI Knowledge Base</span>
                  <span className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-rose-500 transition-colors" />
               </button>
               <button className="flex items-center justify-between p-4 bg-slate-950/80 hover:bg-slate-900 rounded-2xl border border-white/5 group transition-all">
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-emerald-400 uppercase">GreyNoise Search</span>
                  <span className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-emerald-500 transition-colors" />
               </button>
            </div>
          </section>

          <div className="text-center pt-4">
             <p className="text-[9px] text-slate-600 font-mono tracking-widest uppercase mb-1">Indicator Identity Hash</p>
             <p className="text-[9px] text-slate-700 font-mono italic break-all px-8 opacity-50">{ioc.id}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
