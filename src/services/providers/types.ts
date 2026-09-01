export type DataStatus = 'LIVE' | 'UPDATING' | 'STALE' | 'OFFLINE' | 'NO_DATA';

export interface DataProvenance {
  source: string;
  sourceUrl?: string;
  lastUpdated: string;
  status: DataStatus;
  refreshIntervalMs: number;
  providerName: string;
  endpoint?: string;
  reliabilityScorePct?: number;
}

export interface ForecastHour {
  time: string;
  tempC: number;
  precipitationMm: number;
  rainProbPct: number;
  weatherCode: number;
}

export interface AuraClimateRisk {
  heatwaveRiskPct: number;
  floodRiskPct: number;
  droughtRiskPct: number;
  overallClimateScorePct: number;
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Severe Hazard';
  aiClimateInsight: string;
  recommendedActions: string[];
}

export interface LiveWeatherData {
  temperatureC: number;
  apparentTempC?: number;
  humidityPct: number;
  precipitationMmHr: number;
  windSpeedKmh: number;
  weatherCode: number;
  conditionLabel: string;
  isRaining: boolean;
  warnings: string[];
  hourlyForecast?: ForecastHour[];
  auraClimateRisk?: AuraClimateRisk;
  provenance: DataProvenance;
}

export interface LiveAqiData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  stationName: string;
  exposureRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'HAZARDOUS';
  provenance: DataProvenance;
}

export interface LiveTrafficData {
  corridor: string;
  densityPct: number;
  averageSpeedKmh: number;
  congestionLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  activeBlockages: number;
  activeAccidents: number;
  aiRouteDiversion: string;
  provenance: DataProvenance;
}

export interface LiveIotTelemetry {
  lightingOperationalPct: number;
  lightingFaultsCount: number;
  wasteBinFillPct: number;
  wasteBinStatus: string;
  waterPipelinePressureBar: number;
  waterLeakRateLph: number;
  floodWaterLevelFt: number;
  provenance: DataProvenance;
}
