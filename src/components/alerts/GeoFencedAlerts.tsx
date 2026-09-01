import React, { useState } from 'react';
import { 
  Radio, 
  AlertTriangle, 
  Send, 
  Users, 
  MapPin, 
  Sliders, 
  CheckCircle2, 
  Volume2,
  Layers,
  Building
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const GeoFencedAlerts: React.FC = () => {
  const { alerts, createEmergencyAlert, playSound, setActiveView } = useCivic();

  const [alertTitle, setAlertTitle] = useState('CRITICAL INUNDATION & VELACHERY BYPASS CLOSURE');
  const [alertMessage, setAlertMessage] = useState('Severe flash flooding detected near DAV School & Velachery 100 Feet Bypass Road. Route blocked toward OMR. Avoid the low-lying underpasses. Heavy GCC de-watering pumps deployed.');
  const [radiusMeters, setRadiusMeters] = useState(650);
  const [severity, setSeverity] = useState<'EXTREME' | 'HIGH' | 'ADVISORY'>('HIGH');
  const [zoneName, setZoneName] = useState('Velachery Zone 13 & School Corridor Buffer');
  const [channels, setChannels] = useState({
    sms: true,
    push: true,
    signage: true,
    siren: false
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const areaM2 = Math.PI * Math.pow(radiusMeters, 2);
  const calculatedAffectedCitizens = Math.round((areaM2 / 1000) * 2.15);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    playSound('alert');

    setTimeout(() => {
      const selectedChannels: ('SMS_CELL_BROADCAST' | 'MOBILE_APP_PUSH' | 'DIGITAL_SIGNAGE' | 'SIREN_NETWORK')[] = [];
      if (channels.sms) selectedChannels.push('SMS_CELL_BROADCAST');
      if (channels.push) selectedChannels.push('MOBILE_APP_PUSH');
      if (channels.signage) selectedChannels.push('DIGITAL_SIGNAGE');
      if (channels.siren) selectedChannels.push('SIREN_NETWORK');

      createEmergencyAlert({
        title: alertTitle,
        message: alertMessage,
        severity,
        affectedCitizensEstimate: calculatedAffectedCitizens,
        areaRadiusMeters: radiusMeters,
        centerCoordinates: { lat: 12.9815, lng: 80.2180 },
        zoneName,
        channels: selectedChannels,
        activeUntil: new Date(Date.now() + 4 * 3600 * 1000).toISOString()
      });

      setIsBroadcasting(false);
      playSound('success');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-900 text-xs font-semibold mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>DISASTER MANAGEMENT CELL • CHENNAI EMERGENCY BROADCAST</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            Geo-Fenced Emergency Broadcast Dispatcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Define polygon / radius hazard perimeter and broadcast critical advisories directly to mobile subscribers inside the danger buffer.
          </p>
        </div>

        <button
          onClick={() => setActiveView('command_map')}
          className="px-4 py-2 rounded bg-[#0f2a4a] hover:bg-[#1a3860] text-white text-xs font-semibold transition flex items-center space-x-2 shadow-sm"
        >
          <MapPin className="w-4 h-4" />
          <span>View Geofences on Map</span>
        </button>
      </div>

      {/* Main Broadcast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Configuration Form */}
        <form onSubmit={handleBroadcast} className="lg:col-span-7 space-y-4">
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              1. Broadcast Alert Parameters
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alert Headline <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                required
                className="w-full rounded border border-slate-300 focus:border-blue-600 p-2.5 text-xs text-slate-900 font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Advisory Content <span className="text-red-600">*</span>
              </label>
              <textarea
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                rows={3}
                required
                className="w-full rounded border border-slate-300 focus:border-blue-600 p-2.5 text-xs text-slate-900 outline-none"
              />
            </div>

            {/* Radius Slider */}
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span className="flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-800" />
                  <span>Geo-Fence Hazard Perimeter Radius:</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-white text-slate-900 font-mono text-xs font-bold border border-slate-200">
                  {radiusMeters} Meters
                </span>
              </div>

              <input
                type="range"
                min="150"
                max="2500"
                step="50"
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(Number(e.target.value))}
                className="w-full accent-blue-900 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>150m (Point hazard)</span>
                <span>2,500m (Ward zone)</span>
              </div>
            </div>

            {/* Target Channels */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                2. Multi-Channel Transmission Vectors:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <label className="flex items-center space-x-2 p-2.5 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={channels.sms}
                    onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                    className="accent-blue-900"
                  />
                  <span className="text-slate-800 text-xs">SMS Cell Broadcast (3GPP)</span>
                </label>

                <label className="flex items-center space-x-2 p-2.5 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={channels.push}
                    onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                    className="accent-blue-900"
                  />
                  <span className="text-slate-800 text-xs">Citizen Mobile App Push</span>
                </label>

                <label className="flex items-center space-x-2 p-2.5 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={channels.signage}
                    onChange={(e) => setChannels({ ...channels, signage: e.target.checked })}
                    className="accent-blue-900"
                  />
                  <span className="text-slate-800 text-xs">Municipal VMS Digital Signs</span>
                </label>

                <label className="flex items-center space-x-2 p-2.5 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={channels.siren}
                    onChange={(e) => setChannels({ ...channels, siren: e.target.checked })}
                    className="accent-blue-900"
                  />
                  <span className="text-slate-800 text-xs">Acoustic Siren Grid</span>
                </label>
              </div>
            </div>

            {/* Broadcast Action Button */}
            <button
              type="submit"
              disabled={isBroadcasting}
              className="w-full py-3 rounded bg-red-700 hover:bg-red-800 text-white font-bold text-xs tracking-wide transition flex items-center justify-center space-x-2 disabled:opacity-50 shadow-sm"
            >
              {isBroadcasting ? (
                <>
                  <Radio className="w-4 h-4 animate-spin" />
                  <span>TRANSMITTING EMERGENCY BROADCAST TO CELL SECTORS...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>DISPATCH EMERGENCY BROADCAST ({calculatedAffectedCitizens.toLocaleString()} CITIZENS)</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Column (5 cols): Population Estimate & Active Feeds */}
        <div className="lg:col-span-5 space-y-4">
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Geospatial Population Estimate
              </span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>

            <div className="p-3.5 rounded bg-red-50 border border-red-200 space-y-1">
              <div className="text-2xl font-bold text-red-800 font-mono">
                {calculatedAffectedCitizens.toLocaleString()}
              </div>
              <div className="text-xs text-red-900 font-semibold">
                Estimated residents within {radiusMeters}m radius
              </div>
              <div className="text-[11px] text-slate-600 pt-1.5 border-t border-red-200">
                Cell Tower Sector: CHENNAI-ZONE-13 (3 Towers Triangulated)
              </div>
            </div>
          </div>

          {/* Active Broadcasts */}
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Active Broadcast Advisories ({alerts.length})
              </span>
              <span className="text-[10px] font-bold text-green-800 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                ● ACTIVE
              </span>
            </div>

            <div className="space-y-2.5">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-red-700 font-bold">{al.id}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-100 text-red-800 border border-red-200 font-bold">
                      {al.status}
                    </span>
                  </div>
                  <div className="text-slate-900 font-bold text-xs">{al.title}</div>
                  <p className="text-[11px] text-slate-600">{al.message}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-mono">
                    <span>Perimeter: {al.areaRadiusMeters}m</span>
                    <span className="text-slate-800 font-bold">~{al.affectedCitizensEstimate} affected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
