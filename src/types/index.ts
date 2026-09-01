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
