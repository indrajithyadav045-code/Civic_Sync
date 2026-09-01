import React, { useState } from 'react';
import { Sparkles, CloudRain, Car, Lightbulb, RefreshCw, Sliders, CheckCircle2, Zap } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { realtimeEventBus } from '../../services/realtime/eventBus';

export const SimulationSandbox: React.FC = () => {
  const { refreshLiveFeeds, isLiveLoading, playSound } = useCivic();
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [simStatus, setSimStatus] = useState<string | null>(null);

  const handleSimulateRainfallSpike = () => {
    playSound('alert');
    setActivePreset('rain');
    setSimStatus('Simulating sudden 50mm monsoon downpour in Ward 12...');

    realtimeEventBus.publish('FLOOD_ALERT', {
      title: 'Monsoon Cloudburst Telemetry Spike (+52mm/hr)',
      location: 'Ward 12 (Velachery South Basin)',
      severity: 'CRITICAL'
    }, 'Simulated IMD Radar');

    refreshLiveFeeds();

    setTimeout(() => {
      setSimStatus('Dynamic Flood Risk recalculated: Escalated to 94/100.');
    }, 1200);
  };

  const handleSimulateTrafficClearance = () => {
    playSound('success');
    setActivePreset('traffic');
    setSimStatus('Simulating green-corridor traffic clearance on Mount Road...');

    realtimeEventBus.publish('TRAFFIC_CHANGE', {
      title: 'Green Corridor Active: Mount Road Congestion Easing',
      location: 'Mount Road Arterial Corridor',
      severity: 'MEDIUM'
    }, 'Simulated GCTP Mesh');

    refreshLiveFeeds();

    setTimeout(() => {
      setSimStatus('Mobility score increased to 91/100.');
    }, 1200);
  };

  const handleSimulateSensorTrigger = () => {
    playSound('triage');
    setActivePreset('sensor');
    setSimStatus('Injecting live ultrasonic bin overflow event...');

    realtimeEventBus.publish('WASTE_STATUS_CHANGE', {
      title: 'Ultrasonic Bin #WB-092 Fill Rate > 95%',
      location: 'Ward 20 (Guindy Industrial Sector)',
      severity: 'HIGH'
    }, 'Simulated LoRaWAN Mesh');

    setTimeout(() => {
      setSimStatus('Automated compactor dispatch signal broadcasted.');
    }, 1200);
  };

  return (
    <div className="gov-card rounded-lg p-4 bg-slate-900 text-white border border-slate-700 shadow-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
            Interactive City Simulator (Evaluation Sandbox)
          </h3>
        </div>

        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
          REAL-TIME REACTIVE
        </span>
      </div>

      <p className="text-[11px] text-slate-300">
        Click any event preset to inject live telemetry pulses and watch the platform dynamically recalculate risk scores, SLAs, and map layers in real time:
      </p>

      {/* Preset Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <button
          onClick={handleSimulateRainfallSpike}
          className={`p-2 rounded border text-left text-xs transition flex items-center space-x-2 ${
            activePreset === 'rain'
              ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
          <div>
            <div className="font-bold text-[11px]">Rainfall Spike</div>
            <div className="text-[9px] text-slate-400 font-mono">+52mm/hr Storm</div>
          </div>
        </button>

        <button
          onClick={handleSimulateTrafficClearance}
          className={`p-2 rounded border text-left text-xs transition flex items-center space-x-2 ${
            activePreset === 'traffic'
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <Car className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-[11px]">Clear Corridor</div>
            <div className="text-[9px] text-slate-400 font-mono">Green Corridor</div>
          </div>
        </button>

        <button
          onClick={handleSimulateSensorTrigger}
          className={`p-2 rounded border text-left text-xs transition flex items-center space-x-2 ${
            activePreset === 'sensor'
              ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="font-bold text-[11px]">IoT Overflow</div>
            <div className="text-[9px] text-slate-400 font-mono">Bin #WB-092</div>
          </div>
        </button>

        <button
          onClick={() => {
            playSound('radar');
            refreshLiveFeeds();
            setSimStatus('Ingesting live IMD/CPCB radar telemetry...');
          }}
          disabled={isLiveLoading}
          className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-left text-xs transition flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-cyan-400 shrink-0 ${isLiveLoading ? 'animate-spin' : ''}`} />
          <div>
            <div className="font-bold text-[11px]">Live Sync</div>
            <div className="text-[9px] text-slate-400 font-mono">Fetch Live Radar</div>
          </div>
        </button>
      </div>

      {/* Simulation Feedback Status */}
      {simStatus && (
        <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-cyan-300 flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{simStatus}</span>
        </div>
      )}
    </div>
  );
};
