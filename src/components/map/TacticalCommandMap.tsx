import React, { useEffect, useState, useRef } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  ShieldAlert, 
  School, 
  Building2, 
  Activity, 
  Flame, 
  Radio, 
  Eye, 
  Maximize2,
  CheckCircle2,
  Compass,
  ArrowRight,
  Filter,
  Navigation,
  Crosshair,
  Building,
  Sliders,
  Globe,
  Sun,
  Moon,
  Terminal,
  X,
  Zap,
  Clock,
  Sparkles,
  GitBranch,
  Database
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { SENSITIVE_INFRASTRUCTURE } from '../../data/mockData';
import { DigitalTwinLayerPanel } from '../smartcity/DigitalTwinLayerPanel';
import { Incident } from '../../types';
import L from 'leaflet';

type MapTileStyle = 'osm' | 'satellite' | 'dark' | 'positron';

const TILE_PROVIDERS: Record<MapTileStyle, { url: string; subdomains?: string; maxZoom: number; label: string }> = {
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    label: 'Standard Street Map (Free / Complete Areas)'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
    label: 'Satellite Imagery (Esri)'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    maxZoom: 19,
    label: 'Dark Tactical Command (Carto)'
  },
  positron: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    maxZoom: 19,
    label: 'Light Positron (Clean Minimal)'
  }
};

const TELEMETRY_STREAM = [
  '[22:58:14] PostGIS: Master Incident #CS-7421 auto-merged duplicate report within 28.4m radius. Priority escalated to HIGH.',
  '[22:58:22] YOLOv8 Inference: ViT-B segmented 2.5ft flood surface on Velachery 100ft Bypass (Confidence: 94.2%).',
  '[22:58:31] Spatial Geofence: 180m school proximity safety buffer triggered for DAV Public School.',
  '[22:58:45] ST_DWithin: 2 duplicate dispatches suppressed in Zone 13 Sector 4. Labor hours saved: 5.0h.',
  '[22:59:02] SCADA Telemetry: PWD de-watering pump unit Alpha-4 dispatched via GPS route diversion.'
];

export const TacticalCommandMap: React.FC = () => {
  const { 
    incidents, 
    selectedIncident, 
    setSelectedIncident, 
    setActiveView, 
    alerts, 
    forecastHotspots,
    digitalTwinLayers,
    smartTraffic,
    smartLighting,
    smartWaste,
    smartWater,
    environmentAqi,
    emergencyFleet,
    playSound, 
    t 
  } = useCivic();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  const [mapStyle, setMapStyle] = useState<MapTileStyle>('osm');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Chennai Default (Velachery / Guindy / Mount Road)');
  const [showLayerDrawer, setShowLayerDrawer] = useState(false);
  const [selectedClusterIncident, setSelectedClusterIncident] = useState<Incident | null>(null);
  const [telemetryIndex, setTelemetryIndex] = useState(0);

  // Ticker rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryIndex((prev) => (prev + 1) % TELEMETRY_STREAM.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Locate User via Browser Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    playSound('radar');
    setLocationStatus('Acquiring GPS fix...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
        setLocationStatus(`Live Location Locked (±${Math.round(accuracy)}m)`);
        playSound('success');

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 1.5 });

          if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const userIcon = L.divIcon({
              className: 'custom-user-gps-icon',
              html: `
                <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 14px; height: 14px; border-radius: 50%; background: #1d4ed8; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
                </div>
              `,
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            });
            userLocationMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup('<strong>You are here</strong><br/><span style="font-size:11px;">Live Citizen Location</span>');
          }
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus('GPS Unavailable (Using Chennai Sector Default)');
        playSound('beep');
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.9815, 80.2180], // Velachery, Chennai
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      const provider = TILE_PROVIDERS[mapStyle];
      const tileLayer = L.tileLayer(provider.url, {
        maxZoom: provider.maxZoom,
        subdomains: provider.subdomains || 'abc',
        crossOrigin: true
      }).addTo(map);

      currentTileLayerRef.current = tileLayer;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Tile Provider
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const provider = TILE_PROVIDERS[mapStyle];
    const newTileLayer = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains || 'abc',
      crossOrigin: true
    }).addTo(map);

    currentTileLayerRef.current = newTileLayer;
    map.invalidateSize();
  }, [mapStyle]);

  // Render Overlay Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) return;
      if (userLocationMarkerRef.current && layer === userLocationMarkerRef.current) return;
      map.removeLayer(layer);
    });

    // 1. Render Chennai Velachery Flood Risk Basin Zone
    if (digitalTwinLayers.floodZones) {
      const floodCoords: [number, number][] = [
        [12.9900, 80.2050],
        [12.9950, 80.2280],
        [12.9700, 80.2320],
        [12.9650, 80.2100]
      ];
      L.polygon(floodCoords, {
        color: '#0284c7',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#38bdf8',
        fillOpacity: 0.18,
      }).addTo(map).bindTooltip('Velachery Drainage Basin (Flood Zone 13)', {
        permanent: false,
        direction: 'center',
        className: 'font-semibold text-xs bg-white text-slate-800 border border-slate-300 p-1 rounded shadow-sm'
      });
    }

    // 2. Render Geo-fenced Emergency Alerts
    if (alerts.length > 0) {
      alerts.forEach(alert => {
        L.circle([alert.centerCoordinates.lat, alert.centerCoordinates.lng], {
          radius: alert.areaRadiusMeters,
          color: '#dc2626',
          weight: 2,
          dashArray: '4, 4',
          fillColor: '#f87171',
          fillOpacity: 0.2,
        }).addTo(map).bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 4px;">
            <div style="color: #dc2626; font-weight: bold; font-size: 11px; margin-bottom: 2px;">⚠ EMERGENCY GEOFENCE</div>
            <div style="color: #0f172a; font-weight: bold; font-size: 13px;">${alert.title}</div>
            <div style="color: #475569; font-size: 11px; margin-top: 4px;">Affecting approx. ${alert.affectedCitizensEstimate} residents</div>
          </div>
        `);
      });
    }

    // 3. Render Sensitive Infrastructure (Schools & Hospitals)
    if (digitalTwinLayers.schools) {
      SENSITIVE_INFRASTRUCTURE.filter(i => i.type === 'SCHOOL').forEach(infra => {
        const schoolIcon = L.divIcon({
          className: 'custom-school-icon',
          html: `<div style="background: #d97706; color: #fff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; font-weight: bold; font-size: 13px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">🏫</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });
        L.marker([infra.lat, infra.lng], { icon: schoolIcon }).addTo(map)
          .bindPopup(`<strong style="color:#d97706;">${infra.name}</strong><br/><span style="font-size:11px; color:#475569;">Sensitive School Buffer (200m)</span>`);

        L.circle([infra.lat, infra.lng], {
          radius: infra.radius,
          color: '#d97706',
          weight: 1.5,
          dashArray: '3, 5',
          fillColor: '#fbbf24',
          fillOpacity: 0.1
        }).addTo(map);
      });
    }

    if (digitalTwinLayers.hospitals) {
      SENSITIVE_INFRASTRUCTURE.filter(i => i.type === 'HOSPITAL').forEach(infra => {
        const hospIcon = L.divIcon({
          className: 'custom-hosp-icon',
          html: `<div style="background: #2563eb; color: #fff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; font-weight: bold; font-size: 13px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">🏥</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });
        L.marker([infra.lat, infra.lng], { icon: hospIcon }).addTo(map)
          .bindPopup(`<strong style="color:#1d4ed8;">${infra.name}</strong><br/><span style="font-size:11px; color:#475569;">Emergency Trauma Corridor Buffer (300m)</span>`);

        L.circle([infra.lat, infra.lng], {
          radius: infra.radius,
          color: '#2563eb',
          weight: 1.5,
          dashArray: '3, 5',
          fillColor: '#60a5fa',
          fillOpacity: 0.1
        }).addTo(map);
      });
    }

    // 4. SMART TRAFFIC LAYER (Mount Road & Velachery Arterial)
    if (digitalTwinLayers.traffic) {
      const trafficLineCoords: [number, number][] = [
        [12.9880, 80.2120],
        [12.9815, 80.2180],
        [12.9750, 80.2240]
      ];
      L.polyline(trafficLineCoords, {
        color: '#ea580c',
        weight: 6,
        opacity: 0.8
      }).addTo(map).bindTooltip(`🚦 Traffic Density: ${smartTraffic.densityPct}% (${smartTraffic.averageSpeedKmh} km/h - CONGESTED)`, {
        sticky: true,
        className: 'font-semibold text-xs bg-slate-900 text-white p-1 rounded'
      });
    }

    // 5. Render Incidents with 50-Meter Geofence & Parent-Child Deduplication Lines
    if (digitalTwinLayers.incidents) {
      incidents.forEach(inc => {
        if (inc.severity === 'CRITICAL' && !digitalTwinLayers.criticalIncidents) return;
        if (inc.severity === 'HIGH' && !digitalTwinLayers.highPriority) return;

        const isResolved = inc.status === 'RESOLVED';
        const isCritical = inc.severity === 'CRITICAL';
        const isSelected = selectedIncident?.id === inc.id || selectedClusterIncident?.id === inc.id;

        const color = isResolved ? '#10B981' : isCritical ? '#EF4444' : '#38BDF8';

        // 50m Deduplication Radius Ring with Pulsing Buffer
        if (digitalTwinLayers.dedupRadius50m && inc.isPrimaryMaster) {
          L.circle([inc.coordinates.lat, inc.coordinates.lng], {
            radius: 50,
            color: '#EF4444',
            weight: 2,
            dashArray: '4, 4',
            fillColor: '#EF4444',
            fillOpacity: 0.14
          }).addTo(map).bindTooltip(`50m PostGIS Geofence Buffer (3 Duplicates Clustered)`, {
            direction: 'top',
            className: 'text-[11px] bg-slate-950 text-red-300 border border-red-500/40 font-mono font-bold p-1 rounded'
          });

          // Draw Parent-Child Connection Lines to child duplicate reports
          if (inc.duplicates && inc.duplicates.length > 0) {
            inc.duplicates.forEach(dup => {
              // Line to duplicate
              L.polyline([[inc.coordinates.lat, inc.coordinates.lng], [dup.lat, dup.lng]], {
                color: '#EF4444',
                weight: 1.5,
                dashArray: '3, 5',
                opacity: 0.8
              }).addTo(map);

              // Small child duplicate node pin
              const childMarkerHtml = `
                <div style="background: #0D111A; border: 2px solid #EF4444; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);"></div>
              `;
              L.marker([dup.lat, dup.lng], {
                icon: L.divIcon({
                  className: 'custom-child-dup-pin',
                  html: childMarkerHtml,
                  iconSize: [14, 14],
                  iconAnchor: [7, 7]
                })
              }).addTo(map).bindTooltip(`Duplicate #${dup.id} (${dup.distanceFromPrimaryMeters}m from Master)`, {
                direction: 'bottom',
                className: 'text-[10px] font-mono bg-slate-900 text-white p-1 rounded'
              });
            });
          }
        }

        // Incident Pin Icon
        const markerHtml = `
          <div style="
            background: ${color}; 
            color: #ffffff; 
            width: ${isSelected ? '32px' : '26px'}; 
            height: ${isSelected ? '32px' : '26px'}; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            border: 2px solid #ffffff; 
            font-weight: bold; 
            font-size: 11px; 
            box-shadow: 0 0 12px ${color}80;
            transition: all 0.2s ease;
          ">
            ${isResolved ? '✓' : '!'}
          </div>
        `;

        const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], {
          icon: L.divIcon({
            className: 'custom-incident-pin',
            html: markerHtml,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          })
        }).addTo(map);

        marker.on('click', () => {
          setSelectedIncident(inc);
          setSelectedClusterIncident(inc);
          playSound('beep');
        });
      });
    }

  }, [incidents, selectedIncident, alerts, digitalTwinLayers, forecastHotspots, smartTraffic, smartLighting, smartWaste, smartWater, environmentAqi, emergencyFleet, mapStyle]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Map Header */}
      <div className="rounded-2xl p-4 sm:p-5 bg-[#0D111A] border border-cyan-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded">
                ● 50M POSTGIS DEDUP ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">{locationStatus}</span>
            </div>
            <h1 className="text-lg font-bold text-white font-sans mt-0.5">
              Tactical Command Map // Military Spatial GIS HUD
            </h1>
          </div>
        </div>

        {/* Tile Style & Layer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Base Tile Selector */}
          <div className="flex items-center space-x-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => { setMapStyle('dark'); playSound('beep'); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                mapStyle === 'dark' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark Tactical
            </button>
            <button
              onClick={() => { setMapStyle('osm'); playSound('beep'); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                mapStyle === 'osm' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Street (OSM)
            </button>
            <button
              onClick={() => { setMapStyle('satellite'); playSound('beep'); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                mapStyle === 'satellite' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
          </div>

          <button
            onClick={() => setShowLayerDrawer(!showLayerDrawer)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showLayerDrawer ? 'Hide Layers' : 'GIS Layers'}</span>
          </button>

          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-sm disabled:opacity-50"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{isLocating ? 'Acquiring GPS...' : t('useMyLocationMapBtn')}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Layer Control Panel */}
      {showLayerDrawer && (
        <DigitalTwinLayerPanel />
      )}

      {/* Main Tactical Map Canvas Container with Sliding Drawer & Telemetry Bar */}
      <div className="rounded-2xl overflow-hidden bg-[#0D111A] border border-cyan-500/20 shadow-2xl relative">
        <div 
          ref={mapContainerRef} 
          className="w-full h-[580px] z-0"
        />

        {/* Sliding Incident Cluster Detail Drawer */}
        {selectedClusterIncident && (
          <div className="absolute top-4 right-4 z-20 w-80 sm:w-96 max-h-[520px] overflow-y-auto bg-[#07090E]/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-5 text-white shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  #{selectedClusterIncident.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedClusterIncident.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                }`}>
                  {selectedClusterIncident.severity} — 3 REPORTS CLUSTERED
                </span>
              </div>

              <button
                onClick={() => setSelectedClusterIncident(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="font-bold text-sm text-white">{selectedClusterIncident.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedClusterIncident.locationName}</p>
            </div>

            {/* Deduplication Summary Box */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span>Spatial Deduplication Result:</span>
                <span className="font-mono text-[10px] bg-emerald-900/60 px-1.5 py-0.5 rounded">40% GAIN</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                2 redundant inspection dispatches suppressed. Merged 3 duplicate citizen photos into 1 master work order within 50m buffer.
              </p>
            </div>

            {/* Raw PostGIS Query Logic Box */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center space-x-1">
                  <Terminal className="w-3 h-3" />
                  <span>PostGIS ST_DWithin Logic:</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  ⚡ 11.4ms Latency
                </span>
              </div>

              <pre className="font-mono text-[10px] text-slate-300 bg-black p-2.5 rounded-lg overflow-x-auto leading-relaxed select-all">
{`SELECT master_id, COUNT(*) 
FROM incident_reports 
WHERE ST_DWithin(
  geom, 
  ST_MakePoint(${selectedClusterIncident.coordinates.lng}, ${selectedClusterIncident.coordinates.lat}), 
  50.0
) 
AND category = '${selectedClusterIncident.category}' 
AND status != 'RESOLVED';`}
              </pre>
            </div>

            {/* Clustered Child Reports */}
            {selectedClusterIncident.duplicates && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Consolidated Duplicate Citations:</span>
                {selectedClusterIncident.duplicates.map((dup, i) => (
                  <div key={i} className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-cyan-300">#{dup.id}</span>
                      <span className="text-slate-400 text-[11px] ml-2">{dup.citizenName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-semibold">{dup.distanceFromPrimaryMeters}m away</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setSelectedIncident(selectedClusterIncident);
                setActiveView('case_tracking');
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition flex items-center justify-center space-x-1.5 shadow"
            >
              <span>Track Complete Remediation Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Live Command Telemetry Streaming Ticker */}
        <div className="p-2.5 bg-[#07090E] border-t border-cyan-500/30 flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-bold shrink-0">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span className="text-[11px] tracking-wider uppercase">LIVE COMMAND STREAM:</span>
          </div>

          <div className="text-slate-300 truncate text-[11px]">
            {TELEMETRY_STREAM[telemetryIndex]}
          </div>
        </div>
      </div>
    </div>
  );
};
