import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div 
      className={`
        relative p-6 h-full flex flex-col 
        rounded-2xl 
        bg-gradient-to-br from-slate-800/40 to-slate-800/10 
        backdrop-blur-md 
        border border-white/5 
        overflow-hidden
        transition-all duration-300 
        hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.9)] hover:border-indigo-500/50 
        group animate-fade-in 
        before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-indigo-500 before:to-cyan-500
        ${className}
      `}
    >
      {children}
    </div>
  );
}
