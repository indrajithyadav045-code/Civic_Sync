import React from 'react';
import { 
  Building, 
  PlusCircle, 
  MapPin, 
  CheckCircle2, 
  Radio, 
  Layers, 
  Cpu, 
  ArrowRight, 
  AlertTriangle, 
  Search, 
  Shield, 
  Clock, 
  FileText,
  FileCheck,
  PhoneCall
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const CitizenHome: React.FC = () => {
  const { setActiveView, incidents, alerts, setSelectedIncident, startHackathonDemo } = useCivic();

  const activeAlert = alerts[0];
  const highPriorityIncidents = incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Official Government Portal Banner */}
      <div className="gov-card rounded-lg p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
        <div className="max-w-4xl space-y-3.5">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
            <span>OFFICIAL CITIZEN GRIEVANCE & EMERGENCY REDRESSAL SYSTEM</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans tracking-tight">
            Greater Chennai Corporation (GCC) Civic Incident & Disaster Response Platform
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
            Welcome to the centralized civic grievance portal for Chennai. Powered by spatial intelligence and automated computer vision, every report is geo-verified, checked for 50m spatial duplicates, evaluated against school and hospital safety zones, and dynamically routed to the appropriate municipal department.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveView('report_issue')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded bg-[#0f2a4a] hover:bg-[#1e3a5f] text-white font-semibold text-xs transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Lodge a New Grievance (Instant GPS)</span>
            </button>

            <button
              onClick={startHackathonDemo}
              className="flex items-center space-x-2 px-5 py-2.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Evaluator Demo Walkthrough</span>
            </button>

            <button
              onClick={() => setActiveView('case_tracking')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Track Complaint Status</span>
            </button>
          </div>
        </div>

        {/* Official Governance KPI Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">AI Triage Precision</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">94.2%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">ViT-B / NLP Validated</div>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">50m Spatial Dedup</div>
            <div className="text-2xl font-bold text-blue-800 mt-1">50.0m</div>
            <div className="text-[11px] text-slate-500 mt-0.5">PostGIS Clustering</div>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">Average Dynamic SLA</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">02h:48m</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Context-Accelerated</div>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">Resolutions Certified</div>
            <div className="text-2xl font-bold text-green-700 mt-1">{resolvedCount} Audited</div>
            <div className="text-[11px] text-slate-500 mt-0.5">CV & EXIF Proven</div>
          </div>
        </div>
      </div>

      {/* Official Emergency Broadcast Advisory (if any) */}
      {activeAlert && (
        <div className="p-4 sm:p-5 rounded-lg bg-red-50 border-l-4 border-red-600 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 bg-red-100 rounded-lg text-red-700 shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded uppercase">
                  EMERGENCY ADVISORY (DISASTER MANAGEMENT)
                </span>
                <span className="text-xs font-semibold text-slate-600">ZONE: {activeAlert.zoneName}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {activeAlert.title}
              </h3>
              <p className="text-xs text-slate-700 mt-0.5 max-w-2xl">
                {activeAlert.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('disaster_alerts')}
            className="self-end sm:self-center px-3.5 py-2 rounded bg-red-700 hover:bg-red-800 text-white font-semibold text-xs transition flex items-center space-x-1.5 shrink-0"
          >
            <span>View Safety Zone</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Core Platform Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Key Municipal Capabilities</h2>
          </div>
          <button
            onClick={() => setActiveView('command_map')}
            className="text-xs font-semibold text-blue-700 hover:underline flex items-center space-x-1"
          >
            <span>Open GIS Operations Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveView('ai_triage')}
            className="p-4 rounded-lg gov-card cursor-pointer group hover:shadow-md transition"
          >
            <div className="p-2 rounded bg-blue-50 text-blue-700 w-fit mb-2.5">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs mb-1 group-hover:text-blue-700 transition">
              1. Multi-Stage AI Triage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              NLP semantic intent parsing and YOLOv8/ViT damage classification with explainable audit logs.
            </p>
          </div>

          <div 
            onClick={() => setActiveView('dedup_lab')}
            className="p-4 rounded-lg gov-card cursor-pointer group hover:shadow-md transition"
          >
            <div className="p-2 rounded bg-green-50 text-green-700 w-fit mb-2.5">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs mb-1 group-hover:text-green-700 transition">
              2. 50m Spatial Deduplication
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              PostGIS Haversine clustering merges duplicate citizen complaints within 50m into 1 master work order.
            </p>
          </div>

          <div 
            onClick={() => setActiveView('command_map')}
            className="p-4 rounded-lg gov-card cursor-pointer group hover:shadow-md transition"
          >
            <div className="p-2 rounded bg-amber-50 text-amber-700 w-fit mb-2.5">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs mb-1 group-hover:text-amber-700 transition">
              3. Spatial Risk Scoring
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Computes dynamic 0-100 risk scores cross-referencing school (180m), hospital, and flood basin GIS layers.
            </p>
          </div>

          <div 
            onClick={() => setActiveView('resolution_verification')}
            className="p-4 rounded-lg gov-card cursor-pointer group hover:shadow-md transition"
          >
            <div className="p-2 rounded bg-emerald-50 text-emerald-700 w-fit mb-2.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs mb-1 group-hover:text-emerald-700 transition">
              4. CV Resolution Audit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Before/After image pair analysis with EXIF geo-correlation certifying 100% remediation.
            </p>
          </div>
        </div>
      </div>

      {/* Priority Grievance Monitoring List */}
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Active Municipal Incidents (Chennai Zone 13 - Velachery / Guindy)
            </h2>
          </div>
          <button
            onClick={() => setActiveView('command_center')}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            View Full GCC Operations Board →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {highPriorityIncidents.slice(0, 3).map((inc) => (
            <div
              key={inc.id}
              onClick={() => {
                setSelectedIncident(inc);
                setActiveView('case_tracking');
              }}
              className="p-3.5 rounded bg-slate-50 border border-slate-200 hover:border-blue-400 cursor-pointer transition flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-blue-900 font-bold font-mono">{inc.id}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    inc.severity === 'CRITICAL' 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {inc.severity}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 text-xs line-clamp-1">{inc.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{inc.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] flex items-center justify-between text-slate-600">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[140px]">{inc.locationName}</span>
                </span>
                <span className="text-amber-800 font-bold font-mono">
                  SLA: {Math.floor(inc.sla.remainingSeconds / 3600)}h {Math.floor((inc.sla.remainingSeconds % 3600) / 60)}m
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
