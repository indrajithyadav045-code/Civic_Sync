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
  EyeOff,
  ChevronRight, 
  ExternalLink,
  Award,
  Zap,
  CheckCheck,
  X,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  LayoutDashboard,
  Activity
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { Incident, IncidentSeverity, IncidentStatus, Department } from '../../types';
import { AdminOfficerRole } from '../../context/CivicContext';
import { AuthorityCommandCenter } from './AuthorityCommandCenter';

const OFFICER_ROLES: { id: AdminOfficerRole; label: string; dept: string; icon: string; color: string }[] = [
  { id: 'ZONAL_COMMISSIONER', label: 'Zonal Commissioner (All Wards)', dept: 'GCC Executive HQ', icon: '🏛️', color: 'border-blue-300 bg-blue-50 text-blue-900' },
  { id: 'PWD_CHIEF_ENGINEER', label: 'PWD Chief Engineer', dept: 'Public Works & Roads', icon: '🏗️', color: 'border-amber-300 bg-amber-50 text-amber-900' },
  { id: 'WMD_SANITATION_OFFICER', label: 'WMD Sanitation Officer', dept: 'Municipal Health & Waste', icon: '🗑️', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
  { id: 'DD_DISASTER_OFFICER', label: 'Disaster Coordination Officer', dept: 'Disaster Management', icon: '🚨', color: 'border-red-300 bg-red-50 text-red-900' },
  { id: 'ED_ELECTRICAL_SUPERVISOR', label: 'Electrical Grid Supervisor', dept: 'Power & Street Lighting', icon: '⚡', color: 'border-yellow-300 bg-yellow-50 text-yellow-900' },
  { id: 'WSD_METROWATER_ENGINEER', label: 'MetroWater Chief Engineer', dept: 'Water Supply & Drainage', icon: '💧', color: 'border-cyan-300 bg-cyan-50 text-cyan-900' }
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
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    assignFieldSquad,
    resolveIncidentWithProof,
    overrideIncidentSeverity,
    updateIncidentStatus,
    playSound 
  } = useCivic();

  // Authentication Lock Screen States
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Admin View Tab
  const [adminTab, setAdminTab] = useState<'grievances' | 'iccc_operations'>('grievances');

  // Search & Filters
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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (!success) {
      setAuthError('❌ Invalid Officer Password. Please enter "GCC@admin" to proceed.');
      setPasswordInput('');
    } else {
      setAuthError(null);
    }
  };

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

  // IF NOT AUTHENTICATED: RENDER GCC OFFICER LOGIN GATEWAY
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 animate-fade-in">
        <div className="rounded-2xl p-8 bg-white border border-slate-300 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-900 text-white flex items-center justify-center shadow-md">
              <Lock className="w-7 h-7" />
            </div>

            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-mono font-bold uppercase tracking-wider inline-block">
              GCC ADMINISTRATIVE GATEWAY
            </span>

            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Municipal Corporation Admin Access
            </h2>

            <p className="text-xs text-slate-600">
              Restricted workstation for authorized GCC officers, zonal commissioners, and squad dispatch engineers.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Officer Identifier / Badge:
              </label>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono flex items-center justify-between">
                <span>OFFICER_GCC_ADMIN (Zone 13)</span>
                <span className="text-[10px] text-emerald-700 font-bold">● VERIFIED ID</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Administrative Password:</span>
                <span className="text-[10px] text-blue-800 font-mono">Required: GCC@admin</span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter administrator password..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  autoFocus
                  required
                  className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-800 text-xs font-mono">
                {authError}
              </div>
            )}

            {/* Quick Demo Fill Button */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-600">Demo Password:</span>
              <button
                type="button"
                onClick={() => {
                  setPasswordInput('GCC@admin');
                  setAuthError(null);
                  playSound('beep');
                }}
                className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-mono text-[11px] font-bold transition flex items-center space-x-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>Auto-Fill (GCC@admin)</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs tracking-wider uppercase transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <Unlock className="w-4 h-4" />
              <span>Authorize & Enter Admin Panel</span>
            </button>
          </form>

          {/* Switch back to citizen portal */}
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              onClick={() => {
                setPortalMode('CITIZEN');
                setActiveView('citizen_home');
              }}
              className="text-xs text-slate-500 hover:text-blue-800 transition font-medium"
            >
              ← Return to Citizen Public Grievance Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
                MUNICIPAL CORPORATION ADMIN PORTAL
              </span>
              <span className="text-xs font-mono text-emerald-700 font-semibold">● AUTHENTICATED [GCC@admin]</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
              Municipal Problem Control & Resolution Workstation
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Centralized administrative access for Greater Chennai Corporation officers. Inspect incoming citizen grievances, dispatch field squads, override priorities, and operate the Smart City ICCC Digital Twin.
            </p>
          </div>

          {/* Quick Portal Switcher & Logout Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => {
                setPortalMode('CITIZEN');
                setActiveView('citizen_home');
                playSound('beep');
              }}
              className="px-3.5 py-2 rounded bg-slate-100 hover:bg-slate-200 text-blue-900 border border-slate-300 text-xs font-bold transition flex items-center justify-center space-x-2"
              title="Switch to Citizen Consumer Portal View"
            >
              <Users className="w-4 h-4 text-blue-800" />
              <span>Switch to Citizen Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2 rounded bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              title="Lock and Log Out of Admin Workstation"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Logout</span>
            </button>
          </div>
        </div>

        {/* Officer Role Selector Bar */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
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
                  className={`p-2 rounded border text-left transition flex flex-col justify-between space-y-1 ${
                    isSelected 
                      ? 'border-blue-900 bg-blue-900 text-white shadow-sm' 
                      : `${role.color} hover:shadow-xs`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{role.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <div className={`text-[11px] font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{role.label}</div>
                  <div className={`text-[9px] font-mono truncate ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>{role.dept}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin Navigation Tabs: Problem Queue vs ICCC Operations */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setAdminTab('grievances');
              playSound('beep');
            }}
            className={`px-4 py-2 rounded text-xs font-bold transition flex items-center space-x-2 ${
              adminTab === 'grievances'
                ? 'bg-[#0f2a4a] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📋 Master Grievance Queue ({filteredIncidents.length})</span>
          </button>

          <button
            onClick={() => {
              setAdminTab('iccc_operations');
              playSound('beep');
            }}
            className={`px-4 py-2 rounded text-xs font-bold transition flex items-center space-x-2 ${
              adminTab === 'iccc_operations'
                ? 'bg-[#0f2a4a] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>🛰️ ICCC Operations & Smart City Digital Twin</span>
          </button>
        </div>
      </div>

      {/* BODY VIEW SWITCHER */}
      {adminTab === 'iccc_operations' ? (
        /* EMBEDDED ICCC OPERATIONS WORKSTATION */
        <div className="animate-fade-in">
          <AuthorityCommandCenter />
        </div>
      ) : (
        /* MASTER GRIEVANCE & SQUAD WORKSTATION */
        <div className="space-y-6">
          {/* KPI Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-lg gov-card bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">TOTAL GRIEVANCES</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">{incidents.length}</div>
              <span className="text-[10px] text-slate-400">Live Ingested</span>
            </div>

            <div className="p-3.5 rounded-lg gov-card bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono text-amber-700 uppercase font-bold">ACTIVE QUEUE</span>
              <div className="text-2xl font-bold text-amber-800 font-mono">{activeIncidents.length}</div>
              <span className="text-[10px] text-slate-400">In Remediation</span>
            </div>

            <div className="p-3.5 rounded-lg gov-card bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono text-red-600 uppercase font-bold">CRITICAL SEVERITY</span>
              <div className="text-2xl font-bold text-red-700 font-mono">{criticalCount}</div>
              <span className="text-[10px] text-red-600">Immediate Action</span>
            </div>

            <div className="p-3.5 rounded-lg gov-card bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">50m DEDUP MERGED</span>
              <div className="text-2xl font-bold text-emerald-800 font-mono">{totalDuplicatesMerged}</div>
              <span className="text-[10px] text-emerald-700">Dispatches Saved</span>
            </div>

            <div className="p-3.5 rounded-lg gov-card bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono text-blue-700 uppercase font-bold">RESOLVED & AUDITED</span>
              <div className="text-2xl font-bold text-blue-900 font-mono">{resolvedCount}</div>
              <span className="text-[10px] text-blue-700">SHA-256 Certified</span>
            </div>

            <div className="p-3.5 rounded-lg gov-card bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono text-purple-700 uppercase font-bold">AVG SLA SPEED</span>
              <div className="text-2xl font-bold text-purple-900 font-mono">2.8 hrs</div>
              <span className="text-[10px] text-slate-400">96.4% Compliance</span>
            </div>
          </div>

          {/* Main Grievance Queue & Problem Access Workstation */}
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-800" />
                <h2 className="text-base font-bold text-slate-900 font-sans">
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
                    className="pl-8 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 outline-none w-48 sm:w-64"
                  />
                </div>

                {/* Department Filter */}
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="py-1.5 px-2.5 rounded border border-slate-300 text-xs text-slate-800 focus:border-blue-600 outline-none bg-white"
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
                  className="py-1.5 px-2.5 rounded border border-slate-300 text-xs text-slate-800 focus:border-blue-600 outline-none bg-white"
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
            <div className="space-y-3">
              {filteredIncidents.map((incident) => {
                const isResolved = incident.status === 'RESOLVED';
                const isCritical = incident.severity === 'CRITICAL';
                return (
                  <div 
                    key={incident.id}
                    className={`p-4 rounded-lg border transition-all space-y-3 ${
                      isResolved 
                        ? 'bg-emerald-50/40 border-emerald-200' 
                        : isCritical 
                        ? 'bg-red-50/30 border-red-300' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center space-x-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-blue-900">
                          #{incident.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          incident.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' :
                          incident.severity === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {incident.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {incident.status}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          Dept: <strong className="text-slate-800">{incident.assignedDepartment}</strong>
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-blue-700" />
                        <span>SLA: {Math.floor(incident.sla.remainingSeconds / 3600)}h {Math.floor((incident.sla.remainingSeconds % 3600) / 60)}m remaining</span>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      {/* Left (3 cols): Evidence Image */}
                      <div className="lg:col-span-3 relative rounded-lg overflow-hidden aspect-video bg-black border border-slate-200">
                        <img
                          src={incident.image}
                          alt="Citizen Evidence"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-cyan-300 font-mono text-[9px] font-bold">
                          YOLOv8: {incident.category}
                        </div>
                      </div>

                      {/* Middle (6 cols): Problem Details & Telemetry */}
                      <div className="lg:col-span-6 space-y-1.5">
                        <h3 className="text-xs font-bold text-slate-900">{incident.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{incident.description}</p>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                          <div className="p-2 rounded bg-slate-50 border border-slate-200">
                            <span className="block text-[9px] font-mono text-slate-500 uppercase">CITIZEN</span>
                            <span className="font-bold text-slate-900">{incident.citizenName || 'Verified Citizen'}</span>
                            <span className="block text-[10px] font-mono text-blue-800">{incident.citizenContact || '+91 98401 23456'}</span>
                          </div>

                          <div className="p-2 rounded bg-slate-50 border border-slate-200">
                            <span className="block text-[9px] font-mono text-slate-500 uppercase">LOCATION</span>
                            <span className="font-semibold text-slate-900 truncate block">{incident.locationName}</span>
                            <span className="block text-[10px] text-amber-800 font-mono">
                              Near {incident.spatial.schoolName} ({incident.spatial.schoolDistanceMeters}m)
                            </span>
                          </div>
                        </div>

                        {/* Deduplication Pill */}
                        {incident.duplicates && incident.duplicates.length > 0 && (
                          <div className="p-1.5 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                            <span className="text-emerald-900 font-semibold flex items-center space-x-1">
                              <Layers className="w-3.5 h-3.5 text-emerald-700" />
                              <span>50m Cluster: {incident.duplicates.length} reports merged</span>
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
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
                              className="w-full py-1.5 px-3 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Assign Field Squad</span>
                            </button>

                            <button
                              onClick={() => setResolveModalIncident(incident)}
                              className="w-full py-1.5 px-3 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
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
                                className="flex-1 py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[10px] font-semibold transition flex items-center justify-center space-x-1"
                                title="Toggle Severity"
                              >
                                <Zap className="w-3 h-3 text-amber-600" />
                                <span>Severity</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedIncident(incident);
                                  setActiveView('case_tracking');
                                }}
                                className="flex-1 py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 text-blue-900 border border-slate-300 text-[10px] font-semibold transition flex items-center justify-center space-x-1"
                                title="Inspect in Citizen Consumer Case Tracker"
                              >
                                <Eye className="w-3 h-3 text-blue-700" />
                                <span>Citizen View</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-1">
                            <div className="flex items-center justify-center space-x-1 text-emerald-800 text-xs font-bold">
                              <Award className="w-3.5 h-3.5" />
                              <span>RESOLVED & AUDITED</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              By {incident.resolution?.resolvedByStaff}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedIncident(incident);
                                setActiveView('resolution_verification');
                              }}
                              className="w-full py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-bold transition flex items-center justify-center space-x-1"
                            >
                              <span>View Proof</span>
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
        </div>
      )}

      {/* MODAL 1: Assign Field Squad */}
      {assignModalIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-300 text-slate-900 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-800" />
                <h3 className="font-bold text-base text-slate-900">
                  Dispatch Squad to #{assignModalIncident.id}
                </h3>
              </div>
              <button onClick={() => setAssignModalIncident(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Municipal Field Unit:
                </label>
                <div className="space-y-2">
                  {QUICK_SQUADS.map((sq, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedSquad(sq)}
                      className={`p-2.5 rounded-lg border transition cursor-pointer text-xs space-y-1 ${
                        selectedSquad.name === sq.name 
                          ? 'border-blue-800 bg-blue-50 text-slate-900' 
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900">{sq.name}</span>
                        <span className="font-mono text-[10px] text-blue-800">{sq.vehicle}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Lead: {sq.staff}</span>
                        <span>{sq.dept}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Target Arrival ETA:</span>
                  <span className="font-mono text-blue-800 font-bold">{customEta} Minutes</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={90}
                  step={5}
                  value={customEta}
                  onChange={(e) => setCustomEta(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-800"
                />
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                <span className="font-bold block">Automated Citizen SMS Notification:</span>
                <p className="text-[11px] text-slate-700">
                  Citizen ({assignModalIncident.citizenContact}) will receive instant SMS confirmation of squad dispatch with live GPS tracking link.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalIncident(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-800 text-white text-xs font-bold hover:bg-blue-900 shadow-sm"
                >
                  Confirm Dispatch & Alert Citizen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Certify Resolution */}
      {resolveModalIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-300 text-slate-900 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base text-slate-900">
                  Certify Grievance Resolution #{resolveModalIncident.id}
                </h3>
              </div>
              <button onClick={() => setResolveModalIncident(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Certifying Municipal Officer Name:
                </label>
                <input
                  type="text"
                  value={resolutionOfficerName}
                  onChange={(e) => setResolutionOfficerName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Field Remediation & Audit Notes:
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1 text-xs text-emerald-950">
                <span className="font-bold block">Cryptographic Security Stamp:</span>
                <div className="flex items-center justify-between font-mono text-[10px] text-emerald-800">
                  <span>GPS Geofence Match: ±0.8m</span>
                  <span>SHA-256 [8f4a...29b1]</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalIncident(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-sm"
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
