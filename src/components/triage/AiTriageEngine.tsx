import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  RotateCw,
  Building,
  Sliders,
  FileCode,
  Activity,
  FileCheck
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { AiVisionInspection } from '../vision/AiVisionInspection';

export const AiTriageEngine: React.FC = () => {
  const { 
    currentTriageIncident, 
    selectedIncident, 
    triageProgress, 
    isTriageActive, 
    runTriageAnimation,
    setActiveView,
    setSelectedIncident
  } = useCivic();

  const incident = currentTriageIncident || selectedIncident;
  const [activeTab, setActiveTab] = useState<'pipeline' | 'vision' | 'spatial_risk' | 'reasoning'>('pipeline');

  if (!incident) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active incident selected for triage analysis.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner with Re-run Triage Button */}
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-900 rounded uppercase">
                GCC AI TRIAGE ENGINE v3.8 • AUDIT TRAIL
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">COMPLAINT #{incident.id}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-sans mt-0.5">
              Automated Triage & Inter-Agency Dispatch Audit
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => runTriageAnimation(incident)}
            disabled={isTriageActive}
            className="flex items-center space-x-2 px-3.5 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs transition disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isTriageActive ? 'animate-spin text-blue-700' : ''}`} />
            <span>{isTriageActive ? 'PIPELINE RUNNING...' : 'Re-Run AI Triage'}</span>
          </button>

          <button
            onClick={() => {
              setSelectedIncident(incident);
              setActiveView('command_center');
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded bg-[#0f2a4a] hover:bg-[#1a3860] text-white font-semibold text-xs transition shadow-sm"
          >
            <span>Proceed to GCC Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Triage Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Card */}
        <div className="p-4 rounded-lg gov-card bg-white border border-slate-200 shadow-sm space-y-1.5">
          <div className="text-[11px] font-semibold uppercase text-slate-500 flex items-center justify-between">
            <span>Classified Category</span>
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
            {incident.category}
          </div>
          <div className="text-xs text-blue-800 font-semibold">
            NLP Confidence: <strong className="text-slate-900">{incident.aiConfidence}%</strong>
          </div>
        </div>

        {/* Severity Card */}
        <div className="p-4 rounded-lg gov-card bg-white border border-slate-200 shadow-sm space-y-1.5">
          <div className="text-[11px] font-semibold uppercase text-slate-500 flex items-center justify-between">
            <span>Evaluated Severity</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              incident.severity === 'CRITICAL' 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {incident.severity} PRIORITY
            </span>
            <span className="text-xs font-semibold text-slate-700">
              Risk: <strong className="text-amber-800">{incident.risk.totalScore}/100</strong>
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Spatial Proximity Index
          </div>
        </div>

        {/* Recommended Department Card */}
        <div className="p-4 rounded-lg gov-card bg-white border border-slate-200 shadow-sm space-y-1.5">
          <div className="text-[11px] font-semibold uppercase text-slate-500 flex items-center justify-between">
            <span>Routed Department</span>
            <Building className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
            {incident.recommendedDepartment}
          </div>
          <div className="text-xs text-slate-600 truncate">
            Unit: {incident.assignedTeam || 'GCC Rapid Unit Alpha-4'}
          </div>
        </div>

        {/* Contextual SLA Card */}
        <div className="p-4 rounded-lg gov-card bg-white border border-slate-200 shadow-sm space-y-1.5">
          <div className="text-[11px] font-semibold uppercase text-slate-500 flex items-center justify-between">
            <span>Dynamic Response SLA</span>
            <Clock className="w-3.5 h-3.5 text-green-600" />
          </div>
          <div className="text-lg font-bold text-green-800 font-mono">
            {Math.floor(incident.sla.remainingSeconds / 3600).toString().padStart(2, '0')}:
            {Math.floor((incident.sla.remainingSeconds % 3600) / 60).toString().padStart(2, '0')}:
            {(incident.sla.remainingSeconds % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-[11px] text-slate-500">
            Accelerated by 90m (School nearby)
          </div>
        </div>
      </div>

      {/* Visual Pipeline Stage Stepper */}
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-800" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Automated Decision Sequence Audit (7 Stages)
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            {isTriageActive ? '● Processing In Real Time' : '✓ 7/7 Verification Stages Completed'}
          </span>
        </div>

        {/* Pipeline Stage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 pt-1">
          {triageProgress.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border transition flex flex-col justify-between ${
                step.isProcessing
                  ? 'bg-blue-50 border-blue-600'
                  : step.isDone
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-slate-100 opacity-40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-500 font-bold">STAGE 0{idx + 1}</span>
                  {step.isProcessing ? (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  ) : step.isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  )}
                </div>
                <div className="text-[11px] font-bold text-slate-900 leading-tight">
                  {step.stepName}
                </div>
              </div>

              <div className="text-[9px] font-mono text-slate-600 mt-2 line-clamp-2">
                {step.dataSummary}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold transition ${
              activeTab === 'pipeline'
                ? 'bg-[#0f2a4a] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            AI Reasoning & Entity Logs
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold transition ${
              activeTab === 'vision'
                ? 'bg-[#0f2a4a] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Computer Vision Bounding ({incident.detectedObjects.length})
          </button>

          <button
            onClick={() => setActiveTab('spatial_risk')}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold transition ${
              activeTab === 'spatial_risk'
                ? 'bg-[#0f2a4a] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Spatial Dedup & Risk Breakdown
          </button>
        </div>

        {/* Tab 1: AI Reasoning */}
        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Automated Reasoning & Decision Audit Logs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured rationale generated by the civic triage model for complete public transparency:
              </p>
              
              <div className="space-y-2">
                {incident.aiReasoning.map((item, idx) => (
                  <div key={idx} className="p-3 rounded bg-slate-50 border border-slate-200 flex items-start space-x-2.5 text-xs text-slate-800">
                    <span className="text-blue-800 font-bold mt-0.5">›</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Extracted NLP Metadata Entities
              </h3>
              
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-600">Hazard Type:</span>
                  <span className="text-slate-900 font-bold">Flash Inundation</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-600">Corridor Status:</span>
                  <span className="text-red-700 font-bold">Velachery 100ft Blocked</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-600">School Proximity:</span>
                  <span className="text-amber-800 font-bold">DAV Public (180m)</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                  <span className="text-slate-600">Duplicate Pings:</span>
                  <span className="text-blue-800 font-bold">3 Reports (42m)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Computer Vision */}
        {activeTab === 'vision' && (
          <AiVisionInspection incident={incident} />
        )}

        {/* Tab 3: Spatial Risk Breakdown */}
        {activeTab === 'spatial_risk' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Spatial Risk Formula Breakdown ({incident.risk.totalScore}/100)
              </h3>
              
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Base Hazard Severity:</span>
                    <span className="text-slate-900 font-bold">+{incident.risk.baseScore} pts</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-700 h-full" style={{ width: `${incident.risk.baseScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>DAV School Proximity Bonus (180m):</span>
                    <span className="text-amber-700 font-bold">+{incident.risk.schoolProximityBonus} pts</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full" style={{ width: `${incident.risk.schoolProximityBonus * 5}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Apollo Hospital Corridor (620m):</span>
                    <span className="text-blue-700 font-bold">+{incident.risk.hospitalProximityBonus} pts</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${incident.risk.hospitalProximityBonus * 5}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Velachery Flood Basin Zone 13:</span>
                    <span className="text-red-700 font-bold">+{incident.risk.floodZoneBonus} pts</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full" style={{ width: `${incident.risk.floodZoneBonus * 10}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>50m Spatial Duplicate Cluster (3 reports):</span>
                    <span className="text-green-700 font-bold">+{incident.risk.duplicateClusterBonus} pts</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-600 h-full" style={{ width: `${incident.risk.duplicateClusterBonus * 6}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Context-Aware Dynamic SLA Formula
              </h3>
              
              <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                <div className="text-slate-600">
                  Standard Baseline SLA: <strong className="text-slate-900">04h:00m:00s</strong>
                </div>
                <div className="space-y-1 text-slate-700 pt-2 border-t border-slate-200">
                  {incident.sla.contextualReductionReasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-amber-700 font-bold">⚡</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-green-800">
                  <span>Computed Dynamic SLA:</span>
                  <span>02h:48m:31s</span>
                </div>
              </div>

              <button
                onClick={() => setActiveView('dedup_lab')}
                className="w-full py-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs transition flex items-center justify-center space-x-2"
              >
                <Layers className="w-4 h-4 text-blue-700" />
                <span>Open Spatial Deduplication Lab →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
