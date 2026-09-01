import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Sliders, 
  Layers, 
  Image as ImageIcon,
  Clock,
  UserCheck,
  Cpu,
  FileCheck,
  Award,
  Building,
  QrCode
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import confetti from 'canvas-confetti';

export const ResolutionVerifier: React.FC = () => {
  const { incidents, selectedIncident, setSelectedIncident, playSound, t } = useCivic();
  
  const [sliderPos, setSliderPos] = useState(50);
  const [mode, setMode] = useState<'slider' | 'side_by_side'>('slider');

  const resolvedIncident = selectedIncident.resolution 
    ? selectedIncident 
    : (incidents.find(i => i.resolution) || incidents[0]);

  const resolution = resolvedIncident.resolution!;

  const triggerVerificationSuccess = () => {
    playSound('success');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-green-50 border border-green-200 text-green-900 text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>{t('resolutionBadge')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            {t('resolutionHeading')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('resolutionDesc')}
          </p>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMode('slider')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
              mode === 'slider' 
                ? 'bg-[#0f2a4a] text-white font-semibold' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('splitSliderBtn')}
          </button>
          <button
            onClick={() => setMode('side_by_side')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${
              mode === 'side_by_side' 
                ? 'bg-[#0f2a4a] text-white font-semibold' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('sideBySideBtn')}
          </button>
        </div>
      </div>

      {/* Main Verification Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Visual Split Slider */}
        <div className="lg:col-span-7 space-y-4">
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Photographic Remediation Evidence
              </span>
              <span className="text-xs font-bold text-green-700 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AI CV Confidence: {resolution.cvConfidenceScore}%</span>
              </span>
            </div>

            {/* Slider Comparison View */}
            {mode === 'slider' ? (
              <div className="relative rounded overflow-hidden aspect-video border border-slate-300 select-none">
                {/* AFTER IMAGE (Base) */}
                <img
                  src={resolution.afterImage}
                  alt="After Remediated"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-green-800 text-white font-mono text-xs font-semibold shadow">
                  AFTER: RESOLVED & CLEARED
                </div>

                {/* BEFORE IMAGE (Clipped on Left) */}
                <div
                  style={{ width: `${sliderPos}%` }}
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-xl"
                >
                  <img
                    src={resolution.beforeImage}
                    alt="Before Problem"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-800 text-white font-mono text-xs font-semibold shadow">
                    BEFORE: REPORTED SCENE
                  </div>
                </div>

                {/* Interactive Slider Input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
                />

                {/* Center Divider Handle */}
                <div
                  style={{ left: `${sliderPos}%` }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-slate-700 shadow-md flex items-center justify-center pointer-events-none z-20"
                >
                  <Sliders className="w-4 h-4 text-slate-800" />
                </div>
              </div>
            ) : (
              /* Side-by-Side View */
              <div className="grid grid-cols-2 gap-3">
                <div className="relative rounded overflow-hidden border border-slate-200 aspect-video">
                  <img src={resolution.beforeImage} alt="Before" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-red-800 text-white font-mono text-[10px] font-semibold">
                    BEFORE SCENE
                  </div>
                </div>
                <div className="relative rounded overflow-hidden border border-slate-200 aspect-video">
                  <img src={resolution.afterImage} alt="After" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-green-800 text-white font-mono text-[10px] font-semibold">
                    AFTER SCENE
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Grievance ID: #{resolvedIncident.id}</span>
              <span>Drag slider center divider to inspect resolution clearance</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Official GCC Resolution Certificate */}
        <div className="lg:col-span-5 space-y-4">
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
                <FileCheck className="w-4 h-4 text-green-700" />
                <span>OFFICIAL RESOLUTION CERTIFICATE</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-mono text-[10px] font-bold border border-green-300">
                AUDITED
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-600">Remediating Officer:</span>
                <span className="text-slate-900 font-bold">{resolution.resolvedByStaff}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-600">Department Badge:</span>
                <span className="text-blue-900 font-bold">{resolution.staffBadge}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-600">Resolution Timestamp:</span>
                <span className="text-slate-900">{resolution.resolvedAt}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-600">GPS EXIF Geo-Match:</span>
                <span className="text-green-700 font-bold">✓ ±0.8m Verified Match</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="font-bold text-slate-900 uppercase text-[10px]">
                Automated CV Audit Criteria:
              </div>
              {resolution.aiVerificationNotes.map((note, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-700">
                  <span className="text-green-700 font-bold">✓</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>

            <button
              onClick={triggerVerificationSuccess}
              className="w-full py-2.5 rounded bg-green-700 hover:bg-green-800 text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Archive Municipal Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
