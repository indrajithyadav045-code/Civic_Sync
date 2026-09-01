import React from 'react';
import { Activity, Waves, Car, Lightbulb, Trash2, Siren, Droplet, Wind, Database } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const LiveCityEventStream: React.FC = () => {
  const { liveEvents } = useCivic();

  const getEventIcon = (cat: string) => {
    switch (cat) {
      case 'FLOOD': return <Waves className="w-3.5 h-3.5 text-cyan-400" />;
      case 'TRAFFIC': return <Car className="w-3.5 h-3.5 text-amber-400" />;
      case 'LIGHTING': return <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />;
      case 'WASTE': return <Trash2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'EMERGENCY': return <Siren className="w-3.5 h-3.5 text-red-400" />;
      case 'WATER': return <Droplet className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-950 text-red-300 border-red-500/40';
      case 'HIGH': return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'MEDIUM': return 'bg-blue-950 text-blue-300 border-blue-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
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
    <div className="rounded-2xl p-4 bg-[#0D111A] border border-slate-800 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-1">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
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
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition flex items-start space-x-2.5 text-xs"
          >
            <div className="p-1.5 rounded-lg bg-black/50 border border-white/5 shrink-0 mt-0.5">
              {getEventIcon(evt.category)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white line-clamp-1">{evt.title}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${getSeverityBadge(evt.severity)}`}>
                  {evt.severity}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 line-clamp-1">
                {evt.location}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                <span>{evt.source}</span>
                <span className="text-slate-400">{evt.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
