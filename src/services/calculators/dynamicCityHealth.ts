import { CityHealthMetrics } from '../../types';

export interface DynamicHealthInputs {
  trafficDensityPct: number;
  activeBlockages: number;
  criticalIncidentsCount: number;
  darkZonesCount: number;
  aqiValue: number;
  wasteOverflowCount: number;
  waterNetworkHealthPct: number;
  lightingOperationalPct: number;
  ambulancesAvailable: number;
  fireUnitsAvailable: number;
}

export function calculateDynamicCityHealth(inputs: DynamicHealthInputs): CityHealthMetrics {
  // 1. Mobility Score (Max 100)
  const mobility = Math.max(20, Math.min(100, Math.round(
    100 - (inputs.trafficDensityPct * 0.3) - (inputs.activeBlockages * 6)
  )));

  // 2. Safety Score (Max 100)
  const safety = Math.max(20, Math.min(100, Math.round(
    100 - (inputs.criticalIncidentsCount * 7) - (inputs.darkZonesCount * 3)
  )));

  // 3. Environment Score (Max 100)
  const environment = Math.max(20, Math.min(100, Math.round(
    100 - (inputs.aqiValue * 0.28) - (inputs.wasteOverflowCount * 5)
  )));

  // 4. Infrastructure Score (Max 100)
  const infrastructure = Math.max(20, Math.min(100, Math.round(
    (inputs.waterNetworkHealthPct * 0.5) + (inputs.lightingOperationalPct * 0.5)
  )));

  // 5. Emergency Response Capacity Score (Max 100)
  const emergency = Math.max(20, Math.min(100, Math.round(
    Math.min(100, (inputs.ambulancesAvailable * 8) + (inputs.fireUnitsAvailable * 12) + 10)
  )));

  // Weighted Total
  const overallScore = Math.round(
    (mobility * 0.2) +
    (safety * 0.25) +
    (environment * 0.2) +
    (infrastructure * 0.15) +
    (emergency * 0.2)
  );

  let status: 'OPTIMAL' | 'MODERATE' | 'CRITICAL' = 'OPTIMAL';
  if (overallScore < 60) status = 'CRITICAL';
  else if (overallScore < 80) status = 'MODERATE';

  return {
    overallScore,
    mobility,
    safety,
    environment,
    infrastructure,
    emergency,
    activeTrend: overallScore >= 80 ? 'UP' : overallScore >= 60 ? 'STABLE' : 'DOWN',
    status
  };
}
