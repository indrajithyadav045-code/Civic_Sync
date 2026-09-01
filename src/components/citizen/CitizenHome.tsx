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
  Activity,
  LayoutDashboard,
  FileCheck,
  PhoneCall
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const CitizenHome: React.FC = () => {
  const { setActiveView, incidents, alerts, setSelectedIncident, cityHealth, t } = useCivic();

  const activeAlert = alerts[0];
  const highPriorityIncidents = incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Official Government Portal Banner */}
      <div className="gov-card rounded-lg p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
        <div className="max-w-4xl space-y-3.5">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
            <span>{t('homePortalBadge')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans tracking-tight">
            {t('homeHeading')}
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
            {t('homeDescription')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveView('report_issue')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded bg-[#0f2a4a] hover:bg-[#1e3a5f] text-white font-semibold text-xs transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('homeLodgeBtn')}</span>
            </button>

            <button
              onClick={() => setActiveView('command_center')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded bg-blue-800 hover:bg-blue-900 text-white font-semibold text-xs transition shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Smart City ICCC Command Center</span>
            </button>

            <button
              onClick={() => setActiveView('case_tracking')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('homeTrackBtn')}</span>
            </button>
          </div>
        </div>

        {/* Official Governance KPI Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">CITY HEALTH SCORE</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{cityHealth.overallScore} / 100</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Optimal • Live Multi-Signal</div>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">{t('kpiSpatialDedup')}</div>
            <div className="text-2xl font-bold text-blue-800 mt-1">50.0m</div>
            <div className="text-[11px] text-slate-500 mt-0.5">PostGIS Clustering</div>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">{t('kpiDynamicSla')}</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">02h:48m</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Context-Accelerated</div>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">{t('kpiResolutions')}</div>
            <div className="text-2xl font-bold text-green-700 mt-1">{resolvedCount} Audited</div>
            <div className="text-[11px] text-slate-500 mt-0.5">CV & EXIF Proven</div>
          </div>
        </div>
      </div>

      {/* Emergency Broadcast Alert Banner */}
      {activeAlert && (
        <div className="p-4 sm:p-5 rounded-lg bg-red-50 border-2 border-red-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 rounded bg-red-600 text-white shrink-0 mt-0.5">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  {t('alertLiveBadge')}
                </span>
                <span className="text-xs text-red-900 font-bold uppercase">
                  {activeAlert.broadcastChannel}
                </span>
              </div>
              <h2 className="text-base font-bold text-red-950 mt-1">{activeAlert.title}</h2>
              <p className="text-xs text-red-900 mt-0.5 max-w-3xl leading-relaxed">
                {activeAlert.message}
              </p>
              <div className="text-[11px] text-red-800 font-mono mt-1">
                Affected: <strong>{activeAlert.targetZone}</strong> • Est. Population: {activeAlert.affectedCitizensEstimate.toLocaleString()}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('disaster_alerts')}
            className="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white font-semibold text-xs whitespace-nowrap transition shadow-xs flex items-center justify-center space-x-1.5"
          >
            <span>{t('alertViewDetailsBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: AI Triage & ViT Vision Engine */}
        <div 
          onClick={() => setActiveView('ai_triage')}
          className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {t('featureTriageTitle')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('featureTriageDesc')}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-900">
            <span>{t('featureTriageAction')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: 50m Spatial Deduplication */}
        <div 
          onClick={() => setActiveView('dedup_lab')}
          className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {t('featureDedupTitle')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('featureDedupDesc')}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-900">
            <span>{t('featureDedupAction')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: City Digital Twin GIS Map */}
        <div 
          onClick={() => setActiveView('command_map')}
          className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              City Digital Twin & Spatial Map
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-layer GIS operations map tracking traffic corridors, flood drainage basins, air quality stations, water telemetry, and emergency fleets.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-900">
            <span>Open Spatial Twin</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Active Incident Feed Section */}
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{t('feedHeading')}</h3>
            <p className="text-xs text-slate-500">{t('feedSubheading')}</p>
          </div>

          <button
            onClick={() => setActiveView('command_center')}
            className="text-xs text-blue-800 hover:underline font-semibold flex items-center space-x-1"
          >
            <span>{t('feedViewAllBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highPriorityIncidents.slice(0, 3).map((incident) => (
            <div
              key={incident.id}
              onClick={() => {
                setSelectedIncident(incident);
                setActiveView('case_tracking');
              }}
              className="p-3.5 rounded border border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-white cursor-pointer transition space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-blue-900">#{incident.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  incident.severity === 'CRITICAL' 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {incident.severity}
                </span>
              </div>

              <h4 className="font-semibold text-slate-900 text-xs line-clamp-1">
                {incident.title}
              </h4>

              <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{incident.locationName}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">SLA:</span>
                <span className="font-mono font-bold text-amber-700">
                  {Math.floor(incident.sla.remainingSeconds / 3600)}h {Math.floor((incident.sla.remainingSeconds % 3600) / 60)}m
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
