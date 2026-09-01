import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  Image as ImageIcon,
  Compass,
  Cpu,
  Layers,
  Navigation,
  FileText,
  Shield,
  Smartphone
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { dispatchSmsAlert, getStoredRecipients } from '../../services/smsService';

const PRESET_SCENARIOS = [
  {
    label: '🌊 Velachery Road Flooding (Demo)',
    text: 'Heavy northeast monsoon rain has blocked 100 Feet Bypass Road near DAV School, Velachery. Water level is over 2.5 feet and vehicles cannot pass.',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80',
    lat: 12.9815,
    lng: 80.2180,
    location: '100 Feet Bypass Road, Velachery, Chennai'
  },
  {
    label: '⚡ Live Conductor Wire at T. Nagar',
    text: '11kV overhead electrical wire snapped and dangling dangerously across pedestrian walkway at Ranganathan Street, T. Nagar with active sparks.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80',
    lat: 13.0410,
    lng: 80.2330,
    location: 'Ranganathan Street, T. Nagar, Chennai'
  },
  {
    label: '🌳 Fallen Tree at Greams Road (Apollo)',
    text: 'Huge banyan tree uprooted blocking both lanes on Greams Road toward Apollo Hospital emergency corridor.',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
    lat: 13.0585,
    lng: 80.2520,
    location: 'Greams Road, Thousand Lights, Chennai'
  },
  {
    label: '🕳️ Anna Salai Water Main Sinkhole',
    text: 'CMWSSB 36-inch water pipe burst creating deep crater sinkhole on Anna Salai near Guindy.',
    image: 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?auto=format&fit=crop&w=1000&q=80',
    lat: 13.0067,
    lng: 80.2025,
    location: 'Anna Salai near Guindy Industrial Estate, Chennai'
  }
];

export const ReportIncident: React.FC = () => {
  const { submitNewReport, setActiveView, runTriageAnimation, playSound, t } = useCivic();

  const [description, setDescription] = useState(PRESET_SCENARIOS[0].text);
  const [imagePreview, setImagePreview] = useState(PRESET_SCENARIOS[0].image);
  const [coordinates, setCoordinates] = useState({ lat: PRESET_SCENARIOS[0].lat, lng: PRESET_SCENARIOS[0].lng });
  const [locationName, setLocationName] = useState(PRESET_SCENARIOS[0].location);
  const [citizenName, setCitizenName] = useState('Karthik Subramanian');
  const [phone, setPhone] = useState('+91 98401 23456');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(true);
  const [gpsMessage, setGpsMessage] = useState('Chennai (Velachery Sector)');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoordinates({ lat, lng });
          setLocationName(`Your Live Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`);
          setGpsMessage(`Live GPS Locked (±${Math.round(pos.coords.accuracy)}m)`);
        },
        () => {
          setGpsMessage('Chennai Sector Locked (Velachery)');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  const handleSelectPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setDescription(preset.text);
    setImagePreview(preset.image);
    setCoordinates({ lat: preset.lat, lng: preset.lng });
    setLocationName(preset.location);
    setGpsMessage('Preset Chennai Sector Locked');
    playSound('beep');
  };

  const handleUseCurrentLiveGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    setGpsLocked(false);
    playSound('radar');
    setGpsMessage('Acquiring satellite GPS fix...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordinates({ lat, lng });
        setLocationName(`Current User Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`);
        setGpsLocked(true);
        setGpsMessage(`Live GPS Fix Acquired (±${Math.round(pos.coords.accuracy)}m)`);
        playSound('success');
      },
      (err) => {
        setGpsLocked(true);
        setCoordinates({ lat: 12.9815, lng: 80.2180 });
        setLocationName('100 Feet Bypass Road, Velachery, Chennai');
        setGpsMessage('Fallback: Velachery, Chennai');
        playSound('beep');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    playSound('triage');

    const createdIncident = await submitNewReport(
      description,
      imagePreview,
      coordinates.lat,
      coordinates.lng,
      citizenName,
      phone
    );

    // Dispatch Grievance Registration SMS to citizen phone + configured friend's phone
    const configuredRecipients = getStoredRecipients();
    const smsTargets = [
      { id: 'citizen', name: citizenName, phone: phone, enabled: true },
      ...configuredRecipients.filter(r => r.enabled && r.phone.trim().length >= 10)
    ];

    dispatchSmsAlert(
      `GRIEVANCE REGISTERED (#${createdIncident.id})`,
      `Thank you ${citizenName}. Your report "${description.slice(0, 50)}..." at ${locationName} is queued for AI triage and GCC dispatch.`,
      smsTargets
    );

    setIsSubmitting(false);
    setActiveView('ai_triage');
    runTriageAnimation(createdIncident);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>{t('reportFormBadge')}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans">
            {t('reportFormHeading')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('reportFormDesc')}
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-[11px] font-semibold text-slate-600 uppercase mb-1">
            {t('officialScenarios')}
          </span>
          <div className="flex flex-wrap gap-1.5 max-w-md justify-start sm:justify-end">
            {PRESET_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1 text-xs rounded border transition font-medium ${
                  description === preset.text
                    ? 'bg-blue-900 text-white border-blue-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Form Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                {t('fieldDescriptionLabel')} <span className="text-red-600">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder={t('fieldDescriptionPlaceholder')}
                className="w-full rounded border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 p-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>NLP Automated Semantic Extraction Active</span>
                <span>{description.length} characters</span>
              </div>
            </div>

            {/* GPS Location Box */}
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-blue-700" />
                  <span>{t('fieldGpsLabel')} ({gpsMessage})</span>
                </div>
                <button
                  type="button"
                  onClick={handleUseCurrentLiveGps}
                  className="px-2.5 py-1 rounded text-[11px] bg-blue-800 hover:bg-blue-900 text-white font-semibold transition flex items-center space-x-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{t('useLiveGpsBtn')}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">LATITUDE</span>
                  <span className="text-slate-900 font-bold">{coordinates.lat.toFixed(6)}° N</span>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">LONGITUDE</span>
                  <span className="text-slate-900 font-bold">{coordinates.lng.toFixed(6)}° E</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <span className="truncate max-w-[280px]">Location: <strong className="text-slate-900">{locationName}</strong></span>
                <span className="text-green-700 font-semibold">● Geo-Correlated</span>
              </div>
            </div>

            {/* Citizen Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('citizenNameLabel')} <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  required
                  className="w-full rounded border border-slate-300 focus:border-blue-600 p-2 text-xs text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('mobileNumberLabel')} <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded border border-slate-300 focus:border-blue-600 p-2 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Photo & Submission */}
        <div className="lg:col-span-5 space-y-4">
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                {t('evidencePhotoLabel')}
              </label>
              <span className="text-[10px] font-semibold text-green-700">ViT-B Model Ready</span>
            </div>

            {/* Photo Container */}
            <div className="relative rounded overflow-hidden border border-slate-300 bg-slate-100 aspect-video">
              <img
                src={imagePreview}
                alt="Evidence Upload"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[10px]">
                GEO-TAG EXIF ATTACHED
              </div>
            </div>

            {/* Checklist */}
            <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="font-semibold text-slate-900 uppercase text-[10px]">
                GCC Automated Verification Stages:
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center space-x-1.5 text-blue-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>1. NLP Automated Category & Department Classification</span>
                </div>
                <div className="flex items-center space-x-1.5 text-green-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                  <span>2. 50-Meter Haversine Spatial Deduplication Check</span>
                </div>
                <div className="flex items-center space-x-1.5 text-amber-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>3. School (180m) & Flood Basin Proximity Risk Matrix</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
                  <span>4. Dynamic SLA & Rapid Response Squad Mobilization</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded bg-[#0f2a4a] hover:bg-[#1a3860] text-white font-bold text-xs tracking-wide transition flex items-center justify-center space-x-2 disabled:opacity-50 shadow"
            >
              {isSubmitting ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>{t('submittingBtn')}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('submitGrievanceBtn')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
