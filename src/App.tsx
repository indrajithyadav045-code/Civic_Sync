import React from 'react';
import { useCivic } from './context/CivicContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CitizenHome } from './components/citizen/CitizenHome';
import { ReportIncident } from './components/citizen/ReportIncident';
import { AiTriageEngine } from './components/triage/AiTriageEngine';
import { SpatialDedupVisualizer } from './components/dedup/SpatialDedupVisualizer';
import { TacticalCommandMap } from './components/map/TacticalCommandMap';
import { AuthorityCommandCenter } from './components/authority/AuthorityCommandCenter';
import { GeoFencedAlerts } from './components/alerts/GeoFencedAlerts';
import { CitizenCaseTracker } from './components/tracking/CitizenCaseTracker';
import { ResolutionVerifier } from './components/verification/ResolutionVerifier';
import { PredictiveRiskForecast } from './components/forecast/PredictiveRiskForecast';
import { StrategicFutureMatrix } from './components/future-matrix/StrategicFutureMatrix';
import { MunicipalAdminPortal } from './components/authority/MunicipalAdminPortal';
import { HackathonTourModal } from './components/guided-demo/HackathonTourModal';

export const AppContent: React.FC = () => {
  const { activeView } = useCivic();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex-1 py-4">
        {activeView === 'citizen_home' && <CitizenHome />}
        {activeView === 'report_issue' && <ReportIncident />}
        {activeView === 'ai_triage' && <AiTriageEngine />}
        {activeView === 'dedup_lab' && <SpatialDedupVisualizer />}
        {activeView === 'command_map' && <TacticalCommandMap />}
        {activeView === 'command_center' && <AuthorityCommandCenter />}
        {activeView === 'admin_portal' && <MunicipalAdminPortal />}
        {activeView === 'disaster_alerts' && <GeoFencedAlerts />}
        {activeView === 'case_tracking' && <CitizenCaseTracker />}
        {activeView === 'resolution_verification' && <ResolutionVerifier />}
        {activeView === 'risk_forecast' && <PredictiveRiskForecast />}
        {activeView === 'future_matrix' && <StrategicFutureMatrix />}
      </main>

      <Footer />
      <HackathonTourModal />
    </div>
  );
};

export default AppContent;
