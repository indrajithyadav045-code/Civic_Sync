import React, { useState } from 'react';
import { 
  Building, 
  Shield, 
  Users, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Camera, 
  Send, 
  Radio, 
  Layers, 
  Sliders, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Eye, 
  ChevronRight, 
  ExternalLink,
  Award,
  Zap,
  CheckCheck,
  X
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { Incident, IncidentSeverity, IncidentStatus, Department } from '../../types';
import { AdminOfficerRole } from '../../context/CivicContext';

const OFFICER_ROLES: { id: AdminOfficerRole; label: string; dept: string; icon: string; color: string }[] = [
  { id: 'ZONAL_COMMISSIONER', label: 'Zonal Commissioner (All Wards)', dept: 'GCC Executive HQ', icon: '🏛️', color: 'border-blue-500 bg-blue-950/40 text-blue-300' },
  { id: 'PWD_CHIEF_ENGINEER', label: 'PWD Chief Engineer', dept: 'Public Works & Roads', icon: '🏗️', color: 'border-amber-500 bg-amber-950/40 text-amber-300' },
  { id: 'WMD_SANITATION_OFFICER', label: 'WMD Sanitation Officer', dept: 'Municipal Health & Waste', icon: '🗑️', color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300' },
  { id: 'DD_DISASTER_OFFICER', label: 'Disaster Coordination Officer', dept: 'Disaster Management', icon: '🚨', color: 'border-red-500 bg-red-950/40 text-red-300' },
  { id: 'ED_ELECTRICAL_SUPERVISOR', label: 'Electrical Grid Supervisor', dept: 'Power & Street Lighting', icon: '⚡', color: 'border-yellow-500 bg-yellow-950/40 text-yellow-300' },
  { id: 'WSD_METROWATER_ENGINEER', label: 'MetroWater Chief Engineer', dept: 'Water Supply & Drainage', icon: '💧', color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300' }
];

const QUICK_SQUADS = [
  { name: 'PWD Rapid Pothole & Road Squad Alpha', vehicle: 'TN-01-G-7821', staff: 'Er. R. Sundaramoorthy', dept: 'Public Works & Roads' },
  { name: 'GCC High-Volume Stormwater De-watering Unit 4', vehicle: 'TN-01-G-9904', staff: 'Officer K. Selvam', dept: 'Disaster Management' },
  { name: 'WMD Mechanized Waste Compactor Crew 12', vehicle: 'TN-01-G-3312', staff: 'Supervisor M. Natarajan', dept: 'Municipal Health & Sanitation' },
  { name: 'TANGEDCO Street Lighting Line Repair Unit 8', vehicle: 'TN-01-G-1108', staff: 'Technician P. Kumar', dept: 'Power & Utilities' },
  { name: 'CMWSSB 36-Inch Water Main Rapid Repair Squad', vehicle: 'TN-01-G-5536', staff: 'Er. V. Murugan', dept: 'Water Supply & Drainage' }
];

export const MunicipalAdminPortal: React.FC = () => {
  const { 
    incidents, 
    selectedIncident, 
    setSelectedIncident, 
    setActiveView, 
    setPortalMode,
    adminRole, 
    setAdminRole,
    assignFieldSquad,
    resolveIncidentWithProof,
    overrideIncidentSeverity,
    updateIncidentStatus,
    playSound 
  } = useCivic();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal States
  const [assignModalIncident, setAssignModalIncident] = useState<Incident | null>(null);
  const [selectedSquad, setSelectedSquad] = useState(QUICK_SQUADS[0]);
  const [customEta, setCustomEta] = useState(25);

  const [resolveModalIncident, setResolveModalIncident] = useState<Incident | null>(null);
  const [resolutionOfficerName, setResolutionOfficerName] = useState('Officer M. Natarajan');
  const [resolutionNotes, setResolutionNotes] = useState('Road surface cleared and restored. PostGIS geofence verified ±0.8m.');

  const [smsNotificationMsg, setSmsNotificationMsg] = useState<string | null>(null);

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;
  const totalDuplicatesMerged = incidents.reduce((acc, curr) => acc + (curr.duplicates ? curr.duplicates.length : 0), 0);

  const currentRoleObj = OFFICER_ROLES.find(r => r.id === adminRole) || OFFICER_ROLES[0];

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inc.citizenName && inc.citizenName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = filterDept === 'ALL' || inc.assignedDepartment === filterDept;
    const matchesSeverity = filterSeverity === 'ALL' || inc.severity === filterSeverity;
    const matchesStatus = filterStatus === 'ALL' || inc.status === filterStatus;
    return matchesSearch && matchesDept && matchesSeverity && matchesStatus;
  });

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalIncident) return;
    assignFieldSquad(
      assignModalIncident.id,
      selectedSquad.name,
      selectedSquad.staff,
      selectedSquad.vehicle,
      customEta
    );
    setSmsNotificationMsg(`SMS Dispatched to ${assignModalIncident.citizenName} (${assignModalIncident.citizenContact}): "Your grievance #${assignModalIncident.id} has been dispatched to ${selectedSquad.name}. Crew ETA: ${customEta} mins."`);
    setAssignModalIncident(null);
    setTimeout(() => setSmsNotificationMsg(null), 6000);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveModalIncident) return;
    resolveIncidentWithProof(resolveModalIncident.id, {
      resolvedByStaff: resolutionOfficerName,
      staffBadge: `GCC-${Math.floor(1000 + Math.random() * 9000)}`,
      aiVerificationNotes: [
        'PostGIS Geofence match ±0.8m confirmed',
        resolutionNotes,
        'Resolution cryptographically audited and signed'
      ]
    });
    setSmsNotificationMsg(`Resolution SMS Dispatched to ${resolveModalIncident.citizenName}: "Grievance #${resolveModalIncident.id} has been verified and marked RESOLVED by GCC."`);
    setResolveModalIncident(null);
    setTimeout(() => setSmsNotificationMsg(null), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 py-2">
      {/* SMS Alert Flash Banner */}
      {smsNotificationMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-mono shadow-2xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{smsNotificationMsg}</span>
          </div>
          <button onClick={() => setSmsNotificationMsg(null)} className="text-emerald-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Top Banner: Administrator Command Desk */}
      <div className="rounded-2xl p-6 sm:p-7 bg-[#0D111A] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                MUNICIPAL CORPORATION ADMIN PORTAL
              </span>
              <span className="text-xs font-mono text-slate-400">GCC Integrated Command HQ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Municipal Problem Control & Resolution Workstation
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Centralized administrative access for Greater Chennai Corporation officers. Inspect incoming citizen grievances, dispatch field squads, override priorities, and certify resolutions with cryptographic audit stamps.
            </p>
          </div>

          {/* Quick Portal Switcher to Citizen Consumer View */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => {
                setPortalMode('CITIZEN');
                setActiveView('citizen_home');
                playSound('beep');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm"
              title="Switch to Citizen Consumer Portal View"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Switch to Citizen Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setActiveView('command_map');
                playSound('beep');
              }}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <Building className="w-4 h-4" />
              <span>Open Tactical GIS Map</span>
            </button>
          </div>
        </div>

        {/* Officer Role Selector Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
            Active Administrative Officer Role:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {OFFICER_ROLES.map((role) => {
              const isSelected = adminRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setAdminRole(role.id);
                    playSound('beep');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between space-y-1 ${
                    isSelected 
                      ? 'border-cyan-400 bg-cyan-950/80 text-white ring-2 ring-cyan-500/30 shadow' 
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{role.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[11px] font-bold truncate">{role.label}</div>
                  <div className="text-[9px] text-slate-400 font-mono truncate">{role.dept}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-[#0D111A] border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">TOTAL GRIEVANCES</span>
          <div className="text-2xl font-bold text-white font-mono">{incidents.length}</div>
          <span className="text-[10px] text-slate-500">Live Ingested</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-amber-500/30 space-y-1">
          <span className="text-[10px] font-mono text-amber-300 uppercase font-bold">ACTIVE QUEUE</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">{activeIncidents.length}</div>
          <span className="text-[10px] text-slate-500">In Remediation</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-red-500/30 space-y-1">
          <span className="text-[10px] font-mono text-red-300 uppercase font-bold">CRITICAL SEVERITY</span>
          <div className="text-2xl font-bold text-red-400 font-mono">{criticalCount}</div>
          <span className="text-[10px] text-red-400">Immediate Action</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-mono text-emerald-300 uppercase font-bold">50m DEDUP MERGED</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{totalDuplicatesMerged}</div>
          <span className="text-[10px] text-emerald-400">Dispatches Suppressed</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-cyan-500/30 space-y-1">
          <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold">RESOLVED & AUDITED</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{resolvedCount}</div>
          <span className="text-[10px] text-cyan-400">SHA-256 Certified</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0D111A] border border-purple-500/30 space-y-1">
          <span className="text-[10px] font-mono text-purple-300 uppercase font-bold">AVG SLA SPEED</span>
          <div className="text-2xl font-bold text-purple-300 font-mono">2.8 hrs</div>
          <span className="text-[10px] text-slate-500">96.4% Compliance</span>
        </div>
      </div>

      {/* Main Grievance Queue & Problem Access Workstation */}
      <div className="rounded-2xl p-6 bg-[#0D111A] border border-slate-800 shadow-2xl space-y-5">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white font-sans">
              Active Municipal Problem Dossier ({filteredIncidents.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket, citizen, area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none w-48 sm:w-64"
              />
            </div>

            {/* Department Filter */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Public Works & Roads">Public Works (PWD)</option>
              <option value="Disaster Management">Disaster Management (DD)</option>
              <option value="Municipal Health & Sanitation">Sanitation (WMD)</option>
              <option value="Power & Utilities">Electrical Grid (ED)</option>
              <option value="Water Supply & Drainage">MetroWater (WSD)</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="AI_TRIAGED">AI Triaged</option>
              <option value="ASSIGNED">Squad Assigned</option>
              <option value="IN_PROGRESS">In Remediation</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {/* Grievance Items List */}
        <div className="space-y-4">
          {filteredIncidents.map((incident) => {
            const isResolved = incident.status === 'RESOLVED';
            const isCritical = incident.severity === 'CRITICAL';
            return (
              <div 
                key={incident.id}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  isResolved 
                    ? 'bg-slate-900/40 border-emerald-500/20' 
                    : isCritical 
                    ? 'bg-red-950/10 border-red-500/40 shadow-red-950/20 shadow-lg' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2.5 flex-wrap">
                    <span className="font-mono text-xs font-extrabold text-cyan-400">
                      #{incident.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      incident.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-500/40' :
                      incident.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                      'bg-blue-950 text-blue-300 border border-blue-500/40'
                    }`}>
                      {incident.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {incident.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Dept: <strong className="text-slate-200">{incident.assignedDepartment}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SLA: {Math.floor(incident.sla.remainingSeconds / 3600)}h {Math.floor((incident.sla.remainingSeconds % 3600) / 60)}m remaining</span>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left (3 cols): Evidence Image with YOLOv8 Detection Tag */}
                  <div className="lg:col-span-3 relative rounded-xl overflow-hidden aspect-video bg-black border border-slate-800">
                    <img
                      src={incident.image}
                      alt="Citizen Evidence"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-400">
                      YOLOv8: {incident.category}
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[9px]">
                      GPS: {incident.coordinates.lat.toFixed(4)}°N, {incident.coordinates.lng.toFixed(4)}°E
                    </div>
                  </div>

                  {/* Middle (6 cols): Problem Details & Telemetry */}
                  <div className="lg:col-span-6 space-y-2">
                    <h3 className="text-sm font-bold text-white">{incident.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{incident.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="block text-[9px] font-mono text-slate-500 uppercase">REPORTING CITIZEN</span>
                        <span className="font-bold text-slate-200">{incident.citizenName || 'Verified Citizen'}</span>
                        <span className="block text-[10px] font-mono text-cyan-400">{incident.citizenContact || '+91 98401 23456'}</span>
                      </div>

                      <div className="p-2 rounded bg-black/40 border border-white/5">
                        <span className="block text-[9px] font-mono text-slate-500 uppercase">LOCATION CORRIDOR</span>
                        <span className="font-semibold text-slate-200 truncate block">{incident.locationName}</span>
                        <span className="block text-[10px] text-amber-400 font-mono">
                          Near {incident.spatial.schoolName} ({incident.spatial.schoolDistanceMeters}m)
                        </span>
                      </div>
                    </div>

                    {/* Deduplication Pill */}
                    {incident.duplicates && incident.duplicates.length > 0 && (
                      <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                        <span className="text-emerald-300 font-semibold flex items-center space-x-1">
                          <Layers className="w-3.5 h-3.5" />
                          <span>50m PostGIS Cluster: {incident.duplicates.length} duplicate citizen reports consolidated</span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-900/60 px-1.5 py-0.5 rounded">
                          DISPATCHES SAVED: {incident.duplicates.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right (3 cols): Action Buttons */}
                  <div className="lg:col-span-3 space-y-2">
                    {incident.status !== 'RESOLVED' ? (
                      <>
                        <button
                          onClick={() => setAssignModalIncident(incident)}
                          className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Assign Field Squad</span>
                        </button>

                        <button
                          onClick={() => setResolveModalIncident(incident)}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Certify Resolution</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              const nextSev: IncidentSeverity = incident.severity === 'CRITICAL' ? 'HIGH' : incident.severity === 'HIGH' ? 'MEDIUM' : 'CRITICAL';
                              overrideIncidentSeverity(incident.id, nextSev);
                            }}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[10px] font-bold transition flex items-center justify-center space-x-1"
                            title="Toggle Severity"
                          >
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>Override Sev</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedIncident(incident);
                              setActiveView('case_tracking');
                            }}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[10px] font-bold transition flex items-center justify-center space-x-1"
                            title="Inspect in Citizen Consumer Case Tracker"
                          >
                            <Eye className="w-3 h-3 text-cyan-400" />
                            <span>Citizen View</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1.5">
                        <div className="flex items-center justify-center space-x-1 text-emerald-400 text-xs font-bold">
                          <Award className="w-4 h-4" />
                          <span>RESOLVED & AUDITED</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Certified by {incident.resolution?.resolvedByStaff}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedIncident(incident);
                            setActiveView('resolution_verification');
                          }}
                          className="w-full py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[10px] font-bold transition flex items-center justify-center space-x-1"
                        >
                          <span>View Resolution Proof</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: Assign Field Squad */}
      {assignModalIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D111A] border border-cyan-500/30 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">
                  Dispatch Field Squad to #{assignModalIncident.id}
                </h3>
              </div>
              <button onClick={() => setAssignModalIncident(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Select Municipal Field Unit:
                </label>
                <div className="space-y-2">
                  {QUICK_SQUADS.map((sq, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedSquad(sq)}
                      className={`p-3 rounded-xl border transition cursor-pointer text-xs space-y-1 ${
                        selectedSquad.name === sq.name 
                          ? 'border-cyan-400 bg-cyan-950/60 text-white' 
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-white">{sq.name}</span>
                        <span className="font-mono text-[10px] text-cyan-400">{sq.vehicle}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Lead: {sq.staff}</span>
                        <span>{sq.dept}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Target Arrival ETA:</span>
                  <span className="font-mono text-cyan-400 font-bold">{customEta} Minutes</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={90}
                  step={5}
                  value={customEta}
                  onChange={(e) => setCustomEta(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 space-y-1">
                <span className="font-bold block">Automated Citizen SMS Notification:</span>
                <p className="text-[11px] text-slate-300">
                  Citizen ({assignModalIncident.citizenContact}) will receive instant SMS confirmation of squad dispatch with live GPS tracking link.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalIncident(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 shadow"
                >
                  Confirm Squad Dispatch & Alert Citizen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Certify Resolution */}
      {resolveModalIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D111A] border border-emerald-500/40 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">
                  Certify Grievance Resolution #{resolveModalIncident.id}
                </h3>
              </div>
              <button onClick={() => setResolveModalIncident(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Certifying Municipal Officer Name:
                </label>
                <input
                  type="text"
                  value={resolutionOfficerName}
                  onChange={(e) => setResolutionOfficerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Field Remediation & Audit Notes:
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5 text-xs text-emerald-200">
                <span className="font-bold block">Cryptographic Security Stamp:</span>
                <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400">
                  <span>GPS Geofence Match: ±0.8m</span>
                  <span>SHA-256 [8f4a...29b1]</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalIncident(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow"
                >
                  Sign & Certify Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
