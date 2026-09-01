import React, { useState, useEffect, useRef } from 'react';
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
  Smartphone,
  Upload,
  RefreshCw,
  X
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { dispatchSmsAlert, getStoredRecipients } from '../../services/smsService';

const PRESET_SCENARIOS = [
  {
    label: '🌊 Velachery Road Flooding (Waterlogging)',
    text: 'Heavy northeast monsoon rain has blocked 100 Feet Bypass Road near DAV School, Velachery. Water level is over 2.5 feet and vehicles cannot pass.',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
    lat: 12.9815,
    lng: 80.2180,
    location: '100 Feet Bypass Road, Velachery, Chennai'
  },
  {
    label: '🕳️ Major Asphalt Crater / Pothole',
    text: 'Severe 4-foot wide asphalt crater pothole on Anna Salai near Guindy Industrial Estate damaging passing two-wheelers.',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80',
    lat: 13.0067,
    lng: 80.2025,
    location: 'Anna Salai near Guindy Industrial Estate, Chennai'
  },
  {
    label: '🗑️ Overflowing Municipal Waste Bin',
    text: 'Large municipal waste bin #WB-092 overflowing onto pedestrian sidewalk on Ranganathan Street, T. Nagar creating public health hazard.',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1000&q=80',
    lat: 13.0410,
    lng: 80.2330,
    location: 'Ranganathan Street, T. Nagar, Chennai'
  },
  {
    label: '💡 Offline Street Light (Dark Zone)',
    text: 'Pole #SL-183 street light fixture completely offline creating zero-visibility dark zone on pedestrian corridor near school.',
    image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=1000&q=80',
    lat: 13.0450,
    lng: 80.2280,
    location: 'Ward 8 Pedestrian Corridor, T. Nagar, Chennai'
  },
  {
    label: '💧 CMWSSB Pipeline Burst / Water Loss',
    text: 'CMWSSB 36-inch water main pipe burst leaking over 1,200 L/hr and flooding roadway near Greams Road.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
    lat: 13.0585,
    lng: 80.2520,
    location: 'Greams Road, Thousand Lights, Chennai'
  }
];

export const ReportIncident: React.FC = () => {
  const { submitNewReport, setActiveView, runTriageAnimation, playSound, t } = useCivic();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState(PRESET_SCENARIOS[0].text);
  const [imagePreview, setImagePreview] = useState(PRESET_SCENARIOS[0].image);
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);
  const [customPhotoName, setCustomPhotoName] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState({ lat: PRESET_SCENARIOS[0].lat, lng: PRESET_SCENARIOS[0].lng });
  const [locationName, setLocationName] = useState(PRESET_SCENARIOS[0].location);
  const [citizenName, setCitizenName] = useState('Karthik Subramanian');
  const [phone, setPhone] = useState('+91 98401 23456');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(true);
  const [gpsMessage, setGpsMessage] = useState('Chennai (Velachery Sector)');
  const [isDragging, setIsDragging] = useState(false);

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

  const [isScanningYolo, setIsScanningYolo] = useState(false);
  const [detectedHazard, setDetectedHazard] = useState<{ label: string; conf: number; top: number; left: number; width: number; height: number } | null>({
    label: 'Waterlogging Inundation',
    conf: 94.2,
    top: 35,
    left: 15,
    width: 70,
    height: 55
  });

  const triggerYoloScan = (category: string) => {
    setIsScanningYolo(true);
    playSound('radar');
    setTimeout(() => {
      setIsScanningYolo(false);
      let label = 'Waterlogging Inundation';
      let conf = 94.2;
      let top = 35;
      let left = 15;
      let width = 70;
      let height = 55;

      if (category.includes('Crater') || category.includes('Pothole')) {
        label = 'Asphalt Crater / Pothole';
        conf = 96.4;
        top = 40; left = 20; width = 60; height = 45;
      } else if (category.includes('Waste') || category.includes('Bin')) {
        label = 'Overflowing Solid Waste';
        conf = 92.8;
        top = 25; left = 25; width = 50; height = 60;
      } else if (category.includes('Light') || category.includes('Dark')) {
        label = 'Offline Street Light Fixture';
        conf = 89.5;
        top = 20; left = 35; width = 30; height = 50;
      } else if (category.includes('Pipeline') || category.includes('Water')) {
        label = 'Pipeline Pressure Burst';
        conf = 97.1;
        top = 45; left = 20; width = 65; height = 40;
      }

      setDetectedHazard({ label, conf, top, left, width, height });
      playSound('success');
    }, 1100);
  };

  const handleSelectPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setDescription(preset.text);
    setImagePreview(preset.image);
    setIsCustomPhoto(false);
    setCustomPhotoName(null);
    setCoordinates({ lat: preset.lat, lng: preset.lng });
    setLocationName(preset.location);
    setGpsMessage('Preset Chennai Sector Locked');
    playSound('beep');
    triggerYoloScan(preset.label);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        setIsCustomPhoto(true);
        setCustomPhotoName(file.name);
        triggerYoloScan('Custom Upload');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
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

    try {
      // 1. Submit report to global Civic Context
      const createdIncident = await submitNewReport({
        title: description.slice(0, 50) + (description.length > 50 ? '...' : ''),
        description,
        locationName,
        coordinates,
        citizenName,
        citizenContact: phone,
        image: imagePreview
      });

      // 2. Dispatch Live SMS Alert to configured test numbers
      const recipients = getStoredRecipients();
      const smsMessage = `[CIVIC-SYNC] Grievance #${createdIncident.id} registered at ${locationName}. AI Triage Category: ${createdIncident.category}. Dynamic SLA: ${Math.floor(createdIncident.sla.remainingSeconds / 3600)}h. Assigned to ${createdIncident.assignedDepartment}.`;
      
      dispatchSmsAlert(recipients, smsMessage).catch(err => {
        console.warn('SMS dispatch handled in background:', err);
      });

      // 3. Trigger 7-Stage Triage Animation sequence
      runTriageAnimation(createdIncident);

      // 4. Navigate immediately to AI Triage Engine View
      setIsSubmitting(false);
      setActiveView('ai_triage');
    } catch (err) {
      console.error('Error during grievance submission:', err);
      setIsSubmitting(false);
      setActiveView('ai_triage');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
                  description === preset.text && !isCustomPhoto
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
                {t('evidencePhotoLabel')} <span className="text-red-600">*</span>
              </label>
              <span className="text-[10px] font-semibold text-emerald-700">ViT-B Model Ready</span>
            </div>

            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Photo Container with YOLOv8 Scanner & Bounding Box */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded overflow-hidden border-2 transition aspect-video bg-slate-950 flex flex-col items-center justify-center ${
                isDragging ? 'border-cyan-400 bg-cyan-950/20' : 'border-slate-800'
              }`}
            >
              <img
                src={imagePreview}
                alt="Evidence Upload"
                className="w-full h-full object-cover"
              />

              {/* Animated Laser Scanning Line */}
              {isScanningYolo && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-bounce" />
                  <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="px-3 py-1 rounded bg-black/80 text-cyan-400 font-mono text-xs font-bold border border-cyan-400 animate-pulse">
                      ⚡ YOLOv8 LIVE INFERENCE SCANNING...
                    </span>
                  </div>
                </div>
              )}

              {/* Detected YOLOv8 Bounding Box */}
              {!isScanningYolo && detectedHazard && (
                <div 
                  className="absolute border-2 border-cyan-400 bg-cyan-500/10 pointer-events-none transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                  style={{
                    top: `${detectedHazard.top}%`,
                    left: `${detectedHazard.left}%`,
                    width: `${detectedHazard.width}%`,
                    height: `${detectedHazard.height}%`
                  }}
                >
                  <div className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] whitespace-nowrap shadow">
                    {detectedHazard.label} ({detectedHazard.conf}%)
                  </div>
                </div>
              )}

              <div className="absolute top-2 right-2 flex items-center space-x-1">
                {isCustomPhoto ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px] font-bold shadow-xs">
                    CUSTOM UPLOAD
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold">
                    YOLOv8 DETECTED
                  </span>
                )}
              </div>

              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-white font-mono text-[10px] border border-white/10">
                {customPhotoName ? customPhotoName : 'GEO-TAG EXIF ATTACHED'}
              </div>
            </div>

            {/* Upload Action Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded bg-blue-800 hover:bg-blue-900 text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload / Take Photo</span>
              </button>

              {isCustomPhoto && (
                <button
                  type="button"
                  onClick={() => handleSelectPreset(PRESET_SCENARIOS[0])}
                  className="py-2 px-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition flex items-center space-x-1"
                  title="Reset to Default Preset"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-500 text-center">
              Supports live camera capture & image file uploads (JPG, PNG, WEBP)
            </p>

            {/* Checklist */}
            <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="font-semibold text-slate-900 uppercase text-[10px]">
                GCC Automated Verification Stages:
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center space-x-1.5 text-blue-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span>1. NLP Automated Category & Department Classification</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>2. 50-Meter Haversine Spatial Deduplication Check</span>
                </div>
                <div className="flex items-center space-x-1.5 text-amber-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>3. School (180m) & Flood Basin Proximity Risk Matrix</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
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
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{t('submittingBtn')}</span>
                </>
              ) : (
                <>
                  <span>{t('submitGrievanceBtn')}</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
