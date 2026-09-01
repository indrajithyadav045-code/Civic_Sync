import { FloodDrainageIntelligence } from '../../types';

export interface DynamicFloodInputs {
  wardName: string;
  rainfallMmHr: number;
  waterLevelFt: number;
  nearbyIncidentReportsCount: number;
  schoolDistanceMeters: number;
  trafficCongested: boolean;
}

export function calculateDynamicFloodIntelligence(inputs: DynamicFloodInputs): FloodDrainageIntelligence {
  // Dynamic weights
  const rainfallWeight = Math.min(35, inputs.rainfallMmHr * 0.7);
  const waterLevelWeight = Math.min(30, inputs.waterLevelFt * 10);
  const incidentDensityWeight = Math.min(20, inputs.nearbyIncidentReportsCount * 4.5);
  const schoolBufferWeight = inputs.schoolDistanceMeters <= 200 ? 15 : inputs.schoolDistanceMeters <= 500 ? 8 : 0;

  const rawScore = Math.round(rainfallWeight + waterLevelWeight + incidentDensityWeight + schoolBufferWeight);
  const riskScore = Math.max(10, Math.min(100, rawScore));

  const signals: string[] = [];
  if (inputs.rainfallMmHr > 20) {
    signals.push(`Heavy precipitation rate (${inputs.rainfallMmHr.toFixed(1)} mm/hr continuous)`);
  } else if (inputs.rainfallMmHr > 5) {
    signals.push(`Moderate monsoon showers (${inputs.rainfallMmHr.toFixed(1)} mm/hr)`);
  } else {
    signals.push(`Normal surface precipitation (${inputs.rainfallMmHr.toFixed(1)} mm/hr)`);
  }

  if (inputs.nearbyIncidentReportsCount > 0) {
    signals.push(`${inputs.nearbyIncidentReportsCount} citizen waterlogging reports clustered within 50m`);
  }

  if (inputs.waterLevelFt >= 2.0) {
    signals.push(`Severe standing flood level (${inputs.waterLevelFt.toFixed(1)} ft on roadway)`);
  }

  if (inputs.schoolDistanceMeters <= 200) {
    signals.push(`${inputs.schoolDistanceMeters}m from active School corridor safety buffer`);
  }

  if (inputs.trafficCongested) {
    signals.push('High arterial vehicular volume and route slowdown');
  }

  const recommendedActions: string[] = [];
  if (riskScore >= 75) {
    recommendedActions.push('Dispatch Disaster Management Unit Alpha-4');
    recommendedActions.push('Mobilize 150HP de-watering super-sucker pumps');
    recommendedActions.push('Apply 500m geofence perimeter on 100ft road');
    recommendedActions.push('Broadcast cell-tower emergency warning to subscribers');
  } else if (riskScore >= 50) {
    recommendedActions.push('Deploy Municipal Health & Sanitation drain clearance team');
    recommendedActions.push('Monitor SCADA water level sensors every 15 minutes');
    recommendedActions.push('Issue precautionary traffic advisory');
  } else {
    recommendedActions.push('Routine storm-water drain telemetry surveillance');
  }

  return {
    ward: inputs.wardName,
    riskScore,
    waterLevelFeet: inputs.waterLevelFt,
    rainfallMmHr: inputs.rainfallMmHr,
    drainageFlowPct: Math.max(20, Math.round(100 - (riskScore * 0.7))),
    signals,
    recommendedActions,
    nearbyReportsCount: inputs.nearbyIncidentReportsCount,
    sensitiveProximity: `${inputs.schoolDistanceMeters}m from DAV School & Apollo Clinic`
  };
}
