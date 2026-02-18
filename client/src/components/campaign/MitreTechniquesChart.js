import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import Card from '../common/Card';

export default function MitreTechniquesChart({ data }) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Top MITRE ATT&CK Techniques</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={140}
              tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl ring-1 ring-indigo-500/20">
                      <p className="text-white font-bold mb-1 text-sm">{label || payload[0].payload.name}</p>
                      <p className="text-indigo-400 text-xs font-semibold">
                        {`Count: ${payload[0].value}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8B5CF6' : '#6366F1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
