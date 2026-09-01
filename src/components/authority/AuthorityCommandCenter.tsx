import React, { useState, useEffect } from 'react';
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
  Zap,
  Radio,
  RefreshCw,
  Eye,
  CheckCheck,
  TrendingUp,
  Sparkles
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

const KANBAN_COLUMNS: { id: IncidentStatus; label: string; color: string; bg: string }[] = [
  { id: 'NEW', label: '1. NEW GRIEVANCES', color: 'border-slate-600 text-slate-300', bg: 'bg-slate-900/60' },
  { id: 'AI_TRIAGED', label: '2. AI TRIAGED', color: 'border-blue-500 text-blue-300', bg: 'bg-blue-950/40' },
  { id: 'ASSIGNED', label: '3. SQUAD ASSIGNED', color: 'border-indigo-500 text-indigo-300', bg: 'bg-indigo-950/40' },
  { id: 'IN_PROGRESS', label: '4. IN REMEDIATION', color: 'border-amber-500 text-amber-300', bg: 'bg-amber-950/40' },
  { id: 'RESOLVED', label: '5. AUDITED & RESOLVED', color: 'border-emerald-500 text-emerald-300', bg: 'bg-emerald-950/40' },
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
      } else {
        playSound('beep');
      }
    }
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === 'ALL' || inc.assignedDepartment === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const [isCapAlertActive, setIsCapAlertActive] = useState(false);

  const handleTriggerCapAlert = () => {
    setIsCapAlertActive(true);
    playSound('alert');
    setTimeout(() => {
      setIsCapAlertActive(false);
    }, 8000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative py-2">
      {/* Geo-Targeted CAP Cell Broadcast Banner Overlay */}
      {isCapAlertActive && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-xl w-full px-4 animate-bounce">
          <div className="p-4 rounded-2xl bg-red-600 border-2 border-white text-white shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-white text-red-600 font-bold text-xs">CAP v1.2</span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  NDMA / CIVIC-SYNC EMERGENCY ALERT
                </span>
              </div>
              <button 
                onClick={() => setIsCapAlertActive(false)}
                className="text-white hover:text-slate-200 text-xs font-bold"
              >
                ✕ DISMISS
              </button>
            </div>
            <p className="text-xs font-bold leading-relaxed">
              🚨 MUNICIPAL ALERT: Severe urban waterlogging & road inundation reported within 1000m of your GPS sector. Automated bus transit diversions active on 100ft Bypass Road.
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-red-100 pt-1 border-t border-red-500/50">
              <span>Target Perimeter: 1000m Geofence</span>
              <span>Cell Broadcast Transmitted: 142,000 Nodes</span>
            </div>
          </div>
        </div>
      )}

      {/* Operations Dashboard Header */}
      <div className="rounded-2xl p-6 bg-[#0D111A] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold">
            <Building className="w-3.5 h-3.5 text-cyan-400" />
            <span>INTEGRATED COMMAND & CONTROL CENTRE (ICCC)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
            Smart City Operations & Unified Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time digital twin monitoring, AI multi-signal telemetry, and inter-agency dispatch workflow.
          </p>
        </div>

        {/* View Switcher Tabs & Simulator Toggle */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            onClick={handleTriggerCapAlert}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition flex items-center space-x-1.5 shadow-md shadow-red-950/50 animate-pulse"
            title="Simulate Geo-Targeted Common Alerting Protocol (CAP) Broadcast"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>🚨 Trigger CAP Alert</span>
          </button>

          <button
            onClick={() => {
              setShowSimulator(!showSimulator);
              playSound('beep');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
              showSimulator 
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-950/50' 
                : 'bg-slate-900 text-amber-400 border-amber-500/30 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{showSimulator ? 'Hide Simulator' : '⚡ Interactive Simulator'}</span>
          </button>

          <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                setActiveTab('digital_twin_overview');
                playSound('beep');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'digital_twin_overview'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Digital Twin Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('kanban_dispatch');
                playSound('beep');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'kanban_dispatch'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Municipal Kanban ({activeIncidents.length})</span>
            </button>
          </div>
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
          <div className="p-4 rounded-xl bg-[#0D111A] border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">ACTIVE INCIDENTS</div>
            <div className="text-2xl font-bold text-white font-mono">{activeIncidents.length}</div>
            <div className="text-[10px] text-slate-500">Live Ingested Queue</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D111A] border border-red-500/30 space-y-1">
            <div className="text-[10px] font-mono font-bold text-red-300 uppercase">CRITICAL SEVERITY</div>
            <div className="text-2xl font-bold text-red-400 font-mono">{criticalCount}</div>
            <div className="text-[10px] text-red-400">Immediate Response Required</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D111A] border border-emerald-500/30 space-y-1">
            <div className="text-[10px] font-mono font-bold text-emerald-300 uppercase">DUPLICATES MERGED (50M)</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{totalDuplicatesMerged}</div>
            <div className="text-[10px] text-emerald-400">Spatial Dispatches Saved</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D111A] border border-amber-500/30 space-y-1">
            <div className="text-[10px] font-mono font-bold text-amber-300 uppercase">SLA AT RISK</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">{slaAtRiskCount}</div>
            <div className="text-[10px] text-amber-400">Dynamic Target &lt; 30 mins</div>
          </div>
        </div>
      </div>

      {/* Main Center Area */}
      {activeTab === 'digital_twin_overview' ? (
        <div className="space-y-6">
          {/* Main Map + Side Panel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Smart City Subsystem Telemetry & Direct Interventions (8 Domain Operations)
                </h2>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono font-bold">
                ● LIVE OPERATIONAL LAYER
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
        <div className="space-y-5 rounded-2xl p-6 bg-[#0D111A] border border-slate-800 shadow-2xl">
          {/* Search & Department Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase">Department Filter:</span>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-white bg-slate-900 outline-none focus:border-cyan-400"
              >
                <option value="ALL">All Municipal Departments</option>
                <option value="Disaster Management">Disaster Management</option>
                <option value="Public Works & Roads">Public Works & Roads</option>
                <option value="Power & Utilities">Power & Utilities</option>
                <option value="Municipal Health & Sanitation">Health & Sanitation</option>
                <option value="Water Supply & Drainage">Water Supply & Drainage</option>
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
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-700 text-xs text-white bg-slate-900 placeholder-slate-500 outline-none focus:border-cyan-400 w-64"
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
                  className="bg-slate-900/60 rounded-2xl border border-slate-800 p-3.5 flex flex-col min-h-[550px] space-y-3"
                >
                  <div className={`px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border ${column.color} ${column.bg} flex justify-between items-center shadow-xs`}>
                    <span>{column.label}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/40 text-white font-extrabold">{colIncidents.length}</span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colIncidents.map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => {
                          setSelectedIncident(inc);
                          setActiveView('case_tracking');
                        }}
                        className="p-3.5 rounded-xl bg-[#090d16] hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer space-y-2.5 shadow-sm group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-cyan-400">
                            #{inc.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            inc.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-500/40' :
                            inc.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                            'bg-blue-950 text-blue-300 border border-blue-500/40'
                          }`}>
                            {inc.severity}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                          {inc.title}
                        </div>

                        <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {inc.description}
                        </div>

                        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-white/5">
                          <span className="truncate max-w-[110px]">{inc.assignedDepartment}</span>
                          <span className="text-amber-400">
                            {Math.floor(inc.sla.remainingSeconds / 3600)}h {Math.floor((inc.sla.remainingSeconds % 3600) / 60)}m
                          </span>
                        </div>

                        {column.id !== 'RESOLVED' && (
                          <button
                            onClick={(e) => handleAdvanceStatus(inc, e)}
                            className="w-full py-1.5 px-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-600/40 text-[10px] font-bold transition flex items-center justify-center space-x-1"
                          >
                            <span>Advance Stage</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}

                    {colIncidents.length === 0 && (
                      <div className="text-center py-12 text-xs text-slate-600 font-mono">
                        No grievances in this stage
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
