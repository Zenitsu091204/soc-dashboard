import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';

export default function SeverityDonutChart({ data }) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Campaign Severity</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl ring-1 ring-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                        <span className="text-white font-bold text-sm">{data.name}</span>
                      </div>
                      <p className="text-slate-400 text-xs pl-4">
                        {`${data.value} Campaigns`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
