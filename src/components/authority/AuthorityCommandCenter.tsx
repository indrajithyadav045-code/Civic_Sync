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
  Building,
  Activity,
  Map as MapIcon,
  Sliders,
  Zap
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { IncidentStatus, Incident } from '../../types';
import { CityHealthCard } from '../smartcity/CityHealthCard';
import { SmartTrafficCard } from '../smartcity/SmartTrafficCard';
import { FloodIntelligenceCard } from '../smartcity/FloodIntelligenceCard';
import { SmartLightingCard } from '../smartcity/SmartLightingCard';
import { SmartWasteCard } from '../smartcity/SmartWasteCard';
import { SmartWaterCard } from '../smartcity/SmartWaterCard';
import { EnvironmentAqiCard } from '../smartcity/EnvironmentAqiCard';
import { EmergencyFleetCard } from '../smartcity/EmergencyFleetCard';
import { SmartParkingCard } from '../smartcity/SmartParkingCard';
import { LiveCityEventStream } from '../smartcity/LiveCityEventStream';
import { AiCityInsightCard } from '../smartcity/AiCityInsightCard';
import { TacticalCommandMap } from '../map/TacticalCommandMap';
import { SimulationSandbox } from '../smartcity/SimulationSandbox';

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

  const [activeTab, setActiveTab] = useState<'digital_twin_overview' | 'kanban_dispatch'>('digital_twin_overview');
  const [showSimulator, setShowSimulator] = useState(false);
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
            Smart City Operations & Unified Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time digital twin monitoring, AI multi-signal telemetry, and inter-agency dispatch workflow.
          </p>
        </div>

        {/* View Switcher Tabs & Simulator Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition flex items-center space-x-1.5 ${
              showSimulator 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                : 'bg-slate-900 text-amber-400 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{showSimulator ? 'Close Simulator' : '⚡ Interactive Simulator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('digital_twin_overview')}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'digital_twin_overview'
                ? 'bg-[#0f2a4a] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Digital Twin Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('kanban_dispatch')}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'kanban_dispatch'
                ? 'bg-[#0f2a4a] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Municipal Kanban Dispatch</span>
          </button>
        </div>
      </div>

      {/* Interactive Simulator Sandbox (Collapsible) */}
      {showSimulator && (
        <SimulationSandbox />
      )}

      {/* Top Row: City Health Score & Key Command Metrics */}
      <div className="space-y-4">
        <CityHealthCard />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg gov-card bg-white border border-slate-200 shadow-sm">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">ACTIVE INCIDENTS</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{activeIncidents.length}</div>
            <div className="text-[10px] text-slate-400">Total in queue</div>
          </div>

          <div className="p-3.5 rounded-lg gov-card bg-white border border-slate-200 shadow-sm">
            <div className="text-[11px] font-semibold text-red-600 uppercase">CRITICAL INCIDENTS</div>
            <div className="text-2xl font-bold text-red-700 mt-0.5">{criticalCount}</div>
            <div className="text-[10px] text-red-600">Immediate response required</div>
          </div>

          <div className="p-3.5 rounded-lg gov-card bg-white border border-slate-200 shadow-sm">
            <div className="text-[11px] font-semibold text-blue-700 uppercase">DUPLICATES MERGED (50M)</div>
            <div className="text-2xl font-bold text-blue-900 mt-0.5">{totalDuplicatesMerged}</div>
            <div className="text-[10px] text-slate-400">Spatial tickets deduplicated</div>
          </div>

          <div className="p-3.5 rounded-lg gov-card bg-white border border-slate-200 shadow-sm">
            <div className="text-[11px] font-semibold text-amber-700 uppercase">SLA AT RISK</div>
            <div className="text-2xl font-bold text-amber-800 mt-0.5">{slaAtRiskCount}</div>
            <div className="text-[10px] text-slate-400">Target &lt; 30 mins</div>
          </div>
        </div>
      </div>

      {/* Main Center Area */}
      {activeTab === 'digital_twin_overview' ? (
        <div className="space-y-6">
          {/* Main Map + Side Panel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 cols: Large City Digital Twin Map */}
            <div className="lg:col-span-8">
              <TacticalCommandMap />
            </div>

            {/* Right 4 cols: AI Insight + Live Stream */}
            <div className="lg:col-span-4 space-y-4">
              <AiCityInsightCard />
              <LiveCityEventStream />
            </div>
          </div>

          {/* Bottom Subsystems Operations Grid (8 Subsystems) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-800" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Smart City Subsystem Telemetry (8 Domain Operations)
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                INTELLIGENT OPERATING LAYER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SmartTrafficCard />
              <FloodIntelligenceCard />
              <SmartWasteCard />
              <SmartLightingCard />
              <SmartWaterCard />
              <EnvironmentAqiCard />
              <EmergencyFleetCard />
              <SmartParkingCard />
            </div>
          </div>
        </div>
      ) : (
        /* Kanban Dispatch View */
        <div className="space-y-4">
          {/* Search & Department Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 uppercase">Department Filter:</span>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-900 bg-white outline-none"
              >
                <option value="ALL">All Municipal Departments</option>
                <option value="Disaster Management">Disaster Management</option>
                <option value="Public Works & Roads">Public Works & Roads</option>
                <option value="Power & Utilities">Power & Utilities</option>
                <option value="Municipal Health & Sanitation">Health & Sanitation</option>
                <option value="Traffic Police">Traffic Police</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('kanbanSearchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 outline-none w-56"
              />
            </div>
          </div>

          {/* Kanban Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {KANBAN_COLUMNS.map((column) => {
              const colIncidents = filteredIncidents.filter(i => i.status === column.id);
              return (
                <div 
                  key={column.id}
                  className="bg-slate-50 rounded-lg border border-slate-200 p-3 flex flex-col min-h-[500px]"
                >
                  <div className={`px-2.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider mb-3 border ${column.color} flex justify-between items-center`}>
                    <span>{column.label}</span>
                    <span className="font-mono text-xs">{colIncidents.length}</span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {colIncidents.map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => {
                          setSelectedIncident(inc);
                          setActiveView('case_tracking');
                        }}
                        className="p-3 bg-white rounded border border-slate-200 hover:border-blue-400 cursor-pointer shadow-xs transition space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-blue-900">#{inc.id}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            inc.severity === 'CRITICAL' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inc.severity}
                          </span>
                        </div>

                        <h4 className="font-semibold text-slate-900 text-xs line-clamp-2 leading-tight">
                          {inc.title}
                        </h4>

                        <div className="text-[10px] text-slate-500 truncate">
                          Dept: <strong className="text-slate-800">{inc.assignedDepartment}</strong>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-amber-800 font-mono font-bold">
                            {Math.floor(inc.sla.remainingSeconds / 3600)}h {Math.floor((inc.sla.remainingSeconds % 3600) / 60)}m
                          </span>

                          {column.id !== 'RESOLVED' ? (
                            <button
                              type="button"
                              onClick={(e) => handleAdvanceStatus(inc, e)}
                              className="px-2 py-0.5 rounded bg-blue-800 hover:bg-blue-900 text-white font-semibold text-[10px] transition flex items-center space-x-0.5"
                            >
                              <span>Advance</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-green-700 font-bold text-[10px] flex items-center space-x-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Audited</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {colIncidents.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-xs italic">
                        No incidents in this queue
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
