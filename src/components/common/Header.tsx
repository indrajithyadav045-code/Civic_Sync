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
  Globe,
  ChevronDown,
  Database,
  CloudRain,
  Wind
} from 'lucide-react';
import { useCivic, ActiveView } from '../../context/CivicContext';
import { SmsSettingsModal } from './SmsSettingsModal';
import { DataSourcesModal } from './DataSourcesModal';
import { QuickCommandBar } from './QuickCommandBar';
import { SUPPORTED_LANGUAGES, Language } from '../../i18n/translations';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    soundEnabled, 
    setSoundEnabled, 
    startHackathonDemo,
    isDemoRunning,
    incidents,
    alerts,
    language,
    setLanguage,
    t,
    playSound,
    liveWeather,
    liveAqi
  } = useCivic();

  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const navItems: { id: ActiveView; labelKey: keyof typeof import('../../i18n/translations').translations.en; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'citizen_home', labelKey: 'navCitizenHome', icon: Activity },
    { id: 'report_issue', labelKey: 'navReportIssue', icon: PlusCircle },
    { id: 'ai_triage', labelKey: 'navAiTriage', icon: Cpu },
    { id: 'dedup_lab', labelKey: 'navDedupLab', icon: Layers, badge: 3 },
    { id: 'command_map', labelKey: 'navCommandMap', icon: Map },
    { id: 'command_center', labelKey: 'navCommandCenter', icon: LayoutDashboard, badge: incidents.filter(i => i.status !== 'RESOLVED').length },
    { id: 'disaster_alerts', labelKey: 'navDisasterAlerts', icon: Radio, badge: alerts.length },
    { id: 'case_tracking', labelKey: 'navCaseTracking', icon: Search },
    { id: 'risk_forecast', labelKey: 'navRiskForecast', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Tricolor Accent Line */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

      {/* Top Accessibility & Official Helpline Bar */}
      <div className="bg-[#f1f5f9] border-b border-slate-200 px-4 sm:px-8 py-1 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-900 text-[11px]">{t('govTitle')}</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-600 font-medium hidden sm:inline">
            {t('govSubtitle')}
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Real-Time IMD Weather & CPCB AQI Chips */}
          {liveWeather && (
            <div className="hidden lg:flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[10px] text-blue-900 font-mono">
              <CloudRain className="w-3 h-3 text-blue-700" />
              <span>IMD: {liveWeather.temperatureC}°C ({liveWeather.precipitationMmHr}mm/h)</span>
            </div>
          )}

          {liveAqi && (
            <div className="hidden lg:flex items-center space-x-1 px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-[10px] text-teal-900 font-mono">
              <Wind className="w-3 h-3 text-teal-700" />
              <span>CPCB AQI: {liveAqi.aqi}</span>
            </div>
          )}

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Quick Command Bar Spotlight Button */}
          <button
            onClick={() => setIsCommandBarOpen(true)}
            className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] font-semibold transition"
            title="Quick Command Bar & Jump Search (Ctrl+K)"
          >
            <Search className="w-3 h-3 text-slate-500" />
            <span className="hidden sm:inline">Spotlight</span>
            <kbd className="px-1 py-0.2 rounded bg-white text-[9px] font-mono text-slate-500 border border-slate-200 hidden md:inline">⌘K</kbd>
          </button>

          <span className="text-slate-300">|</span>

          {/* Data Sources Catalog Modal Button */}
          <button
            onClick={() => setIsSourcesModalOpen(true)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold transition shadow-xs"
            title="Inspect Official Government Data Sources & Provenance"
          >
            <Database className="w-3 h-3 text-emerald-700" />
            <span>● Live Data Sources</span>
          </button>

          <span className="text-slate-300">|</span>

          <button
            onClick={() => setIsSmsModalOpen(true)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-bold transition"
            title="Configure Phone Numbers for SMS Alerts"
          >
            <span>{t('smsAlertsBtn')}</span>
          </button>

          <span className="text-slate-300">|</span>

          {/* 6-Language Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-[11px] font-bold text-blue-900 transition shadow-sm"
              title="Select Platform Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-700" />
              <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg border border-slate-300 shadow-xl py-1 z-50 font-sans">
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                  Select Language (6 Languages)
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangDropdownOpen(false);
                      playSound('beep');
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition ${
                      language === lang.code 
                        ? 'bg-blue-50 text-blue-900 font-bold border-l-4 border-blue-800' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">({lang.name})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
                  {t('appTitle')}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-amber-400 text-slate-900 rounded font-mono">
                  {t('appBadge')}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                {t('appTagline')}
              </p>
            </div>
          </div>

          {/* Operations Walkthrough Trigger Button */}
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
              <span>{isDemoRunning ? 'Automated Run Active...' : '▶ Operations Walkthrough'}</span>
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
                <span>{t(item.labelKey)}</span>
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

      <DataSourcesModal
        isOpen={isSourcesModalOpen}
        onClose={() => setIsSourcesModalOpen(false)}
      />

      <QuickCommandBar
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
      />
    </header>
  );
};
