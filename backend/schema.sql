-- ==========================================================
-- CIVIC-SYNC PostgreSQL + PostGIS Smart City Schema
-- ==========================================================

-- Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Citizen Reports Table
CREATE TABLE IF NOT EXISTS citizen_reports (
    id VARCHAR(32) PRIMARY KEY,
    citizen_name VARCHAR(128) NOT NULL,
    citizen_phone VARCHAR(32) NOT NULL,
    raw_text TEXT NOT NULL,
    image_url TEXT,
    location_name VARCHAR(255),
    geom GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) DEFAULT 'PENDING'
);

-- Spatial Index for 50m Deduplication
CREATE INDEX IF NOT EXISTS idx_citizen_reports_geom ON citizen_reports USING GIST (geom);

-- 2. Master Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL,
    status VARCHAR(32) NOT NULL,
    assigned_department VARCHAR(64) NOT NULL,
    assigned_team VARCHAR(64),
    assigned_officer VARCHAR(64),
    geom GEOMETRY(Point, 4326) NOT NULL,
    ai_confidence FLOAT NOT NULL,
    risk_score INT NOT NULL,
    sla_target_timestamp BIGINT NOT NULL,
    sla_remaining_seconds INT NOT NULL,
    is_primary_master BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incidents_geom ON incidents USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents (status);

-- 3. Sensitive Infrastructure Table (Schools & Hospitals)
CREATE TABLE IF NOT EXISTS spatial_features (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    feature_type VARCHAR(32) NOT NULL, -- 'SCHOOL', 'HOSPITAL', 'FLOOD_BASIN'
    buffer_radius_meters INT NOT NULL,
    geom GEOMETRY(Geometry, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_spatial_features_geom ON spatial_features USING GIST (geom);

-- 4. Weather Observations Table (IMD Integration)
CREATE TABLE IF NOT EXISTS weather_observations (
    id SERIAL PRIMARY KEY,
    station_name VARCHAR(128) NOT NULL,
    temperature_c FLOAT NOT NULL,
    humidity_pct INT NOT NULL,
    precipitation_mm_hr FLOAT NOT NULL,
    wind_speed_kmh FLOAT NOT NULL,
    weather_code INT NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Air Quality Observations Table (CPCB Integration)
CREATE TABLE IF NOT EXISTS aqi_observations (
    id SERIAL PRIMARY KEY,
    station_name VARCHAR(128) NOT NULL,
    aqi INT NOT NULL,
    pm25 FLOAT NOT NULL,
    pm10 FLOAT NOT NULL,
    no2 FLOAT,
    so2 FLOAT,
    o3 FLOAT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Emergency Geo-Fence Broadcasts Table
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(16) NOT NULL,
    area_radius_meters INT NOT NULL,
    center_geom GEOMETRY(Point, 4326) NOT NULL,
    affected_citizens_estimate INT,
    status VARCHAR(32) DEFAULT 'BROADCASTING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Core PostGIS 50m Spatial Deduplication Query
-- Finds all existing reports within 50 meters of a new point
-- ==========================================================
-- Example query:
-- SELECT id, title, ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(80.2180, 12.9815), 4326)::geography) AS distance_meters
-- FROM incidents
-- WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(80.2180, 12.9815), 4326)::geography, 50);
