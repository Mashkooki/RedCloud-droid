import React, { useState } from 'react';
import { Power, Shield, CheckCircle2, Lock, Cpu, Globe } from 'lucide-react';
import { TorMode, Telemetry, V2RayStatus } from '../types';
import { TelemetryCard } from './TelemetryCard';
import { StatsGrid } from './StatsGrid';

interface TorTabProps {
  status: V2RayStatus;
  isConnected: boolean;
  isConnecting: boolean;
  onToggleConnect: () => void;
  selectedMode: TorMode;
  onSelectMode: (mode: TorMode) => void;
  customBridges: string;
  onChangeCustomBridges: (bridges: string) => void;
  torBootstrapProgress: number; // 0 to 100
  currentStepMessage: string;
  telemetry: Telemetry;
  onRetestTelemetry: () => void;
  labels: {
    title: string;
    subtitle: string;
    modeSelect: string;
    torModeAetherMasqueTitle: string;
    torModeAetherMasqueDesc: string;
    torModeAetherQuicTitle: string;
    torModeAetherQuicDesc: string;
    torModeDirectTitle: string;
    torModeDirectDesc: string;
    torModeSnowflakeTitle: string;
    torModeSnowflakeDesc: string;
    torModeCustomTitle: string;
    torModeCustomDesc: string;
    torConnectedBanner: string;
    customBridgeHint: string;
    buildingCircuits: string;
    layerAether: string;
    layerTor: string;
    layerVpn: string;
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

export const TorTab: React.FC<TorTabProps> = ({
  status,
  isConnected,
  isConnecting,
  onToggleConnect,
  selectedMode,
  onSelectMode,
  customBridges,
  onChangeCustomBridges,
  torBootstrapProgress,
  currentStepMessage,
  telemetry,
  onRetestTelemetry,
  labels,
}) => {
  const modes: { id: TorMode; title: string; desc: string; badge?: string }[] = [
    {
      id: 'aether_masque',
      title: labels.torModeAetherMasqueTitle,
      desc: labels.torModeAetherMasqueDesc,
      badge: 'RECOMMENDED',
    },
    {
      id: 'aether_quic',
      title: labels.torModeAetherQuicTitle,
      desc: labels.torModeAetherQuicDesc,
      badge: 'QUIC SPEED',
    },
    {
      id: 'snowflake',
      title: labels.torModeSnowflakeTitle,
      desc: labels.torModeSnowflakeDesc,
      badge: 'WEBRTC',
    },
    {
      id: 'direct',
      title: labels.torModeDirectTitle,
      desc: labels.torModeDirectDesc,
      badge: 'VANILLA',
    },
    {
      id: 'custom',
      title: labels.torModeCustomTitle,
      desc: labels.torModeCustomDesc,
      badge: 'OBFS4',
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-2 px-4 max-w-md mx-auto animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="text-center pt-2 pb-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Multi-Layered Onion Routing</span>
        </div>
        <h2 className="text-base font-bold text-white">{labels.title}</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
          {labels.subtitle}
        </p>
      </div>

      {/* 3-Layer Architecture Pipeline Card */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>{labels.buildingCircuits} {torBootstrapProgress}%</span>
          {isConnected && (
            <span className="text-emerald-400 text-[11px] font-semibold">100% Encrypted</span>
          )}
        </div>

        {/* Multi-step pipeline pills */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-colors ${
            isConnected || (isConnecting && torBootstrapProgress >= 25)
              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-900/60 border-slate-700/60 text-slate-400'
          }`}>
            <Cpu className="w-3.5 h-3.5" />
            <span className="truncate max-w-full leading-tight">{labels.layerAether}</span>
          </div>

          <div className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-colors ${
            isConnected || (isConnecting && torBootstrapProgress >= 65)
              ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
              : 'bg-slate-900/60 border-slate-700/60 text-slate-400'
          }`}>
            <Lock className="w-3.5 h-3.5" />
            <span className="truncate max-w-full leading-tight">{labels.layerTor}</span>
          </div>

          <div className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-colors ${
            isConnected
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900/60 border-slate-700/60 text-slate-400'
          }`}>
            <Globe className="w-3.5 h-3.5" />
            <span className="truncate max-w-full leading-tight">{labels.layerVpn}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${torBootstrapProgress}%` }}
          />
        </div>

        {/* Step message */}
        {isConnecting && currentStepMessage && (
          <p className="text-[11px] text-amber-300 font-medium text-center animate-pulse">
            {currentStepMessage}
          </p>
        )}
      </div>

      {/* Power Button */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative flex items-center justify-center">
          {isConnected && (
            <div className="absolute w-44 h-44 rounded-full bg-purple-500/20 animate-ping opacity-75 duration-1000" />
          )}
          {isConnecting && (
            <div className="absolute w-44 h-44 rounded-full bg-amber-500/20 animate-pulse" />
          )}

          <button
            id="tor-power-btn"
            onClick={onToggleConnect}
            className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 ${
              isConnected
                ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/40 text-white'
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
          <div className="mt-3 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-purple-400 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>{labels.connTime}</span>
            <span className="font-bold">{status.duration}</span>
          </div>
        )}
      </div>

      {/* Mode List */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 px-1 block">
          {labels.modeSelect}
        </span>
        <div className="space-y-2">
          {modes.map((m) => {
            const isSelected = selectedMode === m.id;
            return (
              <div key={m.id} className="space-y-2">
                <button
                  onClick={() => onSelectMode(m.id)}
                  className={`w-full p-3.5 rounded-2xl border text-start transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm shadow-purple-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold leading-tight">{m.title}</span>
                      {m.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {m.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{m.desc}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  )}
                </button>

                {/* Custom Bridge Input */}
                {isSelected && m.id === 'custom' && (
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700">
                    <textarea
                      value={customBridges}
                      onChange={(e) => onChangeCustomBridges(e.target.value)}
                      placeholder={labels.customBridgeHint}
                      dir="ltr"
                      rows={3}
                      className="w-full rounded-xl bg-slate-950 p-2.5 font-mono text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-600 resize-none"
                    />
                  </div>
                )}
              </div>
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
