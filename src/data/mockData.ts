import { Incident, EmergencyBroadcast, ForecastHotspot } from '../types';

export const CHENNAI_DEFAULT_COORDS = {
  lat: 12.9815,
  lng: 80.2180
};

export const SENSITIVE_INFRASTRUCTURE = [
  {
    id: 'SCH-1',
    name: 'DAV Senior Secondary School (Velachery)',
    type: 'SCHOOL',
    lat: 12.9825,
    lng: 80.2195,
    population: 1450,
    radius: 200
  },
  {
    id: 'SCH-2',
    name: 'Chennai Public School (Anna Nagar)',
    type: 'SCHOOL',
    lat: 13.0890,
    lng: 80.2150,
    population: 1800,
    radius: 200
  },
  {
    id: 'HOSP-1',
    name: 'Apollo Hospital (Greams Road Emergency)',
    type: 'HOSPITAL',
    lat: 13.0585,
    lng: 80.2520,
    beds: 650,
    radius: 300
  },
  {
    id: 'HOSP-2',
    name: 'MIOT International Multi-Speciality (Manapakkam)',
    type: 'HOSPITAL',
    lat: 13.0180,
    lng: 80.1860,
    beds: 500,
    radius: 300
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'CS-7421',
    title: 'Severe Flash Flooding & Road Inundation',
    description: 'Heavy northeast monsoon rain has severely inundated the 100 Feet Bypass Road near DAV Senior Secondary School, Velachery. Water level is over 2.5 feet, trapping two light vehicles and halting traffic flow toward OMR.',
    category: 'Flooding / Drainage Blockage',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    locationName: '100 Feet Bypass Road, Velachery, Chennai',
    coordinates: {
      lat: 12.9815,
      lng: 80.2180
    },
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-09-01T14:15:00Z',
    updatedAt: '2026-09-01T14:38:00Z',
    citizenName: 'Karthik Subramanian',
    citizenContact: '+91 98401 23456',
    aiConfidence: 94,
    aiReasoning: [
      'Heavy surface water inundation (>75cm) identified by CV segmentation',
      'Roadway obstruction blocking Velachery-OMR arterial corridor',
      'High-risk vulnerability: 180m from DAV Public School Velachery',
      'Spatial clustering: 3 duplicate citizen reports confirmed within 42m radius in Velachery'
    ],
    recommendedDepartment: 'Drainage & Stormwater Management',
    assignedDepartment: 'Drainage & Stormwater Management',
    assignedTeam: 'Greater Chennai Corp (GCC) De-watering Unit Alpha-4',
    assignedOfficer: 'Capt. R. Selvam (Badge #GCC-DD-882)',
    detectedObjects: [
      {
        id: 'box-1',
        label: 'Flood Water Inundation (2.5ft)',
        confidence: 0.96,
        box: { top: 38, left: 12, width: 76, height: 52 },
        color: '#06b6d4',
        damageLevel: 'SEVERE'
      },
      {
        id: 'box-2',
        label: 'Submerged Vehicle (Sedan)',
        confidence: 0.91,
        box: { top: 45, left: 35, width: 28, height: 32 },
        color: '#f43f5e',
        damageLevel: 'SEVERE'
      },
      {
        id: 'box-3',
        label: 'Choked Storm Drain Intake',
        confidence: 0.88,
        box: { top: 68, left: 70, width: 20, height: 22 },
        color: '#f59e0b',
        damageLevel: 'MODERATE'
      }
    ],
    spatial: {
      schoolDistanceMeters: 180,
      schoolName: 'DAV Senior Secondary School (Velachery)',
      hospitalDistanceMeters: 620,
      hospitalName: 'Apollo Speciality Hospital (OMR/Perungudi)',
      inFloodRiskZone: true,
      floodZoneName: 'Velachery Low-Lying Drainage Basin Zone 13',
      nearbyDuplicatesCount: 3,
      incidentDensityScore: 84
    },
    risk: {
      baseScore: 45,
      schoolProximityBonus: 20,
      hospitalProximityBonus: 8,
      floodZoneBonus: 10,
      duplicateClusterBonus: 8,
      densityBonus: 5,
      totalScore: 91,
      priorityLevel: 'HIGH',
      reasoning: [
        '✓ High incident severity (Velachery bypass flooded with stalled vehicles)',
        '✓ 3 nearby duplicate citizen reports within 42m (High civic distress)',
        '✓ 180m from DAV Public School during student dismissal hours',
        '✓ Located inside classified Velachery Flood-Risk Basin Zone 13'
      ]
    },
    duplicates: [
      {
        id: 'DUP-901',
        citizenName: 'Priya Narayanan',
        phoneMasked: '+91 98*** **412',
        timestamp: '14:18:22',
        distanceFromPrimaryMeters: 18,
        lat: 12.9816,
        lng: 80.2181,
        notes: 'Water rising rapidly near Velachery Lake road, 2-wheelers cannot cross',
        imageThumbnail: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'DUP-902',
        citizenName: 'Venkatesh Raman',
        phoneMasked: '+91 97*** **903',
        timestamp: '14:22:05',
        distanceFromPrimaryMeters: 34,
        lat: 12.9814,
        lng: 80.2178,
        notes: 'Stormwater canal overflowing onto main bypass road',
        imageThumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 'DUP-903',
        citizenName: 'Lakshmi Sundaram',
        phoneMasked: '+91 99*** **118',
        timestamp: '14:25:40',
        distanceFromPrimaryMeters: 41,
        lat: 12.9817,
        lng: 80.2176,
        notes: 'Heavy waterlogging near school gate, students stranded',
        imageThumbnail: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=200&q=80'
      }
    ],
    isPrimaryMaster: true,
    sla: {
      initialHours: 4,
      targetTimestamp: Date.now() + (2 * 3600 + 48 * 60 + 31) * 1000,
      remainingSeconds: 2 * 3600 + 48 * 60 + 31,
      isAtRisk: false,
      isBreached: false,
      contextualReductionReasons: [
        'Reduced by 45m due to school zone proximity (<200m)',
        'Reduced by 30m due to multiple duplicate spikes in Velachery',
        'Reduced by 15m due to active Chennai Northeast Monsoon alert'
      ]
    },
    resolution: {
      beforeImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
      afterImage: 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?auto=format&fit=crop&w=1000&q=80',
      resolvedAt: 'Pending Completion (82% De-watered)',
      resolvedByStaff: 'Team Lead S. Thangavel',
      staffBadge: 'GCC-DM-CREW-04',
      geoVerified: true,
      cvConfidenceScore: 97.4,
      aiVerificationNotes: [
        'Water surface level reduced from 76cm to 0cm (Dry Asphalt)',
        'Velachery Bypass traffic restored',
        'EXIF GPS verification matches Velachery coordinates within 1.2m tolerance'
      ],
      status: 'VERIFIED'
    },
    timeline: [
      { stage: 'Report Received', timestamp: '14:15:02', completed: true, active: false, description: 'Citizen submitted via Chennai Mobile Portal with GPS tag' },
      { stage: 'AI Triage & Deduplication', timestamp: '14:15:06', completed: true, active: false, description: 'CV classified Flooding (94%), merged 3 duplicate reports within 50m' },
      { stage: 'Department Assigned', timestamp: '14:16:10', completed: true, active: false, description: 'Assigned to Greater Chennai Corp Rapid De-watering Unit Alpha-4' },
      { stage: 'Team Dispatched', timestamp: '14:20:45', completed: true, active: false, description: 'High-power suction diesel pumps en route via GPS Telemetry' },
      { stage: 'Issue Being Resolved', timestamp: '14:32:00', completed: false, active: true, description: 'Heavy pumps operating at Velachery 100ft road junction' },
      { stage: 'Verification Pending', timestamp: 'Estimated 15:15', completed: false, active: false, description: 'AI Before/After CV verification required upon completion' }
    ]
  },
  {
    id: 'CS-7422',
    title: 'High-Voltage Cable Snap & Transformer Sparking',
    description: '11kV overhead distribution line snapped and dangling dangerously across pedestrian walkway at Ranganathan Street, T. Nagar. Intermittent electrical arcing.',
    category: 'Electrical Grid Failure',
    severity: 'CRITICAL',
    status: 'ASSIGNED',
    locationName: 'Ranganathan Street, T. Nagar, Chennai',
    coordinates: {
      lat: 13.0410,
      lng: 80.2330
    },
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-09-01T14:28:00Z',
    updatedAt: '2026-09-01T14:30:00Z',
    citizenName: 'Muthu Kumar',
    citizenContact: '+91 98410 77889',
    aiConfidence: 98,
    aiReasoning: [
      'Live electrical arc and exposed 11kV cable detected',
      'Ultra-dense commercial pedestrian corridor (T. Nagar)',
      'Potential fatal hazard requiring instant TANGEDCO feeder isolation'
    ],
    recommendedDepartment: 'Power & Utilities',
    assignedDepartment: 'Power & Utilities',
    assignedTeam: 'TANGEDCO Emergency Squad 02 (T. Nagar)',
    assignedOfficer: 'Eng. K. Balaji',
    detectedObjects: [
      {
        id: 'box-p1',
        label: 'Snapped 11kV Conductor',
        confidence: 0.98,
        box: { top: 20, left: 15, width: 65, height: 45 },
        color: '#f43f5e',
        damageLevel: 'SEVERE'
      }
    ],
    spatial: {
      schoolDistanceMeters: 380,
      schoolName: 'Ramakrishna Mission Higher Secondary School',
      hospitalDistanceMeters: 290,
      hospitalName: 'Apollo Spectra Hospital (T. Nagar)',
      inFloodRiskZone: false,
      nearbyDuplicatesCount: 4,
      incidentDensityScore: 92
    },
    risk: {
      baseScore: 50,
      schoolProximityBonus: 10,
      hospitalProximityBonus: 18,
      floodZoneBonus: 0,
      duplicateClusterBonus: 10,
      densityBonus: 10,
      totalScore: 98,
      priorityLevel: 'CRITICAL',
      reasoning: [
        '✓ Lethal electrical shock hazard in heavy commercial shopping district',
        '✓ 290m from Apollo Spectra emergency route',
        '✓ Rapid deduplication: 4 emergency pings merged'
      ]
    },
    duplicates: [],
    isPrimaryMaster: true,
    sla: {
      initialHours: 1,
      targetTimestamp: Date.now() + (0 * 3600 + 24 * 60 + 10) * 1000,
      remainingSeconds: 24 * 60 + 10,
      isAtRisk: true,
      isBreached: false,
      contextualReductionReasons: [
        'Critical tier emergency: Base SLA reduced to 45 minutes',
        'T. Nagar shopping zone pedestrian density multiplier'
      ]
    },
    timeline: [
      { stage: 'Report Received', timestamp: '14:28:01', completed: true, active: false, description: 'Reported with geo-tag' },
      { stage: 'AI Triage', timestamp: '14:28:03', completed: true, active: false, description: 'Classified CRITICAL electrical grid fault' },
      { stage: 'Department Assigned', timestamp: '14:29:15', completed: true, active: true, description: 'Dispatched TANGEDCO Feeder Cutoff Unit' },
      { stage: 'Team Dispatched', timestamp: '14:31:00', completed: false, active: false, description: 'En route to T. Nagar' },
      { stage: 'Issue Being Resolved', timestamp: 'Pending', completed: false, active: false, description: 'Power isolation in progress' },
      { stage: 'Verification Pending', timestamp: 'Pending', completed: false, active: false, description: 'Awaiting crew verification' }
    ]
  },
  {
    id: 'CS-7419',
    title: 'Huge Fallen Banyan Tree Blocking Hospital Route',
    description: 'Centuries-old banyan tree uprooted during squall, crushing electrical street poles and completely blocking both lanes on Greams Road near Apollo Hospital.',
    category: 'Fallen Tree / Vegetation Hazard',
    severity: 'HIGH',
    status: 'RESOLVED',
    locationName: 'Greams Road, Thousand Lights, Chennai',
    coordinates: {
      lat: 13.0585,
      lng: 80.2520
    },
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-09-01T11:10:00Z',
    updatedAt: '2026-09-01T13:40:00Z',
    citizenName: 'Dr. S. Ramachandran',
    citizenContact: '+91 94440 11445',
    aiConfidence: 96,
    aiReasoning: [
      'Major dual-lane obstruction on critical Apollo Hospital ambulance corridor',
      'Structural damage to municipal electrical poles',
      'Spatial routing to GCC Parks & Arborist Division'
    ],
    recommendedDepartment: 'Public Works & Roads',
    assignedDepartment: 'Public Works & Roads',
    assignedTeam: 'GCC Heavy Arborist Unit 1 (Zone 9)',
    assignedOfficer: 'Foreman M. Elangovan',
    detectedObjects: [
      {
        id: 'box-t1',
        label: 'Uprooted Trunk (1.2m Diameter)',
        confidence: 0.97,
        box: { top: 30, left: 10, width: 80, height: 60 },
        color: '#10b981',
        damageLevel: 'SEVERE'
      }
    ],
    spatial: {
      schoolDistanceMeters: 650,
      schoolName: 'St. Bedes Anglo Indian',
      hospitalDistanceMeters: 120,
      hospitalName: 'Apollo Hospital (Greams Road Emergency)',
      inFloodRiskZone: false,
      nearbyDuplicatesCount: 6,
      incidentDensityScore: 89
    },
    risk: {
      baseScore: 40,
      schoolProximityBonus: 5,
      hospitalProximityBonus: 25,
      floodZoneBonus: 0,
      duplicateClusterBonus: 12,
      densityBonus: 7,
      totalScore: 89,
      priorityLevel: 'HIGH',
      reasoning: [
        '✓ Direct ambulance corridor to Apollo Emergency (<120m)',
        '✓ 6 merged duplicate citizen reports',
        '✓ Complete blockage of Greams Road dual carriageway'
      ]
    },
    duplicates: [],
    isPrimaryMaster: true,
    sla: {
      initialHours: 3,
      targetTimestamp: Date.now() - 3600000,
      remainingSeconds: 0,
      isAtRisk: false,
      isBreached: false,
      contextualReductionReasons: [
        'Hospital ambulance corridor high-priority escalation'
      ]
    },
    resolution: {
      beforeImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
      afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
      resolvedAt: '2026-09-01 13:38:12 IST',
      resolvedByStaff: 'Foreman M. Elangovan (GCC Public Works)',
      staffBadge: 'GCC-TREE-09',
      geoVerified: true,
      cvConfidenceScore: 99.1,
      aiVerificationNotes: [
        'Tree trunk and foliage 100% removed from Greams Road carriageway',
        'Debris cleared; ambulance route to Apollo restored',
        'Post-clearance CV verified clean asphalt clearance',
        'EXIF GPS verification matches Greams Road coordinates with 0.8m accuracy'
      ],
      status: 'VERIFIED'
    },
    timeline: [
      { stage: 'Report Received', timestamp: '11:10:00', completed: true, active: false, description: 'Reported by Dr. Ramachandran' },
      { stage: 'AI Triage & Dedup', timestamp: '11:10:04', completed: true, active: false, description: 'Classified & 6 duplicates merged' },
      { stage: 'Department Assigned', timestamp: '11:12:00', completed: true, active: false, description: 'Assigned GCC Heavy Arborist Unit' },
      { stage: 'Team Dispatched', timestamp: '11:18:00', completed: true, active: false, description: 'Hydraulic saw & crane arrived on Greams Road' },
      { stage: 'Issue Resolved', timestamp: '13:35:00', completed: true, active: false, description: 'Obstruction cleaved and cleared' },
      { stage: 'AI CV Verification Verified', timestamp: '13:38:12', completed: true, active: false, description: 'AI verified resolution with 99.1% visual confidence' }
    ]
  },
  {
    id: 'CS-7425',
    title: 'Metro Water Primary Pipeline Rupture & Sinkhole',
    description: 'CMWSSB 36-inch primary potable water main ruptured under pavement on Anna Salai near Guindy, forming a 4-meter wide crater and flooding adjacent road lanes.',
    category: 'Structural & Infrastructure Damage',
    severity: 'HIGH',
    status: 'AI_TRIAGED',
    locationName: 'Anna Salai near Guindy Industrial Estate, Chennai',
    coordinates: {
      lat: 13.0067,
      lng: 80.2025
    },
    image: 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-09-01T14:35:00Z',
    updatedAt: '2026-09-01T14:36:00Z',
    citizenName: 'Anand Mohan',
    citizenContact: '+91 97910 55667',
    aiConfidence: 95,
    aiReasoning: [
      'Structural subgrade subsidence and asphalt collapse detected',
      'Continuous potable water loss (>12,000 L/min estimated)',
      'Subsurface cavity poses structural danger to Anna Salai traffic'
    ],
    recommendedDepartment: 'Public Works & Roads',
    assignedDepartment: 'Public Works & Roads',
    detectedObjects: [
      {
        id: 'box-sh1',
        label: 'Asphalt Crater / Sinkhole (4m)',
        confidence: 0.94,
        box: { top: 35, left: 20, width: 60, height: 50 },
        color: '#f59e0b',
        damageLevel: 'SEVERE'
      }
    ],
    spatial: {
      schoolDistanceMeters: 550,
      schoolName: 'Guindy Higher Secondary School',
      hospitalDistanceMeters: 800,
      hospitalName: 'Government Peripheral Hospital Guindy',
      inFloodRiskZone: false,
      nearbyDuplicatesCount: 2,
      incidentDensityScore: 68
    },
    risk: {
      baseScore: 45,
      schoolProximityBonus: 8,
      hospitalProximityBonus: 5,
      floodZoneBonus: 0,
      duplicateClusterBonus: 6,
      densityBonus: 4,
      totalScore: 78,
      priorityLevel: 'HIGH',
      reasoning: [
        '✓ Structural asphalt subsidence risk on major Anna Salai arterial',
        '✓ High municipal utility water loss',
        '✓ 2 duplicate reports verified within 30m'
      ]
    },
    duplicates: [],
    isPrimaryMaster: true,
    sla: {
      initialHours: 3,
      targetTimestamp: Date.now() + (2 * 3600 + 15 * 60) * 1000,
      remainingSeconds: 2 * 3600 + 15 * 60,
      isAtRisk: false,
      isBreached: false,
      contextualReductionReasons: [
        'Anna Salai traffic corridor hazard escalation'
      ]
    },
    timeline: [
      { stage: 'Report Received', timestamp: '14:35:10', completed: true, active: false, description: 'Citizen photo submitted' },
      { stage: 'AI Triage', timestamp: '14:35:14', completed: true, active: true, description: 'Classified HIGH priority water infrastructure failure' },
      { stage: 'Department Assigned', timestamp: 'Pending', completed: false, active: false, description: 'Awaiting CMWSSB / GCC dispatcher assignment' },
      { stage: 'Team Dispatched', timestamp: 'Pending', completed: false, active: false, description: 'Water isolation crew queued' },
      { stage: 'Issue Being Resolved', timestamp: 'Pending', completed: false, active: false, description: 'Excavation and valve cutoff' },
      { stage: 'Verification Pending', timestamp: 'Pending', completed: false, active: false, description: 'Awaiting repair validation' }
    ]
  },
  {
    id: 'CS-7428',
    title: 'Commercial Waste Dump & Canal Obstruction',
    description: 'Unauthorized dumping of commercial packaging and organic municipal waste spilling into Buckingham Canal tributary near Ambattur.',
    category: 'Garbage Accumulation',
    severity: 'MEDIUM',
    status: 'NEW',
    locationName: 'Ambattur Industrial Estate 3rd Main Road, Chennai',
    coordinates: {
      lat: 13.1140,
      lng: 80.1550
    },
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-09-01T14:40:00Z',
    updatedAt: '2026-09-01T14:40:00Z',
    citizenName: 'Deepa Natarajan',
    citizenContact: '+91 98409 12345',
    aiConfidence: 91,
    aiReasoning: [
      'Unsegregated commercial waste pile identified (>15m³)',
      'Potential drainage canal flow obstruction',
      'Automated dispatch to GCC Solid Waste Management'
    ],
    recommendedDepartment: 'Municipal Health & Sanitation',
    assignedDepartment: 'Municipal Health & Sanitation',
    detectedObjects: [
      {
        id: 'box-gb1',
        label: 'Illegal Waste Dumping Pile',
        confidence: 0.92,
        box: { top: 25, left: 15, width: 70, height: 55 },
        color: '#10b981',
        damageLevel: 'MODERATE'
      }
    ],
    spatial: {
      schoolDistanceMeters: 1200,
      schoolName: 'Ambattur Tech Academy',
      hospitalDistanceMeters: 1500,
      hospitalName: 'ESI Hospital Ayanavaram',
      inFloodRiskZone: false,
      nearbyDuplicatesCount: 0,
      incidentDensityScore: 35
    },
    risk: {
      baseScore: 25,
      schoolProximityBonus: 0,
      hospitalProximityBonus: 0,
      floodZoneBonus: 5,
      duplicateClusterBonus: 0,
      densityBonus: 2,
      totalScore: 42,
      priorityLevel: 'MEDIUM',
      reasoning: [
        '✓ Moderate sanitation hazard near industrial canal',
        '✓ Low proximity to sensitive educational/health centers'
      ]
    },
    duplicates: [],
    isPrimaryMaster: true,
    sla: {
      initialHours: 12,
      targetTimestamp: Date.now() + (10 * 3600 + 40 * 60) * 1000,
      remainingSeconds: 10 * 3600 + 40 * 60,
      isAtRisk: false,
      isBreached: false,
      contextualReductionReasons: [
        'Standard sanitation protocol turnaround'
      ]
    },
    timeline: [
      { stage: 'Report Received', timestamp: '14:40:00', completed: true, active: true, description: 'Logged in civic queue' },
      { stage: 'AI Triage', timestamp: 'Pending', completed: false, active: false, description: 'Queued for classification' },
      { stage: 'Department Assigned', timestamp: 'Pending', completed: false, active: false, description: 'Pending automated routing' },
      { stage: 'Team Dispatched', timestamp: 'Pending', completed: false, active: false, description: 'Sanitation truck queue' },
      { stage: 'Issue Being Resolved', timestamp: 'Pending', completed: false, active: false, description: 'Clearance' },
      { stage: 'Verification Pending', timestamp: 'Pending', completed: false, active: false, description: 'Audit' }
    ]
  }
];

export const MOCK_EMERGENCY_ALERTS: EmergencyBroadcast[] = [
  {
    id: 'ALERT-089',
    title: 'CRITICAL INUNDATION & VELACHERY BYPASS CLOSURE',
    message: 'Severe flash flooding detected near DAV School & Velachery 100 Feet Bypass Road. Route blocked toward OMR. Avoid the low-lying underpasses. Heavy GCC de-watering pumps deployed.',
    severity: 'HIGH',
    affectedCitizensEstimate: 2847,
    areaRadiusMeters: 650,
    centerCoordinates: {
      lat: 12.9815,
      lng: 80.2180
    },
    zoneName: 'Velachery Zone 13 & DAV School Corridor Buffer',
    channels: ['SMS_CELL_BROADCAST', 'MOBILE_APP_PUSH', 'DIGITAL_SIGNAGE'],
    issuedAt: '2026-09-01T14:22:00Z',
    activeUntil: '2026-09-01T18:00:00Z',
    status: 'BROADCASTING'
  },
  {
    id: 'ALERT-088',
    title: 'ELECTRICAL HAZARD PERIMETER — T. NAGAR',
    message: 'High-voltage cable hazard at Ranganathan Street, T. Nagar. Pedestrians must maintain minimum 50m standoff distance. TANGEDCO power grid isolation in progress.',
    severity: 'EXTREME',
    affectedCitizensEstimate: 1420,
    areaRadiusMeters: 300,
    centerCoordinates: {
      lat: 13.0410,
      lng: 80.2330
    },
    zoneName: 'T. Nagar Commercial Shopping Perimeter',
    channels: ['SMS_CELL_BROADCAST', 'MOBILE_APP_PUSH', 'SIREN_NETWORK'],
    issuedAt: '2026-09-01T14:30:00Z',
    activeUntil: '2026-09-01T16:00:00Z',
    status: 'BROADCASTING'
  }
];

export const MOCK_FORECAST_HOTSPOTS: ForecastHotspot[] = [
  {
    id: 'FC-ZONE-A',
    zoneName: 'Zone A — Velachery & Madipakkam Low-Lying Basin',
    riskTier: 'HIGH_RISK',
    predictedScore: 88,
    center: { lat: 12.9815, lng: 80.2180 },
    radius: 600,
    primaryRiskDrivers: [
      'Heavy radar precipitation forecast: 42mm in next 2 hours over South Chennai',
      'Velachery storm drainage basin operating at 94% saturation capacity',
      'Historical recurrence: High flood vulnerability during Northeast Monsoon'
    ],
    recommendedPreemptiveAction: 'Deploy 2 standby mobile de-watering diesel pumps & divert MTC bus transit lines',
    precipitationForecastMm: 42.5,
    drainageCapacityPct: 94
  },
  {
    id: 'FC-ZONE-B',
    zoneName: 'Zone B — Greams Road & Cooum Canal River Corridor',
    riskTier: 'MEDIUM_RISK',
    predictedScore: 64,
    center: { lat: 13.0585, lng: 80.2520 },
    radius: 500,
    primaryRiskDrivers: [
      'High coastal wind gusts (48 km/h) risking aged tree falls',
      'Apollo Hospital emergency ambulance transit choke point',
      'Moderate canal backflow expected'
    ],
    recommendedPreemptiveAction: 'Position quick-response GCC arborist patrol & clear gully gratings',
    precipitationForecastMm: 24.0,
    drainageCapacityPct: 62
  },
  {
    id: 'FC-ZONE-C',
    zoneName: 'Zone C — Ambattur Industrial Basin',
    riskTier: 'LOW_RISK',
    predictedScore: 28,
    center: { lat: 13.1140, lng: 80.1550 },
    radius: 750,
    primaryRiskDrivers: [
      'Adequate storm canal discharge into surplus channel',
      'Low residential density'
    ],
    recommendedPreemptiveAction: 'Standard automated telemetry sensor monitoring',
    precipitationForecastMm: 12.0,
    drainageCapacityPct: 38
  }
];
