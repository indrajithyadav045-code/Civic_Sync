import React, { useState } from 'react';
import { AlertTriangle, Cpu, CheckCircle2, ArrowRight, Users, ShieldAlert, Zap } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const AiCityInsightCard: React.FC = () => {
  const { aiCityInsight, setActiveView, playSound } = useCivic();
  const [actionsExecuted, setActionsExecuted] = useState(false);

  const handleExecuteActions = () => {
    playSound('success');
    setActionsExecuted(true);
    setTimeout(() => setActionsExecuted(false), 6000);
  };

  return (
    <div className="rounded-2xl p-4 bg-[#0D111A] border border-slate-800 shadow-xl space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            AI City Insight & Fusion
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950 text-red-300 border border-red-500/40">
          {aiCityInsight.headline}
        </span>
      </div>

      {/* Zone & Confidence */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 text-[10px] block font-mono">TARGET ZONE:</span>
          <span className="font-bold text-white">{aiCityInsight.zone}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 text-[10px] block font-mono">MODEL CONFIDENCE:</span>
          <span className="font-bold text-cyan-300 font-mono text-sm">{aiCityInsight.confidencePct}%</span>
        </div>
      </div>

      {/* Multi-Signal Fusion */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs text-slate-300">
        <div className="font-bold text-[10px] uppercase text-slate-400 font-mono">Spatial Intelligence Fusion:</div>
        {aiCityInsight.signals.map((sig, idx) => (
          <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{sig}</span>
          </div>
        ))}
      </div>

      {/* Recommended Municipal Actions */}
      <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1.5 text-xs text-blue-200">
        <div className="font-bold text-[11px] uppercase text-blue-300 flex items-center space-x-1">
          <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
          <span>Recommended Inter-Agency Actions:</span>
        </div>
        {aiCityInsight.recommendedActions.map((action, idx) => (
          <div key={idx} className="text-[11px] flex items-center space-x-1.5 text-slate-300">
            <span className="text-cyan-400 font-bold">•</span>
            <span>{action}</span>
          </div>
        ))}

        <button
          onClick={handleExecuteActions}
          className="w-full mt-2 py-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center space-x-1 shadow"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{actionsExecuted ? '✓ All Recommended Actions Executed' : 'Execute Recommended Actions'}</span>
        </button>
      </div>

      {/* Predicted Impact Footer */}
      <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-white/5">
        <span>Impact: {aiCityInsight.predictedImpact}</span>
      </div>
    </div>
  );
};
