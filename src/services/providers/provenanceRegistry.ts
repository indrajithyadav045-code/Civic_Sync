import { DataProvenance } from './types';

export interface DataRegistryEntry {
  category: string;
  officialSource: string;
  sourceAuthority: string;
  portalUrl: string;
  standardProtocol: string;
  status: 'LIVE' | 'STANDBY' | 'ONLINE';
  refreshFrequency: string;
  description: string;
}

export const DATA_PROVENANCE_REGISTRY: DataRegistryEntry[] = [
  {
    category: 'WEATHER & PRECIPITATION',
    officialSource: 'India Meteorological Department (IMD) / Open-Meteo',
    sourceAuthority: 'Ministry of Earth Sciences, Govt. of India',
    portalUrl: 'https://mausam.imd.gov.in',
    standardProtocol: 'REST JSON Doppler Radar Telemetry',
    status: 'LIVE',
    refreshFrequency: 'Every 60 seconds',
    description: 'Continuous surface temperature, humidity, wind velocity, and hourly precipitation mm/hr.'
  },
  {
    category: 'AIR QUALITY & POLLUTION',
    officialSource: 'Central Pollution Control Board (CPCB) / CAAQMS',
    sourceAuthority: 'Ministry of Environment, Forest and Climate Change',
    portalUrl: 'https://cpcb.nic.in',
    standardProtocol: 'Continuous Ambient Air Monitoring Protocol (CAAQMS)',
    status: 'LIVE',
    refreshFrequency: 'Every 60 seconds',
    description: 'Live sensor stations measuring AQI, PM2.5, PM10, Nitrogen Dioxide (NO2), SO2, and Ozone (O3).'
  },
  {
    category: 'URBAN TRAFFIC & TRANSIT',
    officialSource: 'Greater Chennai Traffic Police (GCTP) / IUDX',
    sourceAuthority: 'India Urban Data Exchange (IUDX), Smart Cities Mission',
    portalUrl: 'https://iudx.org.in',
    standardProtocol: 'IUDX Standard Geo-JSON Data Schemas',
    status: 'LIVE',
    refreshFrequency: 'Every 30 seconds',
    description: 'Arterial road traffic speed, congestion density index, and automated accident/blockage detection.'
  },
  {
    category: 'MUNICIPAL SCADA & SENSORS',
    officialSource: 'Greater Chennai Corporation (GCC) ICCC & CMWSSB',
    sourceAuthority: 'Smart Cities Mission Data Portal, Govt. of India',
    portalUrl: 'https://smartcities.data.gov.in',
    standardProtocol: 'MQTT / LoRaWAN / CoAP SCADA Streams',
    status: 'LIVE',
    refreshFrequency: 'Every 45 seconds',
    description: 'Storm-water drain ultrasound level sensors, pipeline pressure bar monitors, ultrasonic waste bin fill sensors.'
  },
  {
    category: 'CITIZEN GRIEVANCE INGESTION',
    officialSource: 'CIVIC-SYNC Public Redressal System',
    sourceAuthority: 'Greater Chennai Corporation (GCC)',
    portalUrl: 'https://chennaicorporation.gov.in',
    standardProtocol: 'Geo-Referenced Form C-1 Ingestion with EXIF Validation',
    status: 'LIVE',
    refreshFrequency: 'Sub-second real-time',
    description: 'Crowdsourced photographic citizen reports with GPS coordinates and multi-lingual grievance descriptions.'
  },
  {
    category: 'SPATIAL DEDUPLICATION & RISK',
    officialSource: 'CIVIC-SYNC AI Engine & PostgreSQL PostGIS',
    sourceAuthority: 'GCC Integrated Command & Control Center (ICCC)',
    portalUrl: 'https://postgis.net',
    standardProtocol: 'PostGIS ST_DWithin (50m Buffer) & Spatial Weight Matrices',
    status: 'LIVE',
    refreshFrequency: 'Computed on-demand',
    description: '50-meter Haversine proximity clustering, school/hospital buffer intersections, and dynamic SLA calculations.'
  }
];
