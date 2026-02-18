import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card from '../common/Card';

export default function CampaignTrendChart({ data }) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Campaign Activity Trend</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl ring-1 ring-indigo-500/20">
                      <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">{label}</p>
                      <p className="text-white font-bold text-sm">
                        {`${payload[0].value} New Campaigns`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="campaigns" 
              stroke="#6366F1" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#0f172a', stroke: '#6366F1', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#6366F1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
