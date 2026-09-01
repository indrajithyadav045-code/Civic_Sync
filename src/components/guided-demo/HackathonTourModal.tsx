import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Radio, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  Map, 
  RotateCcw,
  Volume2,
  FileCheck,
  Cpu,
  Building
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

const TOUR_STEPS = [
  {
    step: 0,
    title: '1. Ingestion & Preprocessing',
    view: 'report_issue',
    tag: 'GRIEVANCE REGISTRATION',
    icon: ShieldAlert,
    headline: 'Citizen Grievance Ingestion with GPS Lock',
    description: 'Citizen registers complaint with live GPS coordinate auto-detection and evidence photo. System locks record into PostgreSQL/PostGIS queue.',
    keyMetrics: ['Input: Natural language + Photo', 'Velachery GPS: 12.9815° N, 80.2180° E', 'Ingestion Latency: < 180ms']
  },
  {
    step: 1,
    title: '2. Multi-Stage AI Triage',
    view: 'ai_triage',
    tag: 'NEURAL CLASSIFICATION',
    icon: Cpu,
    headline: 'Multi-Stage Neural Triage & Decision Audit',
    description: 'NLP extracts intent and urgency. Computer Vision detects 2.5ft floodwaters and stalled vehicles. System assigns 94% confidence and routes to GCC Disaster Management.',
    keyMetrics: ['NLP: Intent & Entity Parsing', 'CV Bounding (YOLOv8/ViT)', 'Confidence: 94% | Severity: HIGH']
  },
  {
    step: 2,
    title: '3. 50-Meter Spatial Deduplication',
    view: 'dedup_lab',
    tag: 'POSTGIS SPATIAL DEDUP',
    icon: Layers,
    headline: 'PostGIS Haversine 50m Proximity Clustering',
    description: 'Spatial engine groups 3 duplicate citizen reports within 42m into 1 unified master work order in Velachery, preventing redundant field dispatch.',
    keyMetrics: ['Merge Radius: 50.0 Meters', 'Duplicates Merged: 3 Citizen Pings', 'Eliminates 75% Dispatch Redundancy']
  },
  {
    step: 3,
    title: '4. Operations Map & Spatial Risk',
    view: 'command_map',
    tag: 'GIS OPERATIONS MAP',
    icon: Map,
    headline: 'Contextual Proximity Risk Assessment',
    description: 'Cross-references proximity to DAV School (180m buffer) and Velachery low-lying flood basin, computing a composite Risk Score of 91/100.',
    keyMetrics: ['DAV School: 180m Buffer', 'Velachery Basin Zone 13: Active', 'Dynamic Risk Score: 91/100']
  },
  {
    step: 4,
    title: '5. ICCC Operations & Dynamic SLA',
    view: 'command_center',
    tag: 'GCC OPERATIONS KANBAN',
    icon: ShieldAlert,
    headline: 'Context-Aware Dynamic SLA Countdown',
    description: 'Standard 4-hour SLA is contextually accelerated to 02h:48m due to school zone proximity and high report frequency. GCC units are mobilized.',
    keyMetrics: ['Dynamic SLA: 02h:48m:31s', 'Accelerated by 90m (Contextual)', 'Assigned: GCC De-watering Squad 4']
  },
  {
    step: 5,
    title: '6. Emergency Geofenced Alerts',
    view: 'disaster_alerts',
    tag: 'GEOFENCED BROADCAST',
    icon: Radio,
    headline: 'Targeted Hazard Broadcast (Velachery)',
    description: 'Authorities configure a 650m danger perimeter. System calculates ~2,847 affected citizens and broadcasts targeted advisories via SMS/Push/Signage.',
    keyMetrics: ['Estimated Affected: 2,847 Citizens', 'Multi-Channel: SMS + App Push', 'Route 100ft Road Advisory Active']
  },
  {
    step: 6,
    title: '7. Public Case Tracking',
    view: 'case_tracking',
    tag: 'PUBLIC TRANSPARENCY',
    icon: ShieldAlert,
    headline: 'End-to-End Field Telemetry Tracking',
    description: 'Citizen tracks status live: Report Received → AI Triage → Department Assigned → De-watering Crew Dispatched with officer badge and timestamps.',
    keyMetrics: ['Officer: Capt. R. Selvam (GCC-882)', 'Status: High-Power Pumps Active', 'Zero Black-Box Opacity']
  },
  {
    step: 7,
    title: '8. Before/After CV Resolution Audit',
    view: 'resolution_verification',
    tag: 'PROOF OF RESOLUTION',
    icon: CheckCircle2,
    headline: 'AI Computer Vision Proof of Resolution',
    description: 'Remediated scene photo is verified by Computer Vision against the original incident, certifying 100% water clearance and EXIF GPS match with 97.4% accuracy.',
    keyMetrics: ['CV Verification Score: 97.4%', 'EXIF GPS Match: ±1.2m Tolerance', 'Status: AI-CERTIFIED RESOLVED']
  },
  {
    step: 8,
    title: '9. Predictive Civic Risk Forecast',
    view: 'risk_forecast',
    tag: 'PREDICTIVE MODELING',
    icon: TrendingUp,
    headline: '6-Hour Preemptive Hazard Modeling',
    description: 'Using precipitation radar and drainage saturation curves, CIVIC-SYNC forecasts flood risks across Chennai zones for preemptive pump staging.',
    keyMetrics: ['Next 6h Forecast: Zone A High Risk', 'Preemptive Action: 2 Mobile Pumps Staged', 'Prototype Forecast / Demo Simulation']
  }
];

export const HackathonTourModal: React.FC = () => {
  const { isDemoRunning, demoStep, jumpToDemoStep, stopHackathonDemo, playSound } = useCivic();
  const [autoPlay, setAutoPlay] = useState(false);

  const currentStep = TOUR_STEPS[demoStep] || TOUR_STEPS[0];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isDemoRunning && autoPlay) {
      interval = setInterval(() => {
        if (demoStep < TOUR_STEPS.length - 1) {
          jumpToDemoStep(demoStep + 1);
        } else {
          setAutoPlay(false);
        }
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isDemoRunning, autoPlay, demoStep, jumpToDemoStep]);

  if (!isDemoRunning) return null;

  const Icon = currentStep.icon;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-4xl">
      <div className="bg-white border-2 border-slate-300 rounded-lg p-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-blue-50 text-blue-900 border border-blue-200">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-900 rounded uppercase">
                  {currentStep.tag}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  STAGE {demoStep + 1} OF {TOUR_STEPS.length}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {currentStep.headline}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setAutoPlay(!autoPlay);
                playSound('beep');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded border transition ${
                autoPlay 
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {autoPlay ? '⏸ Pause Auto-Advance' : '▶ Auto-Advance (7s)'}
            </button>
            <button
              onClick={stopHackathonDemo}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close Walkthrough"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 text-sm">
          <div className="md:col-span-2 flex items-center">
            <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
              {currentStep.description}
            </p>
          </div>

          <div className="bg-slate-50 rounded p-3 border border-slate-200 flex flex-col justify-center space-y-1 font-mono text-[11px]">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">
              Live System Telemetry:
            </div>
            {currentStep.keyMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-slate-800">
                <span className="text-blue-700">›</span>
                <span>{metric}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress & Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="flex items-center space-x-1.5">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={idx}
                onClick={() => jumpToDemoStep(idx)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === demoStep 
                    ? 'w-6 bg-blue-800' 
                    : idx < demoStep 
                      ? 'w-2 bg-blue-300' 
                      : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Jump to ${step.title}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => jumpToDemoStep(Math.max(0, demoStep - 1))}
              disabled={demoStep === 0}
              className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 border border-slate-300 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {demoStep < TOUR_STEPS.length - 1 ? (
              <button
                onClick={() => jumpToDemoStep(demoStep + 1)}
                className="flex items-center space-x-1 px-3.5 py-1.5 rounded text-xs font-semibold bg-[#0f2a4a] hover:bg-[#1e3a5f] text-white transition"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  stopHackathonDemo();
                  playSound('success');
                }}
                className="flex items-center space-x-1 px-3.5 py-1.5 rounded text-xs font-semibold bg-green-700 hover:bg-green-800 text-white transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete Tour</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
