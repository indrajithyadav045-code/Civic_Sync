import {
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

export const MOCK_CITY_HEALTH: CityHealthMetrics = {
  overallScore: 87,
  mobility: 82,
  safety: 91,
  environment: 78,
  infrastructure: 89,
  emergency: 94,
  activeTrend: 'UP',
  status: 'OPTIMAL'
};

export const MOCK_SMART_TRAFFIC: SmartTrafficData = {
  corridor: 'Mount Road (Anna Salai / Velachery Arterial)',
  congestion: 'HIGH',
  densityPct: 82,
  averageSpeedKmh: 18,
  activeBlockages: 2,
  activeAccidents: 1,
  aiRecommendation: 'Divert traffic through Route 4 (Inner Ring Road) due to flood-related obstruction near Velachery.',
  cameraFeedUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
};

export const MOCK_FLOOD_INTELLIGENCE: FloodDrainageIntelligence = {
  ward: 'WARD 12 (Velachery South)',
  riskScore: 91,
  waterLevelFeet: 2.8,
  rainfallMmHr: 42.5,
  drainageFlowPct: 38,
  signals: [
    'Heavy precipitation rate (42.5 mm/hr)',
    '4 nearby citizen waterlogging reports',
    'Major storm-water drain blockage detected',
    '180m from DAV Public School safety buffer',
    'High arterial traffic density corridor'
  ],
  recommendedActions: [
    'Dispatch Drainage & De-watering Rapid Squad Alpha-4',
    'Mobilize 150HP de-watering super-sucker pumps',
    'Apply 500m geofence perimeter on 100ft road',
    'Broadcast cell-tower municipal advisory to subscribers'
  ],
  nearbyReportsCount: 4,
  sensitiveProximity: '180m from DAV School & Apollo Clinic'
};

export const MOCK_SMART_LIGHTING: SmartStreetLighting = {
  operationalPct: 94,
  faultyPct: 6,
  darkZonesCount: 3,
  sampleIncident: {
    poleId: 'Pole #SL-183',
    ward: 'Ward 8 (T. Nagar Pedestrian Zone)',
    status: 'OFFLINE',
    aiPriority: 'HIGH',
    reason: 'High pedestrian activity + low visibility corridor hazard.',
    lat: 13.0415,
    lng: 80.2335
  }
};

export const MOCK_SMART_WASTE: SmartWasteData = {
  ward: 'Ward 20 (Guindy Industrial Sector)',
  binId: 'Bin #WB-092',
  fillLevelPct: 94,
  status: 'OVERFLOW_RISK',
  predictedOverflow: '2h 18m',
  recommendedAction: 'Dispatch automated municipal compactor vehicle #GC-08.',
  lat: 13.0075,
  lng: 80.2030
};

export const MOCK_SMART_WATER: SmartWaterData = {
  networkHealthPct: 97,
  normalPipeline: {
    id: 'Pipeline #WN-201',
    pressure: 'NORMAL (4.2 BAR)'
  },
  riskPipeline: {
    id: 'Pipeline #WN-188',
    leakRisk: 'HIGH',
    estimatedLossLitrePerHour: 1240,
    recommendedAction: 'Inspect valve 14B immediately; isolate sector if pressure drops below 2.8 BAR.',
    lat: 12.9835,
    lng: 80.2245
  }
};

export const MOCK_ENVIRONMENT_AQI: EnvironmentAqiData = {
  aqi: 86,
  pm25: 34,
  pm10: 61,
  pollutionHotspot: 'Central Zone (Kathipara Junction)',
  exposureRisk: 'MEDIUM',
  temperatureC: 28.4,
  humidityPct: 84
};

export const MOCK_EMERGENCY_FLEET: EmergencyFleetTelemetry = {
  ambulancesAvailable: 7,
  fireUnitsAvailable: 3,
  policeAvailable: 12,
  activeIncidentDispatch: {
    incidentId: 'INCIDENT #7421',
    nearestUnit: 'AMB-04 (Advanced Life Support)',
    etaMinutesSeconds: '04:21',
    status: 'DISPATCHED',
    lat: 12.9805,
    lng: 80.2195
  }
};

export const MOCK_SMART_PARKING: SmartParkingData = {
  zone: 'Central Commercial Zone (Phoenix Mall Buffer)',
  occupancyPct: 78,
  availableSpaces: 142,
  totalCapacity: 650,
  violationsCount: 3,
  aiRecommendation: 'Direct incoming traffic to Parking Zone B (142 bays available).'
};

export const MOCK_LIVE_EVENTS: CityLiveEvent[] = [
  {
    id: 'EVT-101',
    timestamp: '18:52:14',
    category: 'FLOOD',
    title: 'Flood risk increased to Level 4 (91/100)',
    location: 'Ward 12 (Velachery 100ft Road)',
    severity: 'CRITICAL'
  },
  {
    id: 'EVT-102',
    timestamp: '18:51:48',
    category: 'TRAFFIC',
    title: 'Traffic congestion detected (Speed: 18 km/h)',
    location: 'Mount Road / Anna Salai',
    severity: 'HIGH'
  },
  {
    id: 'EVT-103',
    timestamp: '18:51:02',
    category: 'LIGHTING',
    title: 'Street light failure detected (Pole #SL-183)',
    location: 'Ward 8 (T. Nagar)',
    severity: 'MEDIUM'
  },
  {
    id: 'EVT-104',
    timestamp: '18:50:31',
    category: 'WASTE',
    title: 'Waste overflow risk at 94% capacity (Bin #WB-092)',
    location: 'Ward 20 (Guindy)',
    severity: 'MEDIUM'
  },
  {
    id: 'EVT-105',
    timestamp: '18:49:55',
    category: 'EMERGENCY',
    title: 'Ambulance AMB-04 dispatched (ETA: 04:21)',
    location: 'Incident #7421 (Velachery)',
    severity: 'HIGH'
  },
  {
    id: 'EVT-106',
    timestamp: '18:48:10',
    category: 'WATER',
    title: 'Pipeline pressure anomaly 1,240 L/hr leak alert (#WN-188)',
    location: 'Ward 13 (Taramani Link)',
    severity: 'HIGH'
  }
];

export const MOCK_AI_CITY_INSIGHT: AiCityInsight = {
  alertLevel: 'CRITICAL_WARNING',
  headline: 'FLOOD RISK ESCALATING',
  zone: 'WARD 12 (Velachery Bypass Corridor)',
  confidencePct: 89,
  signals: [
    'Heavy rainfall (42.5 mm/hr continuous precipitation)',
    '4 nearby waterlogging reports clustered within 50m',
    'Major storm-water drain blockage detected',
    '180m from DAV Public School active session',
    'High arterial traffic density & slow movement'
  ],
  recommendedActions: [
    'Dispatch Drainage & De-watering Rapid Squad Alpha-4',
    'Clear drainage bottlenecks with de-watering rigs',
    'Geo-fence 100ft road with detour signage',
    'Broadcast SMS municipal advisory alert'
  ],
  predictedImpactCitizens: 2847
};

export const INITIAL_DIGITAL_TWIN_LAYERS: DigitalTwinLayers = {
  incidents: true,
  criticalIncidents: true,
  highPriority: true,
  dedupRadius50m: true,
  floodZones: true,
  schools: true,
  hospitals: true,
  traffic: true,
  streetLights: false,
  wasteBins: false,
  waterNetwork: false,
  aqiHotspots: false,
  emergencyUnits: true,
  riskForecastZones: true
};
