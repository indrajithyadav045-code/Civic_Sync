import React from 'react';
import { Building } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const Footer: React.FC = () => {
  const { setActiveView, t } = useCivic();

  return (
    <footer className="bg-[#00152f] text-slate-300 text-xs border-t border-slate-700 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Col 1 */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white text-sm">
                {t('footerTitle')}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {t('footerSubtitle')}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-blue-300">
              <button onClick={() => setActiveView('citizen_home')} className="hover:underline hover:text-white">Citizen Portal</button>
              <button onClick={() => setActiveView('report_issue')} className="hover:underline hover:text-white">Lodge Complaint</button>
              <button onClick={() => setActiveView('ai_triage')} className="hover:underline hover:text-white">AI Triage Audit</button>
              <button onClick={() => setActiveView('command_map')} className="hover:underline hover:text-white">GIS Incident Map</button>
              <button onClick={() => setActiveView('command_center')} className="hover:underline hover:text-white">GCC Operations</button>
              <button onClick={() => setActiveView('case_tracking')} className="hover:underline hover:text-white">Case Tracker</button>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wide">
              Official Portals & Links
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• Greater Chennai Corporation (chennaicorporation.gov.in)</li>
              <li>• Tamil Nadu Smart Cities Mission (tn.gov.in)</li>
              <li>• Chennai Metro Water CMWSSB (chennaimetrowater.tn.gov.in)</li>
              <li>• TANGEDCO Power Grid (tangedco.gov.in)</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wide">
              Subsystem Health Status
            </h4>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between">
                <span>PostGIS Spatial Clusterer:</span>
                <span className="text-green-400 font-bold">OPERATIONAL</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ViT Damage Vision Engine:</span>
                <span className="text-green-400 font-bold">ONLINE (98.4%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Doppler Radar Sync:</span>
                <span className="text-green-400 font-bold">ACTIVE (02m ago)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Telecom Cell Broadcast:</span>
                <span className="text-green-400 font-bold">READY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>
            {t('footerRights')}
          </div>
          <div>
            {t('footerCompliance')}
          </div>
        </div>
      </div>
    </footer>
  );
};
