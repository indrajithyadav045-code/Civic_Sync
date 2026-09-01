import React from 'react';
import { Activity, Waves, Car, Lightbulb, Trash2, Siren, Droplet, Wind, Database } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const LiveCityEventStream: React.FC = () => {
  const { liveEvents } = useCivic();

  const getEventIcon = (cat: string) => {
    switch (cat) {
      case 'FLOOD': return <Waves className="w-3.5 h-3.5 text-blue-700" />;
      case 'TRAFFIC': return <Car className="w-3.5 h-3.5 text-amber-700" />;
      case 'LIGHTING': return <Lightbulb className="w-3.5 h-3.5 text-yellow-600" />;
      case 'WASTE': return <Trash2 className="w-3.5 h-3.5 text-emerald-700" />;
      case 'EMERGENCY': return <Siren className="w-3.5 h-3.5 text-red-700" />;
      case 'WATER': return <Droplet className="w-3.5 h-3.5 text-cyan-700" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-700" />;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM': return 'bg-blue-50 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const provenance = {
    source: 'WebSocket /ws/city Ingestion Stream',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 1000,
    providerName: 'FastAPI / PostgreSQL Event Bus'
  };

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Live City Event Stream
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Events List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {liveEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-2 rounded bg-slate-50 border border-slate-200 hover:border-blue-400 transition flex items-start space-x-2.5 text-xs"
          >
            <div className="p-1 rounded bg-white border border-slate-200 shrink-0 mt-0.5">
              {getEventIcon(evt.category)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                <span>{evt.timestamp}</span>
                <span className={`px-1.5 py-0.2 rounded font-bold border ${getSeverityBadge(evt.severity)}`}>
                  {evt.severity}
                </span>
              </div>
              <div className="font-semibold text-slate-900 line-clamp-1">{evt.title}</div>
              <div className="text-[11px] text-slate-500 truncate">{evt.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
