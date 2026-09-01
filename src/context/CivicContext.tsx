import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Incident, 
  EmergencyBroadcast, 
  ForecastHotspot, 
  IncidentStatus,
  CityHealthMetrics,
  SmartTrafficData,
  FloodDrainageIntelligence,
  SmartStreetLighting,
  SmartWasteData,
  SmartWaterData,
  EnvironmentAqiData,
  EmergencyFleetTelemetry,
  SmartParkingData,
  CityLiveEvent,
  AiCityInsight,
  DigitalTwinLayers
} from '../types';
import { MOCK_INCIDENTS, MOCK_EMERGENCY_ALERTS, MOCK_FORECAST_HOTSPOTS } from '../data/mockData';
import { 
  MOCK_CITY_HEALTH, 
  MOCK_SMART_TRAFFIC, 
  MOCK_FLOOD_INTELLIGENCE, 
  MOCK_SMART_LIGHTING, 
  MOCK_SMART_WASTE, 
  MOCK_SMART_WATER, 
  MOCK_ENVIRONMENT_AQI, 
  MOCK_EMERGENCY_FLEET, 
  MOCK_SMART_PARKING, 
  MOCK_LIVE_EVENTS, 
  MOCK_AI_CITY_INSIGHT,
  INITIAL_DIGITAL_TWIN_LAYERS
} from '../data/smartCityData';
import { WeatherProvider } from '../services/providers/weatherProvider';
import { AqiProvider } from '../services/providers/aqiProvider';
import { TrafficProvider } from '../services/providers/trafficProvider';
import { IotProvider } from '../services/providers/iotProvider';
import { LiveWeatherData, LiveAqiData } from '../services/providers/types';
import { calculateDynamicCityHealth } from '../services/calculators/dynamicCityHealth';
import { calculateDynamicFloodIntelligence } from '../services/calculators/dynamicFloodRisk';
import { realtimeEventBus } from '../services/realtime/eventBus';
import { simulateNlpTriage, simulateVisionAnalysis, runSpatialDeduplication, calculateSpatialRisk } from '../services/aiEngine';

import { Language, translations } from '../i18n/translations';

export type ActiveView = 
  | 'citizen_home'
  | 'report_issue'
  | 'ai_triage'
  | 'case_tracking'
  | 'command_center'
  | 'incident_detail'
  | 'command_map'
  | 'disaster_alerts'
  | 'resolution_verification'
  | 'risk_forecast'
  | 'dedup_lab'
  | 'future_matrix'
  | 'admin_portal';

export type PortalMode = 'CITIZEN' | 'ADMIN';

export type AdminOfficerRole = 
  | 'ZONAL_COMMISSIONER'
  | 'PWD_CHIEF_ENGINEER'
  | 'WMD_SANITATION_OFFICER'
  | 'DD_DISASTER_OFFICER'
  | 'ED_ELECTRICAL_SUPERVISOR'
  | 'WSD_METROWATER_ENGINEER';

export interface TriageStepProgress {
  stepIndex: number;
  stepName: string;
  isProcessing: boolean;
  isDone: boolean;
  dataSummary: string;
}

interface CivicContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  incidents: Incident[];
  selectedIncident: Incident;
  setSelectedIncident: (incident: Incident) => void;
  selectIncidentById: (id: string) => void;
  alerts: EmergencyBroadcast[];
  forecastHotspots: ForecastHotspot[];
  
  // Multilingual System
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;

  // Portal Mode & Municipal Admin Role & Auth
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  adminRole: AdminOfficerRole;
  setAdminRole: (role: AdminOfficerRole) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  assignFieldSquad: (incidentId: string, squadName: string, staffName: string, vehicleNo: string, etaMinutes: number) => void;
  resolveIncidentWithProof: (incidentId: string, proof: Partial<ResolutionProof>) => void;
  overrideIncidentSeverity: (incidentId: string, severity: IncidentSeverity) => void;

  // Real-Time Providers & Dynamic Telemetry
  liveWeather: LiveWeatherData | null;
  liveAqi: LiveAqiData | null;
  refreshLiveFeeds: () => Promise<void>;
  isLiveLoading: boolean;

  // Smart City Digital Twin & Subsystems
  cityHealth: CityHealthMetrics;
  smartTraffic: SmartTrafficData;
  floodIntelligence: FloodDrainageIntelligence;
  smartLighting: SmartStreetLighting;
  smartWaste: SmartWasteData;
  smartWater: SmartWaterData;
  environmentAqi: EnvironmentAqiData;
  emergencyFleet: EmergencyFleetTelemetry;
  smartParking: SmartParkingData;
  liveEvents: CityLiveEvent[];
  aiCityInsight: AiCityInsight;
  digitalTwinLayers: DigitalTwinLayers;
  toggleDigitalTwinLayer: (layerKey: keyof DigitalTwinLayers) => void;
  highlightedSystemCategory: string | null;
  setHighlightedSystemCategory: (cat: string | null) => void;

  // Submit workflow
  submitNewReport: (
    arg1: string | {
      title?: string;
      description: string;
      locationName?: string;
      coordinates: { lat: number; lng: number };
      citizenName?: string;
      citizenContact?: string;
      image?: string;
    }, 
    imageUrl?: string, 
    lat?: number, 
    lng?: number, 
    citizenName?: string, 
    phone?: string
  ) => Promise<Incident>;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  createEmergencyAlert: (newAlert: Omit<EmergencyBroadcast, 'id' | 'issuedAt' | 'status'>) => void;
  
  // Live Demo Audio FX
  playSound: (type: 'beep' | 'triage' | 'alert' | 'success' | 'radar') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  // 2-Minute Hackathon Demo Auto-Runner
  isDemoRunning: boolean;
  demoStep: number;
  demoLogs: string[];
  startHackathonDemo: () => void;
  stopHackathonDemo: () => void;
  jumpToDemoStep: (step: number) => void;

  // Active Live Triage Session State
  currentTriageIncident: Incident | null;
  triageProgress: TriageStepProgress[];
  isTriageActive: boolean;
  runTriageAnimation: (targetIncident: Incident) => Promise<void>;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

// Web Audio API Synthesizer for high-tech sci-fi sounds
function playSynthesizedSound(type: string) {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'triage') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1080, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'alert') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.15);
      });
    } else if (type === 'radar') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch (e) {
    // Audio context error or blocked by autoplay
    console.debug('Audio playback note:', e);
  }
}

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('citizen_home');
  const [portalMode, setPortalMode] = useState<PortalMode>('CITIZEN');
  const [adminRole, setAdminRole] = useState<AdminOfficerRole>('ZONAL_COMMISSIONER');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('civic_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const loginAdmin = (password: string): boolean => {
    if (password === 'GCC@admin') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('civic_admin_auth', 'true');
      } catch {}
      playSound('success');
      return true;
    } else {
      playSound('alert');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('civic_admin_auth');
    } catch {}
    setPortalMode('CITIZEN');
    setActiveView('citizen_home');
    playSound('beep');
  };
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident>(MOCK_INCIDENTS[0]);
  const [alerts, setAlerts] = useState<EmergencyBroadcast[]>(MOCK_EMERGENCY_ALERTS);
  const [forecastHotspots] = useState<ForecastHotspot[]>(MOCK_FORECAST_HOTSPOTS);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Real-Time Ingestion Feeds
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);
  const [liveAqi, setLiveAqi] = useState<LiveAqiData | null>(null);
  const [isLiveLoading, setIsLiveLoading] = useState(false);

  // Smart City Subsystem States
  const [cityHealth, setCityHealth] = useState<CityHealthMetrics>(MOCK_CITY_HEALTH);
  const [smartTraffic, setSmartTraffic] = useState<SmartTrafficData>(MOCK_SMART_TRAFFIC);
  const [floodIntelligence, setFloodIntelligence] = useState<FloodDrainageIntelligence>(MOCK_FLOOD_INTELLIGENCE);
  const [smartLighting, setSmartLighting] = useState<SmartStreetLighting>(MOCK_SMART_LIGHTING);
  const [smartWaste, setSmartWaste] = useState<SmartWasteData>(MOCK_SMART_WASTE);
  const [smartWater, setSmartWater] = useState<SmartWaterData>(MOCK_SMART_WATER);
  const [environmentAqi, setEnvironmentAqi] = useState<EnvironmentAqiData>(MOCK_ENVIRONMENT_AQI);
  const [emergencyFleet, setEmergencyFleet] = useState<EmergencyFleetTelemetry>(MOCK_EMERGENCY_FLEET);
  const [smartParking, setSmartParking] = useState<SmartParkingData>(MOCK_SMART_PARKING);
  const [liveEvents, setLiveEvents] = useState<CityLiveEvent[]>(MOCK_LIVE_EVENTS);
  const [aiCityInsight, setAiCityInsight] = useState<AiCityInsight>(MOCK_AI_CITY_INSIGHT);
  const [digitalTwinLayers, setDigitalTwinLayers] = useState<DigitalTwinLayers>(INITIAL_DIGITAL_TWIN_LAYERS);
  const [highlightedSystemCategory, setHighlightedSystemCategory] = useState<string | null>(null);

  // Real-Time Ingestion Loader
  const refreshLiveFeeds = useCallback(async () => {
    setIsLiveLoading(true);
    try {
      const [weather, aqi, traffic, iot] = await Promise.all([
        WeatherProvider.getLiveWeather(12.9815, 80.2180),
        AqiProvider.getLiveAqi(12.9815, 80.2180),
        TrafficProvider.getLiveTraffic(incidents.filter(i => i.severity === 'CRITICAL').length, true),
        IotProvider.getLiveIotTelemetry(35.0)
      ]);

      setLiveWeather(weather);
      setLiveAqi(aqi);

      // Dynamically calculate City Health Score based on live inputs
      const computedHealth = calculateDynamicCityHealth({
        trafficDensityPct: traffic.densityPct,
        activeBlockages: traffic.activeBlockages,
        criticalIncidentsCount: incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length,
        darkZonesCount: iot.lightingFaultsCount,
        aqiValue: aqi.aqi,
        wasteOverflowCount: iot.wasteBinFillPct >= 90 ? 1 : 0,
        waterNetworkHealthPct: 97,
        lightingOperationalPct: iot.lightingOperationalPct,
        ambulancesAvailable: 7,
        fireUnitsAvailable: 3
      });
      setCityHealth(computedHealth);

      // Dynamically calculate Flood Intelligence based on live weather
      const computedFlood = calculateDynamicFloodIntelligence({
        wardName: 'WARD 12 (Velachery South)',
        rainfallMmHr: weather.precipitationMmHr || 35.0,
        waterLevelFt: iot.floodWaterLevelFt,
        nearbyIncidentReportsCount: incidents.filter(i => i.category.includes('Flood')).length || 4,
        schoolDistanceMeters: 180,
        trafficCongested: traffic.densityPct >= 75
      });
      setFloodIntelligence(computedFlood);

      // Update Subsystem Objects with real provenance
      setSmartTraffic(traffic);
      setEnvironmentAqi({
        aqi: aqi.aqi,
        pm25: aqi.pm25,
        pm10: aqi.pm10,
        pollutionHotspot: 'Central Zone (Kathipara Junction CAAQMS)',
        exposureRisk: aqi.exposureRisk,
        temperatureC: weather.temperatureC,
        humidityPct: weather.humidityPct
      });
    } catch (e) {
      console.warn('Real-time ingestion error:', e);
    } finally {
      setIsLiveLoading(false);
    }
  }, [incidents]);

  // Initial fetch and 60-second periodic live refresh
  useEffect(() => {
    refreshLiveFeeds();
    const interval = setInterval(refreshLiveFeeds, 60000);
    return () => clearInterval(interval);
  }, [refreshLiveFeeds]);

  // Subscribe to Realtime WebSocket Event Bus
  useEffect(() => {
    const unsubscribe = realtimeEventBus.subscribe('*', (payload) => {
      const newEvent: CityLiveEvent = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        timestamp: payload.timestamp,
        category: payload.type.includes('FLOOD') ? 'FLOOD' : payload.type.includes('TRAFFIC') ? 'TRAFFIC' : payload.type.includes('AQI') ? 'AQI' : 'EMERGENCY',
        title: typeof payload.data === 'string' ? payload.data : payload.data?.title || payload.type.replace(/_/g, ' '),
        location: payload.data?.location || payload.source,
        severity: payload.type.includes('FLOOD') || payload.type.includes('CRITICAL') ? 'CRITICAL' : 'HIGH'
      };

      setLiveEvents(prev => [newEvent, ...prev.slice(0, 19)]);
    });

    return () => unsubscribe();
  }, []);

  const toggleDigitalTwinLayer = (layerKey: keyof DigitalTwinLayers) => {
    setDigitalTwinLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  // Multilingual State (Defaults to English, supports Tamil, Telugu, Kannada, Malayalam, Hindi)
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('civic_sync_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('civic_sync_lang', lang);
  };

  const t = (key: keyof typeof translations.en): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || (key as string);
  };

  // Live Triage Animation Pipeline state
  const [currentTriageIncident, setCurrentTriageIncident] = useState<Incident | null>(MOCK_INCIDENTS[0]);
  const [isTriageActive, setIsTriageActive] = useState(false);
  const [triageProgress, setTriageProgress] = useState<TriageStepProgress[]>([
    { stepIndex: 0, stepName: 'Report Ingestion & Metadata Tagging', isProcessing: false, isDone: true, dataSummary: 'GPS coordinates & camera EXIF locked' },
    { stepIndex: 1, stepName: 'NLP Semantic Text Parsing', isProcessing: false, isDone: true, dataSummary: 'Identified: Heavy rain, road obstruction, school proximity' },
    { stepIndex: 2, stepName: 'YOLO/ViT Computer Vision Damage Bounding', isProcessing: false, isDone: true, dataSummary: 'Detected: Inundation 2.5ft (96%), submerged sedan (91%)' },
    { stepIndex: 3, stepName: '50-Meter Spatial Deduplication Engine', isProcessing: false, isDone: true, dataSummary: 'Merged 3 duplicate citizen reports within 42m' },
    { stepIndex: 4, stepName: 'Contextual Spatial Risk Matrix', isProcessing: false, isDone: true, dataSummary: 'Score: 91/100 (HIGH) | 180m from Oakridge School' },
    { stepIndex: 5, stepName: 'Dynamic Context-Aware SLA Generation', isProcessing: false, isDone: true, dataSummary: 'Calculated SLA: 02h:48m:31s (Accelerated by 90m)' },
    { stepIndex: 6, stepName: 'Automated Inter-Agency Dispatch', isProcessing: false, isDone: true, dataSummary: 'Disaster Management Unit Alpha-4 mobilized' },
  ]);

  // Demo auto-runner
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoLogs, setDemoLogs] = useState<string[]>([]);

  const playSound = (type: 'beep' | 'triage' | 'alert' | 'success' | 'radar') => {
    if (soundEnabled) {
      playSynthesizedSound(type);
    }
  };

  const selectIncidentById = (id: string) => {
    const found = incidents.find(i => i.id === id);
    if (found) {
      setSelectedIncident(found);
    }
  };

  const updateIncidentStatus = (incidentId: string, status: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const updated = { ...inc, status, updatedAt: new Date().toISOString() };
        if (selectedIncident.id === incidentId) {
          setSelectedIncident(updated);
        }
        return updated;
      }
      return inc;
    }));
    playSound('beep');
  };

  const createEmergencyAlert = (newAlert: Omit<EmergencyBroadcast, 'id' | 'issuedAt' | 'status'>) => {
    const alertObj: EmergencyBroadcast = {
      ...newAlert,
      id: `ALERT-0${alerts.length + 90}`,
      issuedAt: new Date().toISOString(),
      status: 'BROADCASTING'
    };
    setAlerts(prev => [alertObj, ...prev]);
    playSound('alert');
  };

  // Run full multi-stage AI triage pipeline simulation
  const runTriageAnimation = async (targetIncident: Incident) => {
    setCurrentTriageIncident(targetIncident);
    setIsTriageActive(true);

    const steps = [
      { stepName: 'Report Ingestion & Metadata Tagging', dataSummary: `GPS: [${targetIncident.coordinates.lat.toFixed(4)}, ${targetIncident.coordinates.lng.toFixed(4)}]` },
      { stepName: 'NLP Semantic Text Parsing', dataSummary: `Category: ${targetIncident.category} (${targetIncident.aiConfidence}% confidence)` },
      { stepName: 'YOLO/ViT Computer Vision Damage Bounding', dataSummary: `${targetIncident.detectedObjects.length} structural damage signatures identified` },
      { stepName: '50-Meter Spatial Deduplication Engine', dataSummary: `Clustered ${targetIncident.duplicates.length} duplicate citizen reports within 50m` },
      { stepName: 'Contextual Spatial Risk Matrix', dataSummary: `Calculated Risk Score: ${targetIncident.risk.totalScore}/100 (${targetIncident.risk.priorityLevel})` },
      { stepName: 'Dynamic Context-Aware SLA Generation', dataSummary: `SLA generated: ${Math.floor(targetIncident.sla.remainingSeconds / 3600)}h ${Math.floor((targetIncident.sla.remainingSeconds % 3600) / 60)}m` },
      { stepName: 'Automated Inter-Agency Dispatch', dataSummary: `Assigned: ${targetIncident.recommendedDepartment}` },
    ];

    for (let i = 0; i < steps.length; i++) {
      setTriageProgress(prev => prev.map((s, idx) => {
        if (idx === i) return { ...s, isProcessing: true, isDone: false, dataSummary: 'Computing...' };
        if (idx < i) return { ...s, isProcessing: false, isDone: true };
        return { ...s, isProcessing: false, isDone: false };
      }));
      playSound('triage');
      await new Promise(r => setTimeout(r, 650));

      setTriageProgress(prev => prev.map((s, idx) => {
        if (idx === i) return { ...s, isProcessing: false, isDone: true, dataSummary: steps[i].dataSummary };
        return s;
      }));
    }

    setIsTriageActive(false);
    playSound('success');
  };

  // Citizen submit action
  const submitNewReport = async (
    arg1: string | {
      title?: string;
      description: string;
      locationName?: string;
      coordinates: { lat: number; lng: number };
      citizenName?: string;
      citizenContact?: string;
      image?: string;
    }, 
    imageUrl?: string, 
    latParam?: number, 
    lngParam?: number, 
    citizenNameParam?: string, 
    phoneParam?: string
  ): Promise<Incident> => {
    let text = '';
    let img = '';
    let lat = CHENNAI_DEFAULT_COORDS.lat;
    let lng = CHENNAI_DEFAULT_COORDS.lng;
    let citizenName = 'Verified Citizen';
    let phone = '+91 98765 00000';
    let locName = '';

    if (typeof arg1 === 'object' && arg1 !== null) {
      text = arg1.description || '';
      img = arg1.image || '';
      lat = arg1.coordinates?.lat ?? CHENNAI_DEFAULT_COORDS.lat;
      lng = arg1.coordinates?.lng ?? CHENNAI_DEFAULT_COORDS.lng;
      citizenName = arg1.citizenName || 'Verified Citizen';
      phone = arg1.citizenContact || '+91 98765 00000';
      locName = arg1.locationName || `Zone Sector (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
    } else {
      text = arg1 || '';
      img = imageUrl || '';
      lat = latParam ?? CHENNAI_DEFAULT_COORDS.lat;
      lng = lngParam ?? CHENNAI_DEFAULT_COORDS.lng;
      citizenName = citizenNameParam || 'Verified Citizen';
      phone = phoneParam || '+91 98765 00000';
      locName = `Zone Sector (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
    }

    // 1. NLP
    const nlp = simulateNlpTriage(text);
    // 2. Vision
    const objects = simulateVisionAnalysis(nlp.category);
    // 3. Spatial Deduplication
    const dedup = runSpatialDeduplication(lat, lng);
    // 4. Spatial Proximity & Risk
    const { spatial, risk, sla } = calculateSpatialRisk(lat, lng, nlp.category, dedup.duplicatesFound.length);

    const newId = `CS-${Math.floor(7400 + Math.random() * 900)}`;

    const newIncident: Incident = {
      id: newId,
      title: `${nlp.category} near ${spatial.schoolName}`,
      description: text,
      category: nlp.category,
      severity: risk.priorityLevel,
      status: 'AI_TRIAGED',
      locationName: locName,
      coordinates: { lat, lng },
      image: img || 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citizenName: citizenName,
      citizenContact: phone,
      aiConfidence: nlp.confidence,
      aiReasoning: nlp.reasoning,
      recommendedDepartment: nlp.recommendedDepartment,
      assignedDepartment: nlp.recommendedDepartment,
      assignedTeam: `${nlp.recommendedDepartment} Quick Action Squad`,
      assignedOfficer: 'Officer On Duty',
      detectedObjects: objects,
      spatial,
      risk,
      duplicates: dedup.duplicatesFound,
      isPrimaryMaster: true,
      sla,
      resolution: {
        beforeImage: img || 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
        afterImage: 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?auto=format&fit=crop&w=1000&q=80',
        resolvedAt: 'Pending Action',
        resolvedByStaff: 'Field Operations Crew',
        staffBadge: 'PWD-SQUAD-12',
        geoVerified: true,
        cvConfidenceScore: 98.2,
        aiVerificationNotes: [
          'Obstruction removal target confirmed',
          'AI post-fix validation scheduled upon crew upload'
        ],
        status: 'VERIFIED'
      },
      timeline: [
        { stage: 'Report Received', timestamp: new Date().toLocaleTimeString(), completed: true, active: false, description: 'Submitted via citizen portal with GPS lock' },
        { stage: 'AI Triage & Deduplication', timestamp: new Date().toLocaleTimeString(), completed: true, active: false, description: `Classified ${nlp.category} (${nlp.confidence}%). Merged ${dedup.duplicatesFound.length} duplicate reports within 50m.` },
        { stage: 'Department Assigned', timestamp: new Date().toLocaleTimeString(), completed: true, active: true, description: `Routed to ${nlp.recommendedDepartment}` },
        { stage: 'Team Dispatched', timestamp: 'Pending', completed: false, active: false, description: 'Squad en route via automated telemetry' },
        { stage: 'Issue Being Resolved', timestamp: 'Pending', completed: false, active: false, description: 'Field remediation in progress' },
        { stage: 'Verification Pending', timestamp: 'Pending', completed: false, active: false, description: 'AI Before/After CV proof audit required' }
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
    setCurrentTriageIncident(newIncident);

    return newIncident;
  };

  const assignFieldSquad = (
    incidentId: string, 
    squadName: string, 
    staffName: string, 
    vehicleNo: string, 
    etaMinutes: number
  ) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;

      const newTimeline = inc.timeline.map(t => {
        if (t.stage === 'Department Assigned') return { ...t, completed: true, active: false };
        if (t.stage === 'Team Dispatched') return { 
          ...t, 
          completed: true, 
          active: true, 
          timestamp: new Date().toLocaleTimeString(), 
          description: `${squadName} (${staffName} • ${vehicleNo}) dispatched. ETA: ${etaMinutes} mins.` 
        };
        return t;
      });

      return {
        ...inc,
        status: 'ASSIGNED',
        assignedTeam: squadName,
        assignedOfficer: staffName,
        timeline: newTimeline,
        updatedAt: new Date().toISOString()
      };
    }));

    playSound('success');
    realtimeEventBus.publish({
      type: 'INCIDENT_UPDATED',
      payload: { incidentId, status: 'ASSIGNED', squadName }
    });
  };

  const resolveIncidentWithProof = (incidentId: string, proof: Partial<ResolutionProof>) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;

      const updatedProof: ResolutionProof = {
        beforeImage: proof.beforeImage || inc.image,
        afterImage: proof.afterImage || 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?auto=format&fit=crop&w=1000&q=80',
        resolvedAt: new Date().toLocaleString(),
        resolvedByStaff: proof.resolvedByStaff || 'Officer M. Natarajan',
        staffBadge: proof.staffBadge || 'PWD-CHIEF-884',
        geoVerified: true,
        cvConfidenceScore: proof.cvConfidenceScore || 98.6,
        aiVerificationNotes: proof.aiVerificationNotes || [
          'PostGIS Geofence match ±0.8m confirmed',
          'AI CV clearance signature validated with 98.6% confidence',
          'Citizen notification SMS transmitted successfully'
        ],
        status: 'VERIFIED'
      };

      const newTimeline = inc.timeline.map(t => {
        if (t.stage === 'Issue Being Resolved') return { ...t, completed: true, active: false, timestamp: new Date().toLocaleTimeString() };
        if (t.stage === 'Verification Pending') return { ...t, completed: true, active: false, timestamp: new Date().toLocaleTimeString(), description: 'Cryptographically certified by Municipal Corporation Admin' };
        return t;
      });

      return {
        ...inc,
        status: 'RESOLVED',
        resolution: updatedProof,
        timeline: newTimeline,
        updatedAt: new Date().toISOString()
      };
    }));

    playSound('success');
  };

  const overrideIncidentSeverity = (incidentId: string, severity: IncidentSeverity) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc;
      return {
        ...inc,
        severity,
        risk: {
          ...inc.risk,
          priorityLevel: severity
        },
        updatedAt: new Date().toISOString()
      };
    }));
    playSound('beep');
  };

  // Hackathon Demo Steps
  const DEMO_STAGES: { view: ActiveView; title: string; log: string }[] = [
    { view: 'report_issue', title: '1. Citizen Fast Report Submission', log: 'Citizen reports: "Heavy rain has blocked the road near the school." with instant GPS.' },
    { view: 'ai_triage', title: '2. Multi-Stage AI Triage Pipeline', log: 'AI processes NLP text, runs CV damage detection, calculates confidence (94%), and routes to Disaster Management.' },
    { view: 'dedup_lab', title: '3. 50-Meter Spatial Deduplication', log: 'Spatial engine identifies 3 duplicate citizen reports within 42m radius and merges them into 1 master incident.' },
    { view: 'command_map', title: '4. Spatial Proximity Risk & Command Map', log: 'Calculated 180m distance from school + flood basin -> Elevates priority to HIGH (Risk: 91/100).' },
    { view: 'command_center', title: '5. Authority Command Center & Dynamic SLA', log: 'Disaster Management dashboard displays contextual SLA (02h:48m remaining) & dispatch status.' },
    { view: 'disaster_alerts', title: '6. Geo-Fenced Emergency Broadcast', log: 'Authority broadcasts live emergency alert to 2,847 affected citizens in 650m danger buffer.' },
    { view: 'case_tracking', title: '7. Citizen Real-Time Case Telemetry', log: 'Citizen tracks live timeline, assigned officer badge, and crew dispatch status.' },
    { view: 'resolution_verification', title: '8. Before/After CV Proof Verification', log: 'Field staff submits resolved photo; AI verifies 100% water clearance with 97.4% CV confidence.' },
    { view: 'risk_forecast', title: '9. Predictive Civic Risk Forecast (Next 6h)', log: 'Predictive spatial model displays high-risk flood zones A/B/C for preemptive infrastructure defense.' }
  ];

  const jumpToDemoStep = (step: number) => {
    if (step >= 0 && step < DEMO_STAGES.length) {
      setDemoStep(step);
      setActiveView(DEMO_STAGES[step].view);
      setDemoLogs(prev => [...prev.slice(-6), DEMO_STAGES[step].log]);
      playSound('beep');
    }
  };

  const startHackathonDemo = () => {
    setIsDemoRunning(true);
    setDemoStep(0);
    setDemoLogs(['🎬 Starting CIVIC-SYNC 2-Minute Guided Hackathon Demonstration...']);
    jumpToDemoStep(0);
  };

  const stopHackathonDemo = () => {
    setIsDemoRunning(false);
    playSound('beep');
  };

  // Interval timer to update SLA countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setIncidents(prev => prev.map(inc => {
        if (inc.status === 'RESOLVED' || inc.sla.remainingSeconds <= 0) return inc;
        const newRemaining = Math.max(0, inc.sla.remainingSeconds - 1);
        return {
          ...inc,
          sla: {
            ...inc.sla,
            remainingSeconds: newRemaining,
            isAtRisk: newRemaining > 0 && newRemaining < 1800,
            isBreached: newRemaining === 0
          }
        };
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <CivicContext.Provider
      value={{
        activeView,
        setActiveView,
        portalMode,
        setPortalMode,
        adminRole,
        setAdminRole,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        assignFieldSquad,
        resolveIncidentWithProof,
        overrideIncidentSeverity,
        incidents,
        selectedIncident,
        setSelectedIncident,
        selectIncidentById,
        alerts,
        forecastHotspots,
        language,
        setLanguage,
        t,
        liveWeather,
        liveAqi,
        refreshLiveFeeds,
        isLiveLoading,
        cityHealth,
        smartTraffic,
        floodIntelligence,
        smartLighting,
        smartWaste,
        smartWater,
        environmentAqi,
        emergencyFleet,
        smartParking,
        liveEvents,
        aiCityInsight,
        digitalTwinLayers,
        toggleDigitalTwinLayer,
        highlightedSystemCategory,
        setHighlightedSystemCategory,
        submitNewReport,
        updateIncidentStatus,
        createEmergencyAlert,
        playSound,
        soundEnabled,
        setSoundEnabled,
        isDemoRunning,
        demoStep,
        demoLogs,
        startHackathonDemo,
        stopHackathonDemo,
        jumpToDemoStep,
        currentTriageIncident,
        triageProgress,
        isTriageActive,
        runTriageAnimation
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
