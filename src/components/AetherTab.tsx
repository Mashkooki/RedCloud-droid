import React from 'react';
import { Power, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { AetherMode, Telemetry, V2RayStatus } from '../types';
import { TelemetryCard } from './TelemetryCard';
import { StatsGrid } from './StatsGrid';

interface AetherTabProps {
  status: V2RayStatus;
  isConnected: boolean;
  isConnecting: boolean;
  onToggleConnect: () => void;
  selectedMode: AetherMode;
  onSelectMode: (mode: AetherMode) => void;
  telemetry: Telemetry;
  onRetestTelemetry: () => void;
  labels: {
    title: string;
    subtitle: string;
    modeSelect: string;
    modeAutoTitle: string;
    modeAutoDesc: string;
    modeMasqueH2Title: string;
    modeMasqueH2Desc: string;
    modeMasqueTitle: string;
    modeMasqueDesc: string;
    modeGoolTitle: string;
    modeGoolDesc: string;
    modeWireguardTitle: string;
    modeWireguardDesc: string;
    launching: string;
    connectedBanner: string;
    connected: string;
    connecting: string;
    disconnected: string;
    connTime: string;
    downSpeed: string;
    upSpeed: string;
    totalDown: string;
    totalUp: string;
    publicIpLabel: string;
    testingLabel: string;
    ms: string;
  };
}

export const AetherTab: React.FC<AetherTabProps> = ({
  status,
  isConnected,
  isConnecting,
  onToggleConnect,
  selectedMode,
  onSelectMode,
  telemetry,
  onRetestTelemetry,
  labels,
}) => {
  const modes: { id: AetherMode; title: string; desc: string; badge?: string }[] = [
    {
      id: 'auto',
      title: labels.modeAutoTitle,
      desc: labels.modeAutoDesc,
      badge: 'PRO',
    },
    {
      id: 'masque_h2',
      title: labels.modeMasqueH2Title,
      desc: labels.modeMasqueH2Desc,
      badge: 'TLS FRAG',
    },
    {
      id: 'masque',
      title: labels.modeMasqueTitle,
      desc: labels.modeMasqueDesc,
      badge: 'QUIC / UDP',
    },
    {
      id: 'gool',
      title: labels.modeGoolTitle,
      desc: labels.modeGoolDesc,
      badge: 'WARP × 2',
    },
    {
      id: 'wireguard',
      title: labels.modeWireguardTitle,
      desc: labels.modeWireguardDesc,
      badge: 'LOW BATTERY',
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-2 px-4 max-w-md mx-auto animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="text-center pt-2 pb-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
          <Zap className="w-3.5 h-3.5" />
          <span>Cloudflare WARP MASQUE Core</span>
        </div>
        <h2 className="text-base font-bold text-white">{labels.title}</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
          {labels.subtitle}
        </p>
      </div>

      {/* Connected Banner */}
      {isConnected && (
        <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center gap-2.5 text-cyan-300 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
          <span className="font-semibold">{labels.connectedBanner}</span>
        </div>
      )}

      {/* Power Button */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative flex items-center justify-center">
          {isConnected && (
            <div className="absolute w-44 h-44 rounded-full bg-cyan-500/20 animate-ping opacity-75 duration-1000" />
          )}
          {isConnecting && (
            <div className="absolute w-44 h-44 rounded-full bg-amber-500/20 animate-pulse" />
          )}

          <button
            id="aether-power-btn"
            onClick={onToggleConnect}
            className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 ${
              isConnected
                ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-cyan-500/40 text-white'
                : isConnecting
                ? 'bg-gradient-to-tr from-amber-600 to-orange-500 shadow-amber-500/40 text-white'
                : 'bg-slate-800 hover:bg-slate-750 border-2 border-slate-700 shadow-slate-900/80 text-slate-300 hover:text-white'
            }`}
          >
            {isConnecting ? (
              <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin mb-1" />
            ) : (
              <Power className={`w-12 h-12 mb-1 ${isConnected ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
            )}
            <span className="text-xs font-bold tracking-wide">
              {isConnected
                ? labels.connected
                : isConnecting
                ? labels.connecting
                : labels.disconnected}
            </span>
          </button>
        </div>

        {isConnected && (
          <div className="mt-3 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-cyan-400 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{labels.connTime}</span>
            <span className="font-bold">{status.duration}</span>
          </div>
        )}
      </div>

      {/* Protocol Mode List */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 px-1 block">
          {labels.modeSelect}
        </span>
        <div className="space-y-2">
          {modes.map((m) => {
            const isSelected = selectedMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`w-full p-3.5 rounded-2xl border text-start transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold leading-tight">{m.title}</span>
                    {m.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{m.desc}</p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Telemetry Card */}
      <TelemetryCard
        telemetry={telemetry}
        onRefresh={onRetestTelemetry}
        publicIpLabel={labels.publicIpLabel}
        testingLabel={labels.testingLabel}
        msLabel={labels.ms}
      />

      {/* Stats Grid */}
      <StatsGrid
        status={status}
        labels={{
          downSpeed: labels.downSpeed,
          upSpeed: labels.upSpeed,
          totalDown: labels.totalDown,
          totalUp: labels.totalUp,
        }}
      />
    </div>
  );
};
