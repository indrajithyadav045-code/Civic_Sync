import React from 'react';
import { Shield, Cpu, Layers, Activity, Radio, Building, Phone, Globe } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useCivic();

  return (
    <footer className="border-t border-slate-200 bg-white mt-12 text-slate-600 text-xs">
      {/* Subsystem Health Bar */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase">NLP Semantic Parser</div>
                <div className="text-slate-900 font-bold">Online (0.04s)</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase">50m Spatial Dedup</div>
                <div className="text-slate-900 font-bold">PostGIS Active</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase">ViT-B Computer Vision</div>
                <div className="text-slate-900 font-bold">Inference Ready</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase">Resolution Audit</div>
                <div className="text-slate-900 font-bold">EXIF Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Government Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Building className="w-4 h-4 text-blue-900" />
              <span>CIVIC-SYNC – Integrated Citizen-Centric Governance Platform</span>
            </div>
            <p className="text-slate-500 text-xs">
              Developed for the Greater Chennai Corporation (GCC) & Government of Tamil Nadu.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-blue-900">
            <button onClick={() => setActiveView('citizen_home')} className="hover:underline">Citizen Portal</button>
            <button onClick={() => setActiveView('report_issue')} className="hover:underline">Lodge Complaint</button>
            <button onClick={() => setActiveView('ai_triage')} className="hover:underline">AI Triage Audit</button>
            <button onClick={() => setActiveView('command_map')} className="hover:underline">GIS Incident Map</button>
            <button onClick={() => setActiveView('command_center')} className="hover:underline">GCC Operations</button>
            <button onClick={() => setActiveView('case_tracking')} className="hover:underline">Case Tracker</button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>© 2026 Greater Chennai Corporation (GCC). All Rights Reserved.</span>
          <div className="flex items-center space-x-3">
            <span>Toll-Free Helpline: <strong>1913</strong></span>
            <span>•</span>
            <span>Designed to WCAG 2.1 AA Compliance Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
