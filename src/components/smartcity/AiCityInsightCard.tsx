import React, { useState } from 'react';
import { Cpu, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
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
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-blue-800" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            AI City Insight
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-red-100 border border-red-200 text-red-800 text-[10px] font-mono font-bold uppercase">
          {aiCityInsight.headline}
        </span>
      </div>

      {/* Zone & Confidence */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-500 text-[11px] block">TARGET ZONE:</span>
          <span className="font-bold text-slate-900">{aiCityInsight.zone}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-[11px] block">MODEL CONFIDENCE:</span>
          <span className="font-bold text-blue-900 font-mono">{aiCityInsight.confidencePct}%</span>
        </div>
      </div>

      {/* Multi-Signal Fusion */}
      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-700">
        <div className="font-bold text-[10px] uppercase text-slate-500">Spatial Intelligence Fusion:</div>
        {aiCityInsight.signals.map((sig, idx) => (
          <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-800">
            <CheckCircle2 className="w-3 h-3 text-blue-700 shrink-0" />
            <span>{sig}</span>
          </div>
        ))}
      </div>

      {/* Recommended Municipal Actions */}
      <div className="p-2.5 rounded bg-blue-50 border border-blue-200 space-y-1.5 text-xs text-blue-950">
        <div className="font-bold text-[10px] uppercase text-blue-900 flex items-center space-x-1">
          <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
          <span>Recommended Inter-Agency Actions:</span>
        </div>
        {aiCityInsight.recommendedActions.map((action, idx) => (
          <div key={idx} className="text-[11px] flex items-center space-x-1 text-blue-900">
            <span>•</span>
            <span>{action}</span>
          </div>
        ))}

        <button
          onClick={handleExecuteActions}
          className="w-full mt-1 py-1.5 px-3 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition flex items-center justify-center space-x-1 shadow-xs"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{actionsExecuted ? '✓ Recommended Actions Executed' : 'Execute Recommended Actions'}</span>
        </button>
      </div>

      {/* Predicted Impact Footer */}
      <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-slate-100">
        <span>Impact: {aiCityInsight.predictedImpact}</span>
      </div>
    </div>
  );
};
