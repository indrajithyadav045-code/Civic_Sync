import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  UserCheck, 
  ArrowRight, 
  Cpu,
  Layers,
  Building,
  FileText
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const CitizenCaseTracker: React.FC = () => {
  const { incidents, selectedIncident, setSelectedIncident, setActiveView, playSound } = useCivic();
  const [searchId, setSearchId] = useState(selectedIncident ? selectedIncident.id : 'CS-7421');

  const incident = incidents.find(i => i.id.toLowerCase() === searchId.toLowerCase()) || selectedIncident || incidents[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = incidents.find(i => i.id.toLowerCase().includes(searchId.toLowerCase()));
    if (found) {
      setSelectedIncident(found);
      playSound('beep');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>GREATER CHENNAI CORPORATION • PUBLIC GRIEVANCE REDRESSAL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            Real-Time Grievance Tracking & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Transparent, tamper-proof tracking of your civic incident with live officer telemetry.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Grievance ID (e.g. CS-7421)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="px-3.5 py-2 rounded border border-slate-300 focus:border-blue-600 text-xs font-mono text-slate-900 outline-none w-48 bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-[#0f2a4a] hover:bg-[#1a3860] text-white text-xs font-semibold transition"
          >
            Track
          </button>
        </form>
      </div>

      {/* Case Overview Card */}
      <div className="gov-card rounded-lg p-6 bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center space-x-2 font-mono text-xs mb-1">
              <span className="text-blue-900 font-bold text-base">GRIEVANCE #{incident.id}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800 border border-slate-200 font-bold">
                {incident.severity} PRIORITY
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-green-50 text-green-800 border border-green-200 font-semibold">
                {incident.duplicates.length} MERGED CITIZEN PINGS
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
              {incident.title}
            </h2>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{incident.locationName}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveView('resolution_verification')}
              className="px-3.5 py-2 rounded bg-green-50 hover:bg-green-100 text-green-900 border border-green-200 text-xs font-semibold transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
              <span>Inspect Resolution Proof</span>
            </button>
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="space-y-4 pt-1">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Verified Resolution Pipeline:
          </div>

          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {incident.timeline.map((item, idx) => (
              <div key={idx} className="relative flex items-start space-x-3.5 pl-0.5">
                <div className={`relative z-10 p-1 rounded-full border transition ${
                  item.completed 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : item.active 
                      ? 'bg-blue-800 border-blue-800 text-white' 
                      : 'bg-white border-slate-300 text-slate-300'
                }`}>
                  {item.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : item.active ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-3.5 h-3.5 block rounded-full" />
                  )}
                </div>

                <div className={`flex-1 p-3.5 rounded-lg border transition ${
                  item.active 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : item.completed 
                      ? 'bg-slate-50 border-slate-200' 
                      : 'bg-white border-slate-100 opacity-50'
                }`}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-bold ${item.active ? 'text-blue-900' : 'text-slate-800'}`}>
                      {item.stage}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Officer Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs">
          <div className="p-3 rounded bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Assigned Field Unit</span>
            <div className="flex items-center space-x-2 text-slate-900 font-bold mt-0.5">
              <Truck className="w-3.5 h-3.5 text-blue-700" />
              <span>{incident.assignedTeam || 'GCC Rapid Unit Alpha-4'}</span>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Officer in Charge</span>
            <div className="flex items-center space-x-2 text-slate-900 font-bold mt-0.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>{incident.assignedOfficer || 'Capt. R. Selvam'}</span>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Dynamic SLA Remaining</span>
            <div className="flex items-center space-x-2 text-amber-800 font-bold font-mono mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {Math.floor(incident.sla.remainingSeconds / 3600)}h {Math.floor((incident.sla.remainingSeconds % 3600) / 60)}m remaining
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
