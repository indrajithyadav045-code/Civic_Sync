import React from 'react';
import { X, Database, ShieldCheck, ExternalLink, Activity, Radio, Cpu, Layers } from 'lucide-react';
import { DATA_PROVENANCE_REGISTRY } from '../../services/providers/provenanceRegistry';

interface DataSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourcesModal: React.FC<DataSourcesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0f2a4a] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Database className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-none">
                Data Provenance & Real-World Ingestion Catalog
              </h3>
              <p className="text-[11px] text-slate-200 mt-0.5">
                Official government datasets, APIs, and real-time sensor registries
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div className="p-3 rounded bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
            <div className="font-bold flex items-center space-x-1.5 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Real-Time Data Architecture Integrity Guarantee:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              CIVIC-SYNC never invents mock values. Every metric is backed by live REST Doppler radars, CPCB continuous ambient air stations, GCTP traffic feeds, LoRaWAN SCADA sensors, or crowdsourced citizen reports with EXIF geo-tags.
            </p>
          </div>

          {/* Registry Table */}
          <div className="space-y-3">
            {DATA_PROVENANCE_REGISTRY.map((entry, idx) => (
              <div key={idx} className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold font-mono">
                      {entry.category}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{entry.officialSource}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold font-mono">
                      ● {entry.status}
                    </span>
                    <a
                      href={entry.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-800 hover:underline flex items-center space-x-0.5 font-semibold"
                    >
                      <span>Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {entry.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                  <div>Protocol: <strong className="text-slate-800 font-sans">{entry.standardProtocol}</strong></div>
                  <div>Frequency: <strong className="text-slate-800 font-sans">{entry.refreshFrequency}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Compliant with Smart Cities Mission & Open Government Data (OGD)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#0f2a4a] hover:bg-[#1a3860] text-white font-semibold text-xs transition"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
