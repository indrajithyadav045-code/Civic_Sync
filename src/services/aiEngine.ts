import { 
  IncidentCategory, 
  IncidentSeverity, 
  Department, 
  BoundingBox, 
  SpatialProximity, 
  RiskBreakdown, 
  SlaDetails, 
  DuplicateReport 
} from '../types';
import { SENSITIVE_INFRASTRUCTURE } from '../data/mockData';

// Haversine distance calculator in meters
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// 1. NLP Triage Engine
export interface NlpTriageResult {
  category: IncidentCategory;
  severity: IncidentSeverity;
  confidence: number;
  recommendedDepartment: Department;
  reasoning: string[];
  keywordsDetected: string[];
}

export function simulateNlpTriage(text: string): NlpTriageResult {
  const lower = text.toLowerCase();
  
  if (lower.includes('rain') || lower.includes('flood') || lower.includes('water') || lower.includes('drain') || lower.includes('blocked the road near the school')) {
    return {
      category: 'Flooding / Drainage Blockage',
      severity: 'HIGH',
      confidence: 94,
      recommendedDepartment: 'Drainage & Stormwater Management',
      keywordsDetected: ['heavy rain', 'blocked road', 'school vicinity', 'waterlogging'],
      reasoning: [
        'Heavy precipitation & surface water accumulation detected',
        'Road obstruction impeding arterial vehicular passage',
        'High vulnerability zone: sensitive school infrastructure nearby',
        'Temporal clustering indicates active localized flash flood pattern'
      ]
    };
  }

  if (lower.includes('tree') || lower.includes('branch') || lower.includes('uproot') || lower.includes('fall')) {
    return {
      category: 'Fallen Tree / Vegetation Hazard',
      severity: 'HIGH',
      confidence: 96,
      recommendedDepartment: 'Public Works & Roads',
      keywordsDetected: ['fallen tree', 'roadway blocked', 'crushed poles'],
      reasoning: [
        'Major physical obstruction on transit corridor',
        'Potential entanglement with overhead utility wiring',
        'Requires immediate hydraulic clearing equipment'
      ]
    };
  }

  if (lower.includes('electric') || lower.includes('wire') || lower.includes('spark') || lower.includes('cable') || lower.includes('shock')) {
    return {
      category: 'Electrical Grid Failure',
      severity: 'CRITICAL',
      confidence: 98,
      recommendedDepartment: 'Power & Utilities',
      keywordsDetected: ['snapped cable', 'sparking', 'live wire', 'high voltage'],
      reasoning: [
        'Lethal electrical electrocution risk to general public',
        'Critical infrastructure feeder failure',
        'Requires instant automated circuit breaker trip & crew dispatch'
      ]
    };
  }

  if (lower.includes('sinkhole') || lower.includes('pipe') || lower.includes('burst') || lower.includes('crater') || lower.includes('collapse')) {
    return {
      category: 'Structural & Infrastructure Damage',
      severity: 'HIGH',
      confidence: 95,
      recommendedDepartment: 'Public Works & Roads',
      keywordsDetected: ['water main burst', 'subsidence', 'crater', 'sinkhole'],
      reasoning: [
        'Subsurface cavitation and pavement integrity collapse',
        'Massive potable water utility loss',
        'Structural threat to adjoining road lanes'
      ]
    };
  }

  // Default fallback
  return {
    category: 'Garbage Accumulation',
    severity: 'MEDIUM',
    confidence: 89,
    recommendedDepartment: 'Municipal Health & Sanitation',
    keywordsDetected: ['waste', 'sanitation', 'debris'],
    reasoning: [
      'Municipal public nuisance / sanitation concern identified',
      'Standard civic cleaning queue assignment'
    ]
  };
}

// 2. Computer Vision Object Detection Simulation (YOLOv8 / ViT ready)
export function simulateVisionAnalysis(category: IncidentCategory): BoundingBox[] {
  switch (category) {
    case 'Flooding / Drainage Blockage':
      return [
        {
          id: 'cv-f1',
          label: 'Inundation Zone (>75cm depth)',
          confidence: 0.96,
          box: { top: 38, left: 10, width: 78, height: 54 },
          color: '#06b6d4',
          damageLevel: 'SEVERE'
        },
        {
          id: 'cv-f2',
          label: 'Submerged Vehicle',
          confidence: 0.92,
          box: { top: 46, left: 36, width: 26, height: 30 },
          color: '#f43f5e',
          damageLevel: 'SEVERE'
        },
        {
          id: 'cv-f3',
          label: 'Choked Drainage Inlet',
          confidence: 0.88,
          box: { top: 70, left: 68, width: 22, height: 20 },
          color: '#f59e0b',
          damageLevel: 'MODERATE'
        }
      ];
    case 'Electrical Grid Failure':
      return [
        {
          id: 'cv-e1',
          label: 'Snapped 11kV Conductor',
          confidence: 0.98,
          box: { top: 20, left: 18, width: 62, height: 42 },
          color: '#f43f5e',
          damageLevel: 'SEVERE'
        }
      ];
    case 'Fallen Tree / Vegetation Hazard':
      return [
        {
          id: 'cv-t1',
          label: 'Uprooted Trunk Obstruction',
          confidence: 0.97,
          box: { top: 30, left: 12, width: 76, height: 58 },
          color: '#10b981',
          damageLevel: 'SEVERE'
        }
      ];
    default:
      return [
        {
          id: 'cv-d1',
          label: 'Structural Pavement Hazard',
          confidence: 0.93,
          box: { top: 32, left: 24, width: 52, height: 48 },
          color: '#f59e0b',
          damageLevel: 'MODERATE'
        }
      ];
  }
}

// 3. 50-Meter Spatial Deduplication Engine
export function runSpatialDeduplication(
  targetLat: number, 
  targetLng: number, 
  existingDuplicates: DuplicateReport[] = []
): { isDuplicate: boolean; duplicatesFound: DuplicateReport[]; mergeRadius: number } {
  const MERGE_RADIUS_METERS = 50;
  
  // Synthesize realistic duplicate reports within the 50m radius if not already provided
  let duplicates = existingDuplicates;
  if (duplicates.length === 0) {
    duplicates = [
      {
        id: 'DUP-AUTO-1',
        citizenName: 'Priya Iyer',
        phoneMasked: '+91 98*** **412',
        timestamp: '14:18:22',
        distanceFromPrimaryMeters: 18,
        lat: targetLat + 0.00012,
        lng: targetLng + 0.00008,
        notes: 'Water is rising fast near school entrance, cars cannot pass'
      },
      {
        id: 'DUP-AUTO-2',
        citizenName: 'Vikram Mehta',
        phoneMasked: '+91 97*** **903',
        timestamp: '14:22:05',
        distanceFromPrimaryMeters: 34,
        lat: targetLat - 0.00015,
        lng: targetLng - 0.00018,
        notes: 'Drainage completely choked, water logged near crossway'
      },
      {
        id: 'DUP-AUTO-3',
        citizenName: 'Sunita Rao',
        phoneMasked: '+91 99*** **118',
        timestamp: '14:25:40',
        distanceFromPrimaryMeters: 42,
        lat: targetLat + 0.00020,
        lng: targetLng - 0.00015,
        notes: 'Heavy water stagnation, children stranded at bus stop'
      }
    ];
  }

  const within50m = duplicates.filter(d => d.distanceFromPrimaryMeters <= MERGE_RADIUS_METERS);

  return {
    isDuplicate: within50m.length > 0,
    duplicatesFound: within50m,
    mergeRadius: MERGE_RADIUS_METERS
  };
}

// 4. Spatial Proximity & Dynamic Risk Score Calculator
export function calculateSpatialRisk(
  lat: number,
  lng: number,
  category: IncidentCategory,
  duplicateCount: number
): { spatial: SpatialProximity; risk: RiskBreakdown; sla: SlaDetails } {
  // Find nearest school
  let minSchoolDist = Infinity;
  let nearestSchoolName = 'Oakridge Senior Secondary School';
  
  // Find nearest hospital
  let minHospDist = Infinity;
  let nearestHospName = 'Apollo Metro Emergency Hospital';

  for (const infra of SENSITIVE_INFRASTRUCTURE) {
    const dist = calculateDistanceMeters(lat, lng, infra.lat, infra.lng);
    if (infra.type === 'SCHOOL' && dist < minSchoolDist) {
      minSchoolDist = dist;
      nearestSchoolName = infra.name;
    }
    if (infra.type === 'HOSPITAL' && dist < minHospDist) {
      minHospDist = dist;
      nearestHospName = infra.name;
    }
  }

  const inFloodZone = true; // In low-lying flood basin
  const densityScore = Math.min(95, 60 + duplicateCount * 8);

  // Risk Score math (0-100)
  let baseScore = 40;
  if (category === 'Electrical Grid Failure') baseScore = 50;
  if (category === 'Flooding / Drainage Blockage') baseScore = 45;

  let schoolBonus = 0;
  if (minSchoolDist <= 200) schoolBonus = 20;
  else if (minSchoolDist <= 500) schoolBonus = 10;
  else if (minSchoolDist <= 1000) schoolBonus = 5;

  let hospBonus = 0;
  if (minHospDist <= 200) hospBonus = 20;
  else if (minHospDist <= 500) hospBonus = 10;
  else if (minHospDist <= 1000) hospBonus = 5;

  const floodBonus = inFloodZone ? 10 : 0;
  const dupBonus = Math.min(15, duplicateCount * 3);
  const densityBonus = Math.round((densityScore / 100) * 8);

  const totalScore = Math.min(100, baseScore + schoolBonus + hospBonus + floodBonus + dupBonus + densityBonus);

  let priorityLevel: IncidentSeverity = 'MEDIUM';
  if (totalScore >= 85) priorityLevel = 'HIGH';
  if (totalScore >= 95 || category === 'Electrical Grid Failure') priorityLevel = 'CRITICAL';

  const reasoning: string[] = [
    `✓ Base Severity: ${category} evaluated with base score ${baseScore}`,
    duplicateCount > 0 ? `✓ ${duplicateCount} duplicate citizen reports within 50m (+${dupBonus} pts)` : '✓ Single citizen report logged',
    minSchoolDist <= 500 ? `✓ ${minSchoolDist}m from ${nearestSchoolName} (+${schoolBonus} pts)` : `✓ ${minSchoolDist}m from nearest school`,
    minHospDist <= 500 ? `✓ ${minHospDist}m from ${nearestHospName} (+${hospBonus} pts)` : `✓ ${minHospDist}m from nearest hospital`,
    inFloodZone ? '✓ Inside high-vulnerability Flood Risk Zone 3 (+10 pts)' : '✓ Outside flood basin'
  ];

  // Dynamic SLA Calculation
  let baseHours = 6;
  if (priorityLevel === 'CRITICAL') baseHours = 1;
  else if (priorityLevel === 'HIGH') baseHours = 3;
  else if (priorityLevel === 'MEDIUM') baseHours = 8;
  else baseHours = 24;

  const reductionReasons: string[] = [];
  let remainingSeconds = baseHours * 3600;

  if (minSchoolDist <= 200) {
    remainingSeconds -= 45 * 60;
    reductionReasons.push(`Reduced by 45m due to school zone proximity (${minSchoolDist}m)`);
  }
  if (duplicateCount >= 2) {
    remainingSeconds -= 30 * 60;
    reductionReasons.push(`Reduced by 30m due to multiple citizen duplicate spikes (${duplicateCount} reports)`);
  }
  if (inFloodZone) {
    remainingSeconds -= 15 * 60;
    reductionReasons.push('Reduced by 15m due to active monsoon weather advisory');
  }

  remainingSeconds = Math.max(900, remainingSeconds); // Minimum 15 min SLA

  return {
    spatial: {
      schoolDistanceMeters: minSchoolDist,
      schoolName: nearestSchoolName,
      hospitalDistanceMeters: minHospDist,
      hospitalName: nearestHospName,
      inFloodRiskZone: inFloodZone,
      floodZoneName: 'Low-Lying Drainage Basin Zone 3',
      nearbyDuplicatesCount: duplicateCount,
      incidentDensityScore: densityScore
    },
    risk: {
      baseScore,
      schoolProximityBonus: schoolBonus,
      hospitalProximityBonus: hospBonus,
      floodZoneBonus: floodBonus,
      duplicateClusterBonus: dupBonus,
      densityBonus,
      totalScore,
      priorityLevel,
      reasoning
    },
    sla: {
      initialHours: baseHours,
      targetTimestamp: Date.now() + remainingSeconds * 1000,
      remainingSeconds,
      isAtRisk: remainingSeconds <= 1800,
      isBreached: false,
      contextualReductionReasons: reductionReasons
    }
  };
}
