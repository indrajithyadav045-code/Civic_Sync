import React, { useState } from 'react';
import { 
  Building, 
  Map, 
  LayoutDashboard, 
  Cpu, 
  Layers, 
  Radio, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Volume2, 
  VolumeX, 
  Play, 
  PlusCircle, 
  Activity,
  AlertTriangle,
  Shield,
  Phone,
  Globe
} from 'lucide-react';
import { useCivic, ActiveView } from '../../context/CivicContext';
import { SmsSettingsModal } from './SmsSettingsModal';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    soundEnabled, 
    setSoundEnabled, 
    startHackathonDemo,
    isDemoRunning,
    incidents,
    alerts
  } = useCivic();

  const [language, setLanguage] = useState<'EN' | 'TA'>('EN');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  const navItems: { id: ActiveView; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'citizen_home', label: 'Citizen Portal', icon: Activity },
    { id: 'report_issue', label: 'Lodge Grievance', icon: PlusCircle },
    { id: 'ai_triage', label: 'AI Triage Audit', icon: Cpu },
    { id: 'dedup_lab', label: 'Spatial Dedup', icon: Layers, badge: 3 },
    { id: 'command_map', label: 'GIS Incident Map', icon: Map },
    { id: 'command_center', label: 'ICCC Operations', icon: LayoutDashboard, badge: incidents.filter(i => i.status !== 'RESOLVED').length },
    { id: 'disaster_alerts', label: 'Disaster Alerts', icon: Radio, badge: alerts.length },
    { id: 'case_tracking', label: 'Track Complaint', icon: Search },
    { id: 'resolution_verification', label: 'Resolution Proof', icon: CheckCircle2 },
    { id: 'risk_forecast', label: 'Risk Forecast', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Tricolor Accent Line */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

      {/* Top Accessibility & Official Helpline Bar */}
      <div className="bg-[#f1f5f9] border-b border-slate-200 px-4 sm:px-8 py-1 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-900 text-[11px]">GOVERNMENT OF TAMIL NADU</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-600 font-medium hidden sm:inline">
            GREATER CHENNAI CORPORATION (GCC) • SMART CITY ICCC
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-slate-700 font-medium">
            <Phone className="w-3.5 h-3.5 text-blue-700" />
            <span className="text-[11px]">Emergency Helpline: <strong className="text-blue-900 font-bold">1913</strong></span>
          </div>

          <span className="text-slate-300">|</span>

          <button
            onClick={() => setIsSmsModalOpen(true)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-bold transition"
            title="Configure Phone Numbers for SMS Alerts"
          >
            <span>📱 Live SMS Alerts</span>
          </button>

          <span className="text-slate-300">|</span>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'EN' ? 'TA' : 'EN')}
            className="flex items-center space-x-1 text-[11px] font-semibold text-blue-800 hover:underline"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'EN' ? 'தமிழ் (Tamil)' : 'English'}</span>
          </button>

          <span className="text-slate-300 hidden md:inline">|</span>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
            title={soundEnabled ? 'Mute Audio Telemetry' : 'Enable Audio Telemetry'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Main Official Government Header with Seals */}
      <div className="bg-[#0f2a4a] text-white px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => setActiveView('citizen_home')}
            className="flex items-center space-x-3.5 cursor-pointer select-none"
          >
            {/* Official State Emblem Placeholder Badge */}
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow p-1 border-2 border-amber-400">
              <Building className="w-6 h-6 text-[#0f2a4a]" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg sm:text-xl text-white tracking-tight leading-none">
                  CIVIC-SYNC
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-amber-400 text-slate-900 rounded font-mono">
                  GCC • ICCC PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Intelligent Citizen-Centric Spatial Governance & Disaster Response Platform
              </p>
            </div>
          </div>

          {/* Evaluator Demo Trigger Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={startHackathonDemo}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded text-xs font-semibold tracking-wide transition border shadow-sm ${
                isDemoRunning 
                  ? 'bg-amber-400 text-slate-900 border-amber-300 font-bold'
                  : 'bg-blue-800 hover:bg-blue-700 text-white border-blue-600'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isDemoRunning ? 'EVALUATOR TOUR ACTIVE' : 'EVALUATOR WALKTHROUGH'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Menu Bar */}
      <div className="bg-[#00152f] text-slate-200 px-4 sm:px-8 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-blue-700 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                    isActive ? 'bg-white text-blue-900 font-bold' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <SmsSettingsModal 
        isOpen={isSmsModalOpen} 
        onClose={() => setIsSmsModalOpen(false)} 
      />
    </header>
  );
};
