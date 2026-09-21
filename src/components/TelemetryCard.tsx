import React from 'react';
import { RotateCw, Zap } from 'lucide-react';
import { Telemetry } from '../types';

interface TelemetryCardProps {
  telemetry: Telemetry;
  onRefresh: () => void;
  publicIpLabel: string;
  testingLabel: string;
  msLabel: string;
}

export const TelemetryCard: React.FC<TelemetryCardProps> = ({
  telemetry,
  onRefresh,
  publicIpLabel,
  testingLabel,
  msLabel,
}) => {
  return (
    <div className="rounded-2xl bg-slate-800/80 border border-slate-700/70 p-3.5 backdrop-blur shadow-sm transition-all">
      {telemetry.isTesting ? (
        <div className="flex items-center justify-center py-2 gap-2 text-sky-400">
          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">{testingLabel}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl select-none" role="img" aria-label="Country Flag">
              {telemetry.ipFlagEmoji || '🌐'}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-white truncate">
                  {telemetry.ipCountry || 'Connected Server'}
                </span>
                {telemetry.ipCountryCode && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {telemetry.ipCountryCode}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                <span>{publicIpLabel}:</span>
                <span className="text-slate-300 font-medium">{telemetry.publicIp || '...'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {telemetry.realPingMs !== null && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold font-mono">
                  {telemetry.realPingMs} {msLabel}
                </span>
              </div>
            )}
            <button
              id="telemetry-retest-btn"
              onClick={onRefresh}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
              title="Retest Connection & IP"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
