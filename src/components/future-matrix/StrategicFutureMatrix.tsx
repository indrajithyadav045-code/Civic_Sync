import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Cpu, 
  Radio, 
  Database, 
  Terminal, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Calculator, 
  FileCode, 
  ExternalLink,
  ChevronRight,
  X,
  Zap,
  Activity,
  GitBranch,
  Network
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

interface PhaseDetail {
  id: string;
  phaseNum: number;
  timeframe: string;
  name: string;
  tag: string;
  tagColor: string;
  borderColor: string;
  bgGlow: string;
  summary: string;
  pillars: { title: string; desc: string; icon: any }[];
  techStack: string[];
  architectureAscii: string;
  roiDefaults: {
    monthlyDispatchesAvoided: number;
    laborHoursSaved: number;
    fuelSavedLiters: number;
    costPerDispatchInr: number;
  };
  apiEndpoints: {
    method: 'GET' | 'POST' | 'WS';
    path: string;
    description: string;
    sampleCurl: string;
    sampleResponse: string;
  }[];
}

const PHASES: PhaseDetail[] = [
  {
    id: 'phase-1',
    phaseNum: 1,
    timeframe: '0–3 Months',
    name: 'Foundation Layer & Real-Time GIS Core',
    tag: 'ACTIVE // PRODUCTION CORE',
    tagColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500/30 hover:border-emerald-400',
    bgGlow: 'from-emerald-950/20 via-slate-900/60 to-[#07090e]',
    summary: 'Sub-50ms PostGIS Haversine clustering and YOLOv8 computer vision engine suppressing 40% duplicate municipal dispatches across Chennai wards.',
    pillars: [
      {
        title: '50-Meter PostGIS Spatial Deduplication (ST_DWithin)',
        desc: 'Spatial indexing clusters redundant citizen photos within 50m into single consolidated work orders, eliminating overlapping squad mobilization.',
        icon: Layers
      },
      {
        title: 'Sub-50ms YOLOv8 Vision Hazard Classification',
        desc: 'Edge-optimized Vision Transformer and YOLOv8 inference detecting waterlogging, asphalt craters, and fallen lines with 94%+ precision.',
        icon: Cpu
      },
      {
        title: 'Live Bidirectional WebSockets Command HUD',
        desc: 'Instant push stream linking field engineers, ward corporators, and citizen tracking devices with sub-second event bus propagation.',
        icon: Radio
      }
    ],
    techStack: ['Next.js 15 PWA', 'FastAPI Python 3.12', 'PostgreSQL 16 + PostGIS 3.4', 'Ultralytics YOLOv8n', 'WebSocket RFC 6455'],
    architectureAscii: `
+------------------+      +--------------------+      +--------------------+
| Citizen PWA /    | ---> | FastAPI Ingest API | ---> | YOLOv8 Vision Model|
| GPS Camera Intake|      | Rate-Limited Token |      | Classify & Bounding|
+------------------+      +--------------------+      +--------------------+
                                    |                           |
                                    v                           v
                          +--------------------+      +--------------------+
                          | PostGIS ST_DWithin | <--- | Spatial Risk Engine|
                          | 50m Radius Cluster |      | School/Hospital 180|
                          +--------------------+      +--------------------+
                                    |
                                    v
                          +--------------------+
                          | WebSocket Stream   | ---> [ICCC Command Map HUD]
                          | Live Ward Dispatch |
                          +--------------------+`,
    roiDefaults: {
      monthlyDispatchesAvoided: 1420,
      laborHoursSaved: 3800,
      fuelSavedLiters: 5200,
      costPerDispatchInr: 850
    },
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v1/spatial/dedup-check',
        description: 'Performs sub-15ms PostGIS Haversine proximity query to discover existing master tickets within 50m radius.',
        sampleCurl: `curl -X POST https://civic-sync.gov.in/api/v1/spatial/dedup-check \\
  -H "Content-Type: application/json" \\
  -d '{"lat": 12.9815, "lng": 80.2180, "category": "Flooding", "radius_m": 50.0}'`,
        sampleResponse: `{
  "status": "CLUSTERED",
  "is_duplicate": true,
  "master_incident_id": "CS-7421",
  "distance_meters": 28.4,
  "execution_time_ms": 11.4,
  "duplicates_merged_count": 3
}`
      },
      {
        method: 'GET',
        path: '/api/v1/incidents/active-stream',
        description: 'Streams verified ward-level civic telemetry with PostGIS bounding boxes and SLA timers.',
        sampleCurl: `curl -X GET "https://civic-sync.gov.in/api/v1/incidents/active-stream?zone=13"`,
        sampleResponse: `{
  "zone": "Zone 13 (Velachery/Guindy)",
  "active_count": 18,
  "postgis_clusters": 4,
  "sla_compliance_rate": 96.2,
  "generated_at": "2026-09-01T22:58:00Z"
}`
      }
    ]
  },
  {
    id: 'phase-2',
    phaseNum: 2,
    timeframe: '3–9 Months',
    name: 'Resilient Infrastructure & Urban Transit',
    tag: 'DEVELOPMENT // ACTIVE PILOT',
    tagColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
    borderColor: 'border-cyan-500/30 hover:border-cyan-400',
    bgGlow: 'from-cyan-950/20 via-slate-900/60 to-[#07090e]',
    summary: 'Autonomous bus transit rerouting over flooded corridors, decentralized LoRaWAN emergency fallback, and Whisper multilingual voice grievance intake.',
    pillars: [
      {
        title: 'GTFS-Realtime Transit Routing & Bus Bypass',
        desc: 'Ingests MTC bus telemetry feeds (GTFS-RT) to calculate instant dynamic diversions around flooded streets and pothole craters.',
        icon: Compass
      },
      {
        title: 'IoT LoRaWAN Mesh Fallback During Grid Outages',
        desc: 'Battery-powered 868MHz LoRa mesh nodes relaying critical community SOS pings even when 4G/5G cellular towers fail during extreme cyclones.',
        icon: Network
      },
      {
        title: 'Regional Multilingual Voice Grievance Intake',
        desc: 'Web Speech API + OpenAI Whisper Edge models transcribing conversational Tamil, Telugu, and Hindi voice notes into structured tickets.',
        icon: Sparkles
      }
    ],
    techStack: ['GTFS-RT Protobuf', 'LoRaWAN SX1262 Gateway', 'Open311 Schema RFC', 'OpenAI Whisper Edge', 'Leaflet VectorGrid'],
    architectureAscii: `
+-------------------+      +--------------------+      +--------------------+
| Citizen Voice /   | ---> | Whisper Audio Pipe | ---> | Structured JSON    |
| Tamil/Hindi Speech|      | ASR Transcription  |      | Ticket Generation  |
+-------------------+      +--------------------+      +--------------------+
                                                                  |
+-------------------+      +--------------------+                 v
| LoRaWAN 868MHz    | ---> | Emergency Mesh     | ---> [CIVIC-SYNC Master   ]
| Solar SOS Beacons |      | Gateway Aggregator |      [Spatial Database    ]
+-------------------+      +--------------------+                 ^
                                                                  |
+-------------------+      +--------------------+                 |
| MTC GTFS-Realtime | ---> | Route Deviation    | ----------------+
| Transit Feed Ingest      | Corridor Engine    |
+-------------------+      +--------------------+`,
    roiDefaults: {
      monthlyDispatchesAvoided: 3200,
      laborHoursSaved: 7400,
      fuelSavedLiters: 14800,
      costPerDispatchInr: 920
    },
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v2/transit/gtfs-reroute',
        description: 'Calculates dynamic bus bypass routes avoiding active flood polygons and major road blockages.',
        sampleCurl: `curl -X POST https://civic-sync.gov.in/api/v2/transit/gtfs-reroute \\
  -H "Content-Type: application/json" \\
  -d '{"route_id": "570A", "hazard_geofence_id": "CS-7421"}'`,
        sampleResponse: `{
  "route_id": "570A",
  "status": "REROUTED",
  "avoided_corridor": "Velachery 100ft Bypass",
  "alternative_corridor": "OMR Radial Link Road",
  "estimated_delay_minutes": 6.5,
  "buses_notified": 14
}`
      },
      {
        method: 'POST',
        path: '/api/v2/voice/transcribe-intake',
        description: 'Transcribes regional audio voice note and automatically extracts category and GPS intent.',
        sampleCurl: `curl -X POST https://civic-sync.gov.in/api/v2/voice/transcribe-intake \\
  -F "audio=@citizen_complaint_tamil.wav"`,
        sampleResponse: `{
  "language": "ta (Tamil)",
  "transcript": "வேளச்சேரி பள்ளி அருகில் பெரிய பள்ளம் ஏற்பட்டுள்ளது.",
  "extracted_category": "Roads & Potholes",
  "confidence": 0.96,
  "assigned_department": "PWD"
}`
      }
    ]
  },
  {
    id: 'phase-3',
    phaseNum: 3,
    timeframe: '9–18 Months',
    name: 'Autonomous Urban Intelligence & National Grid',
    tag: 'NORTH STAR // SYSTEMIC GOVERNANCE',
    tagColor: 'bg-purple-950 text-purple-300 border-purple-500/40',
    borderColor: 'border-purple-500/30 hover:border-purple-400',
    bgGlow: 'from-purple-950/20 via-slate-900/60 to-[#07090e]',
    summary: 'Waste management truck cameras for passive automated road scanning, hydrological raster flood simulations, and NDMA / SACHET national bridge.',
    pillars: [
      {
        title: 'Edge AI Waste Fleet Integration (Passive Road Scan)',
        desc: 'Camera units on 450+ municipal garbage compactor trucks scan road surfaces on daily routes, reporting asphalt cracks before citizens notice.',
        icon: Zap
      },
      {
        title: 'Predictive GIS Hydrological Raster Modeling',
        desc: 'Combines ISRO satellite DEM topography, rainfall Doppler radar, and stormwater canal dimensions to predict inundation 6 hours in advance.',
        icon: Activity
      },
      {
        title: 'NDMA / SACHET & Open311 National Interoperability',
        desc: 'Bidirectional integration with the National Disaster Management Authority using Common Alerting Protocol (CAP v1.2) standards.',
        icon: ShieldCheck
      }
    ],
    techStack: ['Edge TPU / TensorRT', 'PostGIS Raster ST_Clip', 'CAP v1.2 XML/JSON', 'ISRO Bhuvan GIS', 'Apache Kafka'],
    architectureAscii: `
+---------------------+      +--------------------+      +--------------------+
| 450+ Municipal Waste| ---> | Edge TPU Camera    | ---> | Autonomous Pothole |
| Compactor Fleet     |      | Real-Time Pothole  |      | GIS Ingestion Mesh |
+---------------------+      +--------------------+      +--------------------+
                                                                    |
+---------------------+      +--------------------+                 v
| ISRO DEM Elevation  | ---> | Hydrological Soil  | ---> [Predictive City     ]
| + Doppler Radar     |      | Saturation Model   |      [Inundation Grid     ]
+---------------------+      +--------------------+                 ^
                                                                    |
+---------------------+      +--------------------+                 |
| National NDMA /     | <--- | CAP v1.2 XML/JSON  | ----------------+
| SACHET Bridge       | ---> | Broadcast Protocol |
+---------------------+      +--------------------+`,
    roiDefaults: {
      monthlyDispatchesAvoided: 6800,
      laborHoursSaved: 18500,
      fuelSavedLiters: 34000,
      costPerDispatchInr: 980
    },
    apiEndpoints: [
      {
        method: 'POST',
        path: '/api/v3/ndma/cap-broadcast',
        description: 'Dispatches nationwide CAP v1.2 standardized emergency alert payload to telecom cell broadcast gateways.',
        sampleCurl: `curl -X POST https://civic-sync.gov.in/api/v3/ndma/cap-broadcast \\
  -H "Content-Type: application/json" \\
  -d '{"event": "Urban Flash Flood", "urgency": "Immediate", "polygon": [[80.21, 12.98], [80.22, 12.99]]}'`,
        sampleResponse: `{
  "cap_identifier": "NDMA-TN-2026-0982",
  "status": "BROADCAST_TRANSMITTED",
  "target_population_estimate": 142000,
  "channels": ["Cell Broadcast", "SMS", "Radio DVB", "Mobile Push"]
}`
      },
      {
        method: 'GET',
        path: '/api/v3/edge-fleet/telemetry',
        description: 'Returns real-time road condition scan telemetry from municipal waste compactor camera fleets.',
        sampleCurl: `curl -X GET "https://civic-sync.gov.in/api/v3/edge-fleet/telemetry"`,
        sampleResponse: `{
  "active_scanning_trucks": 412,
  "road_km_scanned_today": 1840,
  "potholes_autodetected": 89,
  "work_orders_autogenerated": 34
}`
      }
    ]
  }
];

export const StrategicFutureMatrix: React.FC = () => {
  const { setActiveView } = useCivic();
  const [selectedPhase, setSelectedPhase] = useState<PhaseDetail | null>(PHASES[0]);
  const [drawerTab, setDrawerTab] = useState<'architecture' | 'roi' | 'api'>('architecture');

  // ROI Calculator Interactive State
  const [dispatchVolume, setDispatchVolume] = useState<number>(selectedPhase?.roiDefaults.monthlyDispatchesAvoided || 1500);
  const [costPerDispatch, setCostPerDispatch] = useState<number>(850);

  const calculateTotalAnnualSavingsLakhs = () => {
    const monthlySavings = dispatchVolume * costPerDispatch;
    const annualSavingsInr = monthlySavings * 12;
    return (annualSavingsInr / 100000).toFixed(2);
  };

  const calculateAnnualLaborHoursSaved = () => {
    const hoursPerDispatch = 2.5;
    return (dispatchVolume * hoursPerDispatch * 12).toLocaleString();
  };

  const calculateAnnualFuelSavedLiters = () => {
    const litersPerDispatch = 3.6;
    return (dispatchVolume * litersPerDispatch * 12).toLocaleString();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[#0D111A] border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>STRATEGIC FUTURE MATRIX // ROADMAP HORIZON</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            AI Spatial Civic Governance & Urban Scaling Roadmap
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            A 3-phased strategic trajectory scaling CIVIC-SYNC from a 50-meter deduplication core into a fully autonomous, predictive smart city governance grid.
          </p>

          <div className="flex flex-wrap gap-4 pt-3 text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>PHASE 1: 100% OPERATIONAL IN GCC</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>PHASE 2: PILOT IN TRANSIT</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>PHASE 3: NATIONAL NDMA GRID</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2x2 Interactive Horizon Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PHASES.map((phase) => {
          const isSelected = selectedPhase?.id === phase.id;
          return (
            <div
              key={phase.id}
              onClick={() => {
                setSelectedPhase(phase);
                setDispatchVolume(phase.roiDefaults.monthlyDispatchesAvoided);
              }}
              className={`rounded-2xl p-6 bg-gradient-to-b ${phase.bgGlow} border-2 transition-all cursor-pointer relative flex flex-col justify-between shadow-xl ${
                isSelected 
                  ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-cyan-900/30' 
                  : `${phase.borderColor} hover:translate-y-[-2px]`
              }`}
            >
              <div className="space-y-4">
                {/* Phase Badge & Timeframe */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border ${phase.tagColor}`}>
                    {phase.tag}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    {phase.timeframe}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    PHASE 0{phase.phaseNum}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {phase.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {phase.summary}
                </p>

                {/* 3 Core Pillars */}
                <div className="space-y-2.5 pt-2">
                  {phase.pillars.map((pillar, i) => {
                    const Icon = pillar.icon;
                    return (
                      <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
                          <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{pillar.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal pl-5.5">
                          {pillar.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Tech Badges */}
                <div className="pt-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1.5 font-bold">
                    Core Technologies:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.techStack.map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 font-mono text-[10px] border border-slate-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 flex items-center space-x-1">
                  <span>Explore Architecture & ROI</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
                {isSelected && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px] font-mono">
                    VIEWING
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Technical Drawer Section */}
      {selectedPhase && (
        <div className="rounded-2xl p-6 sm:p-8 bg-[#0D111A] border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${selectedPhase.tagColor}`}>
                  PHASE {selectedPhase.phaseNum}
                </span>
                <h2 className="text-2xl font-bold text-white font-sans">
                  {selectedPhase.name} • Technical Deep Dive
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Explore systemic architecture, municipal return on investment (ROI), and live open API endpoints.
              </p>
            </div>

            {/* Navigation Tab Switcher */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setDrawerTab('architecture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  drawerTab === 'architecture'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Architecture Flow</span>
              </button>

              <button
                onClick={() => setDrawerTab('roi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  drawerTab === 'roi'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>ROI Calculator</span>
              </button>

              <button
                onClick={() => setDrawerTab('api')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  drawerTab === 'api'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Open APIs</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Architecture Flow Diagram */}
          {drawerTab === 'architecture' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                  <span>System Architecture & Telemetry Pipeline</span>
                </h4>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                  Zero-Redundancy Verified
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black border border-slate-800 overflow-x-auto">
                <pre className="font-mono text-xs text-cyan-300 leading-relaxed select-all">
                  {selectedPhase.architectureAscii}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-white">High-Throughput Ingestion</div>
                  <p className="text-[11px] text-slate-400">
                    FastAPI asynchronous event loops capable of handling 5,000+ simultaneous GPS grievance transmissions.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-white">Sub-15ms Spatial Indexing</div>
                  <p className="text-[11px] text-slate-400">
                    PostGIS GIST R-Tree indexes calculating Haversine distance matches in under 15ms.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-white">Explainable AI Audit Logs</div>
                  <p className="text-[11px] text-slate-400">
                    Every ticket records its ViT confidence scores, school distance metrics, and dispatch reasoning.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Municipal ROI Calculator */}
          {drawerTab === 'roi' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Municipal Return on Investment (ROI) & Savings Calculator</span>
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  LIVE INTERACTIVE ALGORITHM
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Controls */}
                <div className="lg:col-span-6 space-y-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Monthly Redundant Dispatches Suppressed (50m Dedup):</span>
                      <span className="font-mono text-cyan-400 font-bold">{dispatchVolume.toLocaleString()} Dispatches</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={10000}
                      step={50}
                      value={dispatchVolume}
                      onChange={(e) => setDispatchVolume(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Average Cost per Municipal Field Dispatch (Fuel + Crew):</span>
                      <span className="font-mono text-emerald-400 font-bold">₹{costPerDispatch} / dispatch</span>
                    </div>
                    <input
                      type="range"
                      min={400}
                      max={2000}
                      step={50}
                      value={costPerDispatch}
                      onChange={(e) => setCostPerDispatch(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>
                </div>

                {/* KPI Metrics Output */}
                <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-300 font-semibold uppercase">
                      ANNUAL TAXPAYER SAVINGS
                    </span>
                    <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                      ₹{calculateTotalAnnualSavingsLakhs()} <span className="text-sm">Lakhs</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Direct operational cost reduction</span>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-300 font-semibold uppercase">
                      ANNUAL FIELD HOURS SAVED
                    </span>
                    <div className="text-3xl font-extrabold text-cyan-300 font-mono">
                      {calculateAnnualLaborHoursSaved()} <span className="text-sm">hrs</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Reallocated to actual repair works</span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1">
                    <span className="text-[10px] font-mono text-amber-300 font-semibold uppercase">
                      FLEET DIESEL SAVED
                    </span>
                    <div className="text-2xl font-bold text-amber-300 font-mono">
                      {calculateAnnualFuelSavedLiters()} <span className="text-sm">Liters</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Reduced carbon footprint</span>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-1">
                    <span className="text-[10px] font-mono text-purple-300 font-semibold uppercase">
                      SLA RESPONSE TIME
                    </span>
                    <div className="text-2xl font-bold text-purple-300 font-mono">
                      70% <span className="text-sm">Faster</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Average resolution under 3 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Open API Endpoints */}
          {drawerTab === 'api' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Production Open API Endpoints ({selectedPhase.name})</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Open311 / REST / WebSockets</span>
              </div>

              <div className="space-y-4">
                {selectedPhase.apiEndpoints.map((endpoint, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          endpoint.method === 'POST' ? 'bg-emerald-900 text-emerald-200' : 'bg-blue-900 text-blue-200'
                        }`}>
                          {endpoint.method}
                        </span>
                        <span className="font-mono text-xs font-bold text-white">{endpoint.path}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{endpoint.description}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase mb-1 font-bold">Request cURL:</div>
                        <div className="p-3 rounded-lg bg-black text-[11px] font-mono text-cyan-300 overflow-x-auto">
                          <pre>{endpoint.sampleCurl}</pre>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase mb-1 font-bold">Sample Response:</div>
                        <div className="p-3 rounded-lg bg-black text-[11px] font-mono text-emerald-400 overflow-x-auto">
                          <pre>{endpoint.sampleResponse}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
