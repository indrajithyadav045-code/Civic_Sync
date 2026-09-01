import React, { useState } from 'react';
import { Incident } from '../../types';
import { Scan, ShieldCheck, Cpu, Sliders, FileCode, CheckCircle2 } from 'lucide-react';

interface AiVisionInspectionProps {
  incident: Incident;
}

export const AiVisionInspection: React.FC<AiVisionInspectionProps> = ({ incident }) => {
  const [showBoxes, setShowBoxes] = useState(true);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 7 Columns: Photo with Dynamic Bounding Boxes */}
      <div className="lg:col-span-7 space-y-3">
        <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Scan className="w-4 h-4 text-blue-800" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                YOLOv8 / ViT Optical Sensor Damage Segmentation
              </h3>
            </div>

            <button
              onClick={() => setShowBoxes(!showBoxes)}
              className={`px-2.5 py-1 text-[11px] rounded border font-medium transition ${
                showBoxes 
                  ? 'bg-blue-900 text-white border-blue-900' 
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {showBoxes ? '✓ Bounding Overlays Active' : 'Show Overlays'}
            </button>
          </div>

          {/* Image & Bounding Box Canvas Container */}
          <div className="relative rounded overflow-hidden border border-slate-300 bg-slate-950 aspect-video select-none">
            <img
              src={incident.image}
              alt="Incident Optical Sensor Feed"
              className="w-full h-full object-cover"
            />

            {/* Bounding Boxes Overlay */}
            {showBoxes && incident.detectedObjects.map((box) => {
              const isSelected = selectedBoxId === box.id;
              return (
                <div
                  key={box.id}
                  onClick={() => setSelectedBoxId(isSelected ? null : box.id)}
                  style={{
                    top: `${box.box.top}%`,
                    left: `${box.box.left}%`,
                    width: `${box.box.width}%`,
                    height: `${box.box.height}%`,
                    borderColor: box.color,
                  }}
                  className={`absolute border-2 rounded cursor-pointer transition-all ${
                    isSelected 
                      ? 'ring-2 ring-white z-30' 
                      : 'hover:border-white z-20 opacity-95'
                  }`}
                >
                  {/* Bounding Label Pill */}
                  <div
                    style={{ backgroundColor: box.color }}
                    className="absolute -top-5 left-0 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold text-slate-950 flex items-center space-x-1 whitespace-nowrap shadow"
                  >
                    <span>{box.label}</span>
                    <span className="opacity-90">({Math.round(box.confidence * 100)}%)</span>
                  </div>
                </div>
              );
            })}

            {/* Corner Metadata Telemetry */}
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 font-mono text-[9px] text-white">
              FRAME: 1920x1080 | LATENCY: 41ms | MODEL: ViT-B/16-Civic
            </div>
          </div>
        </div>
      </div>

      {/* Right 5 Columns: Detected Object Signatures */}
      <div className="lg:col-span-5 space-y-4">
        <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Segmented Hazard Signatures ({incident.detectedObjects.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Model: ViT-B/16</span>
          </div>

          <div className="space-y-2">
            {incident.detectedObjects.map((obj) => {
              const isSelected = selectedBoxId === obj.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => setSelectedBoxId(isSelected ? null : obj.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: obj.color }}
                      />
                      <span className="text-xs font-bold text-slate-900">{obj.label}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-900">
                      {Math.round(obj.confidence * 100)}% Match
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 mt-1.5 pt-1.5 border-t border-slate-200">
                    <span>Assessed Impact:</span>
                    <span className={`font-bold ${
                      obj.damageLevel === 'SEVERE' ? 'text-red-700' : 'text-amber-700'
                    }`}>
                      {obj.damageLevel} DAMAGE
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
            <div className="font-bold flex items-center space-x-1.5 text-[10px] text-blue-900">
              <Cpu className="w-3.5 h-3.5" />
              <span>Production Pipeline Interface:</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-normal">
              ViT-B model output is integrated directly with the Greater Chennai Corporation dispatch router to flag road blockages automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
