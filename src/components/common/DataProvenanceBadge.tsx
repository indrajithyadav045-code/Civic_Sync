import React from 'react';
import { DataProvenance, DataStatus } from '../../services/providers/types';

interface DataProvenanceBadgeProps {
  provenance: DataProvenance;
  showDetails?: boolean;
}

export const DataProvenanceBadge: React.FC<DataProvenanceBadgeProps> = ({ provenance, showDetails = true }) => {
  const getStatusColor = (status: DataStatus) => {
    switch (status) {
      case 'LIVE': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'UPDATING': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'STALE': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'OFFLINE': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getStatusDot = (status: DataStatus) => {
    switch (status) {
      case 'LIVE': return <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>;
      case 'UPDATING': return <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-spin"></span>;
      case 'STALE': return <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>;
      case 'OFFLINE': return <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>;
      default: return <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>;
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-mono border ${getStatusColor(provenance.status)}`}>
      {getStatusDot(provenance.status)}
      <span className="font-bold">{provenance.status}</span>
      {showDetails && (
        <>
          <span className="text-slate-400 font-sans">|</span>
          <span className="text-slate-700 font-sans truncate max-w-[150px]" title={provenance.source}>
            {provenance.source}
          </span>
          <span className="text-slate-400 font-sans">|</span>
          <span className="text-slate-500">{provenance.lastUpdated}</span>
        </>
      )}
    </div>
  );
};
