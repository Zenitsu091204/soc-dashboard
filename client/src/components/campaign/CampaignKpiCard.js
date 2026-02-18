import React from 'react';
import Card from '../common/Card';

export default function CampaignKpiCard({ title, value, icon: Icon, color = 'text-white' }) {
  return (
    <Card className="items-center justify-center text-center group">
       {Icon && (
        <div className={`p-4 rounded-full bg-white/5 mb-4 group-hover:bg-white/10 transition-colors`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      )}
      <h3 className="text-4xl font-black text-white tracking-tight">
        {value}
      </h3>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">
        {title}
      </p>
    </Card>
  );
}
