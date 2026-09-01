export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentCategory = 
  | 'Flooding / Drainage Blockage'
  | 'Road Obstruction / Pothole'
  | 'Structural & Infrastructure Damage'
  | 'Fallen Tree / Vegetation Hazard'
  | 'Hazardous Material / Gas Leak'
  | 'Electrical Grid Failure'
  | 'Garbage Accumulation';

export type Department = 
  | 'Disaster Management'
  | 'Public Works & Roads'
  | 'Power & Utilities'
  | 'Municipal Health & Sanitation'
  | 'Fire & Emergency Services'
  | 'Traffic Police';

export type IncidentStatus = 
  | 'NEW'
  | 'AI_TRIAGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED';

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  box: { top: number; left: number; width: number; height: number }; // percentages 0-100
  color: string;
  damageLevel: 'SEVERE' | 'MODERATE' | 'MINOR';
}

export interface SpatialProximity {
  schoolDistanceMeters: number;
  schoolName: string;
  hospitalDistanceMeters: number;
  hospitalName: string;
  inFloodRiskZone: boolean;
  floodZoneName?: string;
  nearbyDuplicatesCount: number;
  incidentDensityScore: number; // 0 - 100
}

export interface RiskBreakdown {
  baseScore: number;
  schoolProximityBonus: number;
  hospitalProximityBonus: number;
  floodZoneBonus: number;
  duplicateClusterBonus: number;
  densityBonus: number;
  totalScore: number; // 0 - 100
  priorityLevel: IncidentSeverity;
  reasoning: string[];
}

export interface SlaDetails {
  initialHours: number;
  targetTimestamp: number;
  remainingSeconds: number;
  isAtRisk: boolean;
  isBreached: boolean;
  contextualReductionReasons: string[];
}

export interface DuplicateReport {
  id: string;
  citizenName: string;
  phoneMasked: string;
  timestamp: string;
  distanceFromPrimaryMeters: number;
  lat: number;
  lng: number;
  notes: string;
  imageThumbnail?: string;
}

export interface ResolutionProof {
  beforeImage: string;
  afterImage: string;
  resolvedAt: string;
  resolvedByStaff: string;
  staffBadge: string;
  geoVerified: boolean;
  cvConfidenceScore: number;
  aiVerificationNotes: string[];
  status: 'VERIFIED' | 'NEEDS_AUDIT' | 'REJECTED';
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  createdAt: string;
  updatedAt: string;
  citizenName: string;
  citizenContact: string;
  
  // AI Triage & Vision Data
  aiConfidence: number;
  aiReasoning: string[];
  recommendedDepartment: Department;
  assignedDepartment: Department;
  assignedTeam?: string;
  assignedOfficer?: string;
  detectedObjects: BoundingBox[];
  
  // Spatial & Deduplication
  spatial: SpatialProximity;
  risk: RiskBreakdown;
  duplicates: DuplicateReport[];
  isPrimaryMaster: boolean;
  
  // SLA
  sla: SlaDetails;
  
  // Resolution Verification
  resolution?: ResolutionProof;

  // Timeline for tracking
  timeline: {
    stage: string;
    timestamp: string;
    completed: boolean;
    active: boolean;
    description: string;
  }[];
}

export interface EmergencyBroadcast {
  id: string;
  title: string;
  message: string;
  severity: 'EXTREME' | 'HIGH' | 'ADVISORY';
  affectedCitizensEstimate: number;
  areaRadiusMeters: number;
  centerCoordinates: { lat: number; lng: number };
  zoneName: string;
  channels: ('SMS_CELL_BROADCAST' | 'MOBILE_APP_PUSH' | 'DIGITAL_SIGNAGE' | 'SIREN_NETWORK')[];
  issuedAt: string;
  activeUntil: string;
  status: 'BROADCASTING' | 'SCHEDULED' | 'RESOLVED';
}

export interface ForecastHotspot {
  id: string;
  zoneName: string;
  riskTier: 'HIGH_RISK' | 'MEDIUM_RISK' | 'LOW_RISK';
  predictedScore: number; // 0-100
  center: { lat: number; lng: number };
  radius: number;
  primaryRiskDrivers: string[];
  recommendedPreemptiveAction: string;
  precipitationForecastMm: number;
  drainageCapacityPct: number;
}

// ==========================================
// NEW SMART CITY DIGITAL TWIN & INTELLIGENCE TYPES
// ==========================================

export interface CityHealthMetrics {
  overallScore: number;
  mobility: number;
  safety: number;
  environment: number;
  infrastructure: number;
  emergency: number;
  activeTrend: 'UP' | 'STABLE' | 'DOWN';
  status: 'OPTIMAL' | 'MODERATE' | 'CRITICAL';
}

export interface SmartTrafficData {
  corridor: string;
  congestion: 'HIGH' | 'MODERATE' | 'LOW';
  densityPct: number;
  averageSpeedKmh: number;
  activeBlockages: number;
  activeAccidents: number;
  aiRecommendation: string;
  cameraFeedUrl?: string;
}

export interface FloodDrainageIntelligence {
  ward: string;
  riskScore: number; // 0-100
  waterLevelFeet: number;
  rainfallMmHr: number;
  drainageFlowPct: number;
  signals: string[];
  recommendedActions: string[];
  nearbyReportsCount: number;
  sensitiveProximity: string;
}

export interface SmartStreetLighting {
  operationalPct: number;
  faultyPct: number;
  darkZonesCount: number;
  sampleIncident: {
    poleId: string;
    ward: string;
    status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
    aiPriority: 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string;
    lat: number;
    lng: number;
  };
}

export interface SmartWasteData {
  ward: string;
  binId: string;
  fillLevelPct: number;
  status: 'NORMAL' | 'OVERFLOW_RISK' | 'OVERFLOWED';
  predictedOverflow: string;
  recommendedAction: string;
  lat: number;
  lng: number;
}

export interface SmartWaterData {
  networkHealthPct: number;
  normalPipeline: { id: string; pressure: string };
  riskPipeline: {
    id: string;
    leakRisk: 'HIGH' | 'MODERATE' | 'LOW';
    estimatedLossLitrePerHour: number;
    recommendedAction: string;
    lat: number;
    lng: number;
  };
}

export interface EnvironmentAqiData {
  aqi: number;
  pm25: number;
  pm10: number;
  pollutionHotspot: string;
  exposureRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  temperatureC: number;
  humidityPct: number;
}

export interface EmergencyFleetTelemetry {
  ambulancesAvailable: number;
  fireUnitsAvailable: number;
  policeAvailable: number;
  activeIncidentDispatch: {
    incidentId: string;
    nearestUnit: string;
    etaMinutesSeconds: string;
    status: 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE';
    lat: number;
    lng: number;
  };
}

export interface SmartParkingData {
  zone: string;
  occupancyPct: number;
  availableSpaces: number;
  totalCapacity: number;
  violationsCount: number;
  aiRecommendation: string;
}

export interface CityLiveEvent {
  id: string;
  timestamp: string;
  category: 'FLOOD' | 'TRAFFIC' | 'LIGHTING' | 'WASTE' | 'EMERGENCY' | 'WATER' | 'AQI';
  title: string;
  location: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  iconName?: string;
}

export interface AiCityInsight {
  alertLevel: 'CRITICAL_WARNING' | 'ADVISORY' | 'STABLE';
  headline: string;
  zone: string;
  confidencePct: number;
  signals: string[];
  recommendedActions: string[];
  predictedImpactCitizens: number;
}

export interface DigitalTwinLayers {
  incidents: boolean;
  criticalIncidents: boolean;
  highPriority: boolean;
  dedupRadius50m: boolean;
  floodZones: boolean;
  schools: boolean;
  hospitals: boolean;
  traffic: boolean;
  streetLights: boolean;
  wasteBins: boolean;
  waterNetwork: boolean;
  aqiHotspots: boolean;
  emergencyUnits: boolean;
  riskForecastZones: boolean;
}
