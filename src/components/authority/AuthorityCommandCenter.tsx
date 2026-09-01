import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowRight, 
  ChevronRight, 
  Cpu, 
  MapPin, 
  Shield, 
  Users,
  Search,
  Filter,
  Building
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { IncidentStatus, Incident } from '../../types';

const KANBAN_COLUMNS: { id: IncidentStatus; label: string; color: string }[] = [
  { id: 'NEW', label: '1. NEW GRIEVANCES', color: 'border-slate-300 text-slate-700 bg-slate-100' },
  { id: 'AI_TRIAGED', label: '2. AI TRIAGED', color: 'border-blue-300 text-blue-900 bg-blue-50' },
  { id: 'ASSIGNED', label: '3. SQUAD ASSIGNED', color: 'border-indigo-300 text-indigo-900 bg-indigo-50' },
  { id: 'IN_PROGRESS', label: '4. IN REMEDIATION', color: 'border-amber-300 text-amber-900 bg-amber-50' },
  { id: 'RESOLVED', label: '5. AUDITED & RESOLVED', color: 'border-green-300 text-green-900 bg-green-50' },
];

export const AuthorityCommandCenter: React.FC = () => {
  const { 
    incidents, 
    updateIncidentStatus, 
    setSelectedIncident, 
    setActiveView, 
    playSound,
    t 
  } = useCivic();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const totalDuplicatesMerged = incidents.reduce((acc, curr) => acc + (curr.duplicates ? curr.duplicates.length : 0), 0);
  const slaAtRiskCount = incidents.filter(i => i.sla.isAtRisk && i.status !== 'RESOLVED').length;

  const handleAdvanceStatus = (incident: Incident, e: React.MouseEvent) => {
    e.stopPropagation();
    const sequence: IncidentStatus[] = ['NEW', 'AI_TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
    const currentIndex = sequence.indexOf(incident.status);
    if (currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      updateIncidentStatus(incident.id, nextStatus);
      if (nextStatus === 'RESOLVED') {
        playSound('success');
      }
    }
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === 'ALL' || inc.assignedDepartment === filterDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Operations Dashboard Header */}
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>{t('kanbanBadge')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            {t('kanbanHeading')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('kanbanDesc')}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('kanbanSearchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded border border-slate-300 focus:border-blue-600 text-xs text-slate-900 outline-none w-48 sm:w-56"
            />
          </div>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-1.5 rounded border border-slate-300 focus:border-blue-600 text-xs text-slate-800 outline-none font-medium bg-white"
          >
            <option value="ALL">All Departments</option>
            <option value="Disaster Management">Disaster Management</option>
            <option value="Public Works & Roads">Public Works & Roads</option>
            <option value="Power & Utilities">Power & Utilities</option>
            <option value="Municipal Health & Sanitation">Health & Sanitation</option>
          </select>
        </div>
      </div>

      {/* Top 4 Command Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-lg gov-card bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase mb-1">
            <span>Active Incidents</span>
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {activeIncidents.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Zone 13 (Velachery Sector)
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-lg gov-card bg-red-50 border border-red-200 shadow-sm">
          <div className="flex items-center justify-between text-red-900 text-xs font-semibold uppercase mb-1">
            <span>Critical Priority</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-700">
            {criticalCount}
          </div>
          <div className="text-[11px] text-red-800 mt-0.5">
            Immediate crew intervention
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-lg gov-card bg-blue-50 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between text-blue-900 text-xs font-semibold uppercase mb-1">
            <span>50m Duplicates Merged</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-800">
            {totalDuplicatesMerged}
          </div>
          <div className="text-[11px] text-blue-900 mt-0.5">
            PostGIS Haversine Buffer
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-lg gov-card bg-amber-50 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-900 text-xs font-semibold uppercase mb-1">
            <span>SLA At Risk (&lt;30m)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700">
            {slaAtRiskCount}
          </div>
          <div className="text-[11px] text-amber-800 mt-0.5">
            Dynamic context escalation
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {KANBAN_COLUMNS.map((col) => {
          const columnIncidents = filteredIncidents.filter(inc => inc.status === col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col rounded-lg gov-card bg-white border border-slate-200 shadow-sm p-3 min-h-[480px]"
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between p-2 rounded mb-2.5 border ${col.color}`}>
                <div className="font-bold text-xs">
                  {col.label}
                </div>
                <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-mono text-[11px] font-bold border border-slate-200">
                  {columnIncidents.length}
                </span>
              </div>

              {/* Column Incidents */}
              <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                {columnIncidents.map((incident) => {
                  const isResolved = incident.status === 'RESOLVED';
                  const isCritical = incident.severity === 'CRITICAL';

                  return (
                    <div
                      key={incident.id}
                      onClick={() => {
                        setSelectedIncident(incident);
                        setActiveView('ai_triage');
                      }}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer transition flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className="text-blue-900 font-bold">#{incident.id}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            isCritical 
                              ? 'bg-red-100 text-red-800 border border-red-200' 
                              : 'bg-slate-200 text-slate-800'
                          }`}>
                            {incident.severity}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                          {incident.title}
                        </h4>

                        <div className="flex items-center space-x-1 text-[10px] text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{incident.locationName}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded bg-white border border-slate-200 space-y-0.5 text-[10px] font-mono">
                        <div className="flex justify-between text-slate-600">
                          <span>Dept:</span>
                          <span className="text-slate-900 font-bold truncate max-w-[110px]">
                            {incident.assignedDepartment}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>50m Dedup:</span>
                          <span className="text-green-700 font-bold">
                            {incident.duplicates.length} merged
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <div className="text-[10px] font-mono">
                          <span className="text-slate-500 block">SLA:</span>
                          <span className={`font-bold ${
                            incident.sla.isAtRisk ? 'text-amber-700' : 'text-slate-800'
                          }`}>
                            {Math.floor(incident.sla.remainingSeconds / 3600)}h {Math.floor((incident.sla.remainingSeconds % 3600) / 60)}m
                          </span>
                        </div>

                        {!isResolved && (
                          <button
                            type="button"
                            onClick={(e) => handleAdvanceStatus(incident, e)}
                            className="p-1 px-2 rounded bg-[#0f2a4a] hover:bg-[#1a3860] text-white text-[10px] font-semibold flex items-center space-x-1 transition"
                            title="Advance Workflow Stage"
                          >
                            <span>Advance</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}

                        {isResolved && (
                          <span className="text-[10px] font-bold text-green-700 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>AUDITED</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {columnIncidents.length === 0 && (
                  <div className="h-28 flex items-center justify-center border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-mono">
                    Queue Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
