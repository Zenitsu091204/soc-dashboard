import React, { useState } from 'react';
import Card from '../common/Card';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const StatusIcon = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'active': return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
    case 'investigating': return <ClockIcon className="w-6 h-6 text-yellow-500" />;
    case 'resolved': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    default: return <ClockIcon className="w-6 h-6 text-slate-400" />;
  }
};

export default function CampaignTimeline({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(events[0] || null);

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-6">Campaign Timeline</h3>
      
      {/* Horizontal Timeline */}
      <div className="relative mb-8 pb-4 overflow-x-auto custom-scrollbar">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-700/50 min-w-[800px]"></div>
        <div className="flex justify-between min-w-[800px] px-4 space-x-8">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => setSelectedEvent(event)}
            >
              <div 
                className={`
                  z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 
                  transition-all duration-300
                  ${selectedEvent?.id === event.id 
                    ? 'bg-slate-900 border-indigo-500 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                    : 'bg-slate-800 border-slate-600 hover:border-slate-400'}
                `}
              >
                <div className={`w-3 h-3 rounded-full ${selectedEvent?.id === event.id ? 'bg-indigo-400' : 'bg-slate-500'}`} />
              </div>
              <span className="mt-3 text-xs font-bold text-slate-400 whitespace-nowrap">{event.date}</span>
              <span className={`text-xs mt-1 font-medium ${selectedEvent?.id === event.id ? 'text-indigo-400' : 'text-slate-500'}`}>
                {event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Details View */}
      {selectedEvent && (
        <div className="mt-4 p-6 rounded-xl bg-white/5 border border-white/5 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <StatusIcon status={selectedEvent.status} />
                <h4 className="text-xl font-bold text-white">{selectedEvent.title}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border bg-slate-800 ${
                  selectedEvent.severity === 'Critical' ? 'text-red-500 border-red-500/50' : 
                  selectedEvent.severity === 'High' ? 'text-orange-500 border-orange-500/50' : 
                  'text-blue-500 border-blue-500/50'
                }`}>
                  {selectedEvent.severity}
                </span>
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">{selectedEvent.description}</p>
              
              <div className="flex gap-4 text-sm text-slate-400">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase">Actor</span>
                  <span className="text-white">{selectedEvent.actor}</span>
                </div>
                 <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase">Status</span>
                  <span className="text-white">{selectedEvent.status}</span>
                </div>
                 <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase">Indicators</span>
                  <span className="text-white">{selectedEvent.indicators} IOCs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
