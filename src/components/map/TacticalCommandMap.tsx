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
  Building
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { SENSITIVE_INFRASTRUCTURE } from '../../data/mockData';
import L from 'leaflet';

export const TacticalCommandMap: React.FC = () => {
  const { incidents, selectedIncident, setSelectedIncident, setActiveView, alerts, playSound, t } = useCivic();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Chennai Default (Velachery)');

  // Toggleable Layer States
  const [layers, setLayers] = useState({
    critical: true,
    high: true,
    resolved: true,
    schools: true,
    hospitals: true,
    floodZones: true,
    dedupRings: true,
    geofenceAlerts: true,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
    playSound('beep');
  };

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

            const marker = L.marker([latitude, longitude], { icon: userIcon }).addTo(mapInstanceRef.current);
            marker.bindPopup(`
              <div style="font-family: 'Inter', sans-serif; font-size: 12px; font-weight: bold; color: #0f2a4a;">
                📍 CITIZEN LIVE GPS FIX
                <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-top: 2px;">
                  ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E
                </div>
              </div>
            `).openPopup();
            userLocationMarkerRef.current = marker;
          }
        }
      },
      (error) => {
        setIsLocating(false);
        setLocationStatus('GPS fallback: Chennai Center');
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([12.9815, 80.2180], 14);
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to Chennai (Velachery / Central Sector)
      const map = L.map(mapContainerRef.current, {
        center: [12.9815, 80.2180],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // Clean OpenStreetMap / Positron Cartography
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing overlay layers (keep tile layer and user pin)
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) return;
      if (userLocationMarkerRef.current && layer === userLocationMarkerRef.current) return;
      map.removeLayer(layer);
    });

    // 1. Render Chennai Velachery Flood Risk Basin Zone
    if (layers.floodZones) {
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
    if (layers.geofenceAlerts && alerts.length > 0) {
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
    if (layers.schools) {
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

    if (layers.hospitals) {
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

    // 4. Render Incidents & 50m Deduplication Rings
    incidents.forEach(inc => {
      if (inc.severity === 'CRITICAL' && !layers.critical) return;
      if (inc.severity === 'HIGH' && !layers.high) return;
      if (inc.status === 'RESOLVED' && !layers.resolved) return;

      const isResolved = inc.status === 'RESOLVED';
      const isCritical = inc.severity === 'CRITICAL';
      const isSelected = selectedIncident?.id === inc.id;

      const color = isResolved ? '#15803d' : isCritical ? '#dc2626' : '#0284c7';

      // 50m Deduplication Radius Ring
      if (layers.dedupRings && inc.isPrimaryMaster) {
        L.circle([inc.coordinates.lat, inc.coordinates.lng], {
          radius: 50,
          color: '#475569',
          weight: 1.5,
          dashArray: '4, 4',
          fillColor: '#94a3b8',
          fillOpacity: 0.15
        }).addTo(map).bindTooltip(`50m PostGIS Dedup Buffer (${inc.duplicates.length} merged)`, {
          direction: 'top',
          className: 'text-[11px] bg-white text-slate-800 border border-slate-300 font-semibold p-1 rounded'
        });
      }

      // Incident Pin Icon
      const markerHtml = `
        <div style="
          background: ${color}; 
          color: #ffffff; 
          width: ${isSelected ? '30px' : '24px'}; 
          height: ${isSelected ? '30px' : '24px'}; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border: 2px solid #ffffff; 
          font-weight: bold; 
          font-size: 11px; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        ">
          ${isResolved ? '✓' : '!'}
        </div>
      `;

      const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], {
        icon: L.divIcon({
          className: 'custom-incident-pin',
          html: markerHtml,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        })
      }).addTo(map);

      marker.on('click', () => {
        setSelectedIncident(inc);
        playSound('beep');
      });

      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; min-width: 220px; padding: 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="color:${color}; font-weight:bold; font-family:monospace; font-size:12px;">#${inc.id}</span>
            <span style="font-size:10px; font-weight:bold; background:#f1f5f9; padding:2px 6px; border-radius:4px; color:#1e293b;">
              ${inc.severity}
            </span>
          </div>
          <div style="color:#0f172a; font-weight:bold; font-size:13px; margin-bottom:4px;">${inc.title}</div>
          <div style="color:#64748b; font-size:11px; margin-bottom:8px;">${inc.locationName}</div>
          <div style="font-family:monospace; font-size:11px; color:#0369a1; margin-bottom:6px;">
            SLA: ${Math.floor(inc.sla.remainingSeconds / 3600)}h ${Math.floor((inc.sla.remainingSeconds % 3600) / 60)}m | Risk: ${inc.risk.totalScore}/100
          </div>
          <div style="border-top:1px solid #e2e8f0; padding-top:6px; font-size:11px; color:#15803d; font-weight:600;">
            ${inc.duplicates.length} duplicate complaints merged (50m radius)
          </div>
        </div>
      `);
    });

  }, [incidents, layers, selectedIncident, alerts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      {/* Top Map Header */}
      <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-blue-50 text-blue-900 border border-blue-200">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded">
                {t('mapBadge')}
              </span>
              <span className="text-xs text-slate-500 font-mono">{locationStatus}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 font-sans mt-0.5">
              {t('mapHeading')}
            </h1>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold transition shadow-sm disabled:opacity-50"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{isLocating ? 'Acquiring GPS...' : t('useMyLocationMapBtn')}</span>
          </button>

          <button
            onClick={() => setActiveView('disaster_alerts')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-semibold transition"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{t('issueGeoAlertBtn')}</span>
          </button>

          <button
            onClick={() => setActiveView('command_center')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition border border-slate-300"
          >
            <span>GCC Kanban</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Layer Filter Toolbar */}
      <div className="gov-card rounded-lg p-2.5 bg-white border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto text-xs">
        <span className="text-slate-700 font-bold flex items-center space-x-1 pl-1 pr-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-blue-800" />
          <span>GIS LAYERS:</span>
        </span>

        <button
          onClick={() => toggleLayer('critical')}
          className={`px-2.5 py-1 rounded border transition shrink-0 font-medium ${
            layers.critical ? 'bg-red-100 text-red-800 border-red-300' : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          🔴 Critical Hazards (T. Nagar)
        </button>

        <button
          onClick={() => toggleLayer('high')}
          className={`px-2.5 py-1 rounded border transition shrink-0 font-medium ${
            layers.high ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          🔵 High Priority (Velachery)
        </button>

        <button
          onClick={() => toggleLayer('schools')}
          className={`px-2.5 py-1 rounded border transition shrink-0 font-medium ${
            layers.schools ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          🏫 Schools Buffer (200m)
        </button>

        <button
          onClick={() => toggleLayer('hospitals')}
          className={`px-2.5 py-1 rounded border transition shrink-0 font-medium ${
            layers.hospitals ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          🏥 Hospitals Corridor (300m)
        </button>

        <button
          onClick={() => toggleLayer('floodZones')}
          className={`px-2.5 py-1 rounded border transition shrink-0 font-medium ${
            layers.floodZones ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          🌊 Flood Drainage Basin
        </button>

        <button
          onClick={() => toggleLayer('dedupRings')}
          className={`px-2.5 py-1 rounded border transition shrink-0 font-medium ${
            layers.dedupRings ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          🎯 50m Dedup Rings
        </button>
      </div>

      {/* Main Map Viewport */}
      <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-slate-100 shadow-sm h-[540px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Selected Incident Floating Detail Card */}
        {selectedIncident && (
          <div className="absolute top-4 left-4 z-[1000] w-80 sm:w-96 bg-white rounded-lg p-4 border border-slate-300 shadow-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-blue-900 font-bold">#{selectedIncident.id}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  selectedIncident.severity === 'CRITICAL' 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {selectedIncident.severity}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-700">
                Risk Score: {selectedIncident.risk.totalScore}/100
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">{selectedIncident.title}</h3>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{selectedIncident.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-200">
              <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[9px]">SLA REMAINING</span>
                <span className="text-amber-800 font-bold">
                  {Math.floor(selectedIncident.sla.remainingSeconds / 3600)}h {Math.floor((selectedIncident.sla.remainingSeconds % 3600) / 60)}m
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[9px]">50M DEDUP</span>
                <span className="text-purple-800 font-bold">
                  {selectedIncident.duplicates.length} Duplicates Merged
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => setActiveView('ai_triage')}
                className="flex-1 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold transition text-center"
              >
                Inspect AI Triage
              </button>
              <button
                onClick={() => setActiveView('case_tracking')}
                className="flex-1 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold transition text-center"
              >
                Track Case
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
