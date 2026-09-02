import React, { useState } from 'react';
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
  Car,
  Wind,
  Trash2,
  Droplet,
  Lightbulb,
  Building2,
  TreePine,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { BharatGovAiModal } from '../smartcity/BharatGovAiModal';

export const CitizenHome: React.FC = () => {
  const { setActiveView, incidents, alerts, setSelectedIncident, cityHealth, liveWeather, liveAqi, smartTraffic, playSound, t } = useCivic();
  const [isBharatGovModalOpen, setIsBharatGovModalOpen] = useState(false);

  const activeAlert = alerts[0];
  const highPriorityIncidents = incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Official Smart City Portal Banner */}
      <div className="gov-card rounded-lg p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
        <div className="max-w-4xl space-y-3.5">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
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
              onClick={() => setActiveView('command_center')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded bg-[#0f2a4a] hover:bg-[#1e3a5f] text-white font-semibold text-xs transition shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('icccCommandCenter')}</span>
            </button>

            <button
              onClick={() => setActiveView('command_map')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded bg-blue-800 hover:bg-blue-900 text-white font-semibold text-xs transition shadow-sm"
            >
              <Building className="w-4 h-4" />
              <span>{t('cityDigitalTwinMap')}</span>
            </button>

            <button
              onClick={() => setActiveView('report_issue')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-700" />
              <span>{t('homeLodgeBtn')}</span>
            </button>
          </div>
        </div>

        {/* Official Governance KPI Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase">{t('cityHealthScore')}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{cityHealth.overallScore} / 100</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{t('optimalMultiSignal')}</div>
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

      {/* Municipal Public Advisory & Weather Notice (Clean Blue Tone) */}
      {activeAlert && (
        <div className="p-4 sm:p-5 rounded-lg bg-blue-50/70 border border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 rounded bg-blue-800 text-white shrink-0 mt-0.5">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-blue-800 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  {t('municipalAdvisoryBadge')}
                </span>
                <span className="text-xs text-blue-900 font-bold uppercase">
                  {activeAlert.broadcastChannel}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">{activeAlert.title}</h2>
              <p className="text-xs text-slate-700 mt-0.5 max-w-3xl leading-relaxed">
                {activeAlert.message}
              </p>
              <div className="text-[11px] text-slate-600 font-mono mt-1">
                {t('advisoryZone')}: <strong>{activeAlert.targetZone}</strong> • {t('monitoredCorridor')}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('disaster_alerts')}
            className="px-4 py-2 rounded bg-blue-800 hover:bg-blue-900 text-white font-semibold text-xs whitespace-nowrap transition shadow-xs flex items-center justify-center space-x-1.5"
          >
            <span>{t('viewAdvisoryDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* BharatGov AI Scheme Discovery & Welfare Copilot Banner */}
      <div className="gov-card rounded-lg p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/30 text-white flex items-center justify-center shrink-0 text-xl border border-blue-400/30">
            🏛️
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                {t('bharatGovBadge')}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                bharathgovai.netlify.app
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white font-sans">{t('bharatGovHeading')}</h2>
            <p className="text-xs text-slate-200 max-w-3xl leading-relaxed">
              {t('bharatGovDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => {
              setIsBharatGovModalOpen(true);
              playSound('beep');
            }}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs whitespace-nowrap transition shadow-sm flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>{t('bharatGovAction')}</span>
          </button>
          <a
            href="https://bharathgovai.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition"
            title="Open BharatGov in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 4 Core Smart City Domain Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Domain 1: Traffic & Mobility */}
        <div 
          onClick={() => setActiveView('command_center')}
          className="gov-card p-4 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-blue-50 text-blue-800">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {smartTraffic.densityPct}% DENSITY
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900">{t('smartTrafficTitle')}</h4>
          <p className="text-[11px] text-slate-600 line-clamp-2">
            {t('smartTrafficDesc')}
          </p>
        </div>

        {/* Domain 2: Environment & Air Quality */}
        <div 
          onClick={() => setActiveView('command_center')}
          className="gov-card p-4 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-teal-50 text-teal-800">
              <Wind className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              AQI: {liveAqi?.aqi || 86}
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900">{t('cleanAirTitle')}</h4>
          <p className="text-[11px] text-slate-600 line-clamp-2">
            {t('cleanAirDesc')}
          </p>
        </div>

        {/* Domain 3: Solid Waste & Street Lighting */}
        <div 
          onClick={() => setActiveView('command_center')}
          className="gov-card p-4 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-amber-50 text-amber-800">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              94% ACTIVE
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900">{t('smartWasteTitle')}</h4>
          <p className="text-[11px] text-slate-600 line-clamp-2">
            {t('smartWasteDesc')}
          </p>
        </div>

        {/* Domain 4: Water & Public Infrastructure */}
        <div 
          onClick={() => setActiveView('command_center')}
          className="gov-card p-4 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-cyan-50 text-cyan-800">
              <Droplet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
              97% SCADA
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900">{t('waterNetworkTitle')}</h4>
          <p className="text-[11px] text-slate-600 line-clamp-2">
            {t('waterNetworkDesc')}
          </p>
        </div>
      </div>

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
              {t('featureMapTitle')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('featureMapDesc')}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-900">
            <span>{t('openSpatialTwin')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Active Public Grievance Feed */}
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{t('publicWorksFeedHeading')}</h3>
            <p className="text-xs text-slate-500">{t('publicWorksFeedSubheading')}</p>
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

      <BharatGovAiModal
        isOpen={isBharatGovModalOpen}
        onClose={() => setIsBharatGovModalOpen(false)}
      />
    </div>
  );
};
