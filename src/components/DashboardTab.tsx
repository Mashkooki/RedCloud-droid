import React from 'react';
import { Power, RotateCw, Sparkles, Server, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { Account, Telemetry, V2RayStatus } from '../types';
import { TelemetryCard } from './TelemetryCard';
import { StatsGrid, formatBytes } from './StatsGrid';

interface DashboardTabProps {
  status: V2RayStatus;
  isConnected: boolean;
  isConnecting: boolean;
  onToggleConnect: () => void;
  accounts: Account[];
  selectedAccount: Account | null;
  onSelectAccount: (acc: Account) => void;
  onSyncAccounts: () => void;
  isSyncing: boolean;
  fastestIp: string | null;
  l7PingMs: number | null;
  onRescanL7: () => void;
  isScanningL7: boolean;
  telemetry: Telemetry;
  onRetestTelemetry: () => void;
  onOpenConfigModal: () => void;
  serversUpdatingMode: boolean;
  limitExhaustedMode: boolean;
  labels: {
    sharedAcc: string;
    scanIp: string;
    pingInfo: string;
    ms: string;
    connected: string;
    connecting: string;
    disconnected: string;
    connTime: string;
    serverUpdatingBanner: string;
    limitExhaustedBanner: string;
    downSpeed: string;
    upSpeed: string;
    totalDown: string;
    totalUp: string;
    publicIpLabel: string;
    testingLabel: string;
  };
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  status,
  isConnected,
  isConnecting,
  onToggleConnect,
  accounts,
  selectedAccount,
  onSelectAccount,
  onSyncAccounts,
  isSyncing,
  fastestIp,
  l7PingMs,
  onRescanL7,
  isScanningL7,
  telemetry,
  onRetestTelemetry,
  onOpenConfigModal,
  serversUpdatingMode,
  limitExhaustedMode,
  labels,
}) => {
  return (
    <div className="space-y-4 pb-20 pt-2 px-4 max-w-md mx-auto animate-in fade-in duration-200">
      {/* Dynamic Alert Banners */}
      {serversUpdatingMode && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2.5 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{labels.serverUpdatingBanner}</span>
        </div>
      )}

      {limitExhaustedMode && (
        <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{labels.limitExhaustedBanner}</span>
        </div>
      )}

      {/* Smart Shared Accounts Selection */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-3.5 backdrop-blur">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{labels.sharedAcc}</span>
          </div>
          <button
            id="sync-accounts-btn"
            onClick={onSyncAccounts}
            disabled={isSyncing}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1 text-[11px]"
            title="Sync Accounts"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {accounts.map((acc, idx) => {
            const isSelected = selectedAccount?.worker === acc.worker;
            const usedMB = Math.round((parseInt(acc.used_bytes) || 0) / (1024 * 1024));
            return (
              <button
                key={acc.worker || idx}
                onClick={() => onSelectAccount(acc)}
                className={`px-3 py-2 rounded-xl text-start shrink-0 border transition-all ${
                  isSelected
                    ? 'bg-blue-600/25 border-blue-500 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold font-mono">
                    {acc.worker.split('.')[0] || `Server ${idx + 1}`}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2">
                  <span>Used: {usedMB} MB</span>
                  <span className="px-1 rounded bg-slate-800 text-[9px]">P{acc.priority}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Connection Power Button Card */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative flex items-center justify-center">
          {/* Animated Glow Rings when Connected or Connecting */}
          {isConnected && (
            <div className="absolute w-44 h-44 rounded-full bg-emerald-500/20 animate-ping opacity-75 duration-1000" />
          )}
          {isConnecting && (
            <div className="absolute w-44 h-44 rounded-full bg-amber-500/20 animate-pulse" />
          )}

          <button
            id="vpn-main-power-btn"
            onClick={onToggleConnect}
            className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 ${
              isConnected
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/40 text-white'
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

        {/* Connection Timer Badge */}
        {isConnected && (
          <div className="mt-3 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{labels.connTime}</span>
            <span className="font-bold">{status.duration}</span>
          </div>
        )}
      </div>

      {/* L7 Clean Cloudflare IP Status Card */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block">{labels.scanIp}</span>
            <span className="text-xs font-bold font-mono text-slate-200 truncate block">
              {fastestIp || '104.18.0.14'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {l7PingMs !== null && (
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {l7PingMs} {labels.ms}
            </span>
          )}
          <button
            id="rescan-l7-btn"
            onClick={onRescanL7}
            disabled={isScanningL7}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Rescan Cloudflare clean IP"
          >
            <RefreshCw className={`w-4 h-4 ${isScanningL7 ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Config Overview Card with Tap to Edit */}
      <button
        id="open-config-btn"
        onClick={onOpenConfigModal}
        className="w-full rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-3.5 flex items-center justify-between text-start transition-colors group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                {selectedAccount ? selectedAccount.worker : 'Auto Selected Worker'}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                VLESS WS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
              {selectedAccount ? selectedAccount.path : '/?ed=2048'}
            </p>
          </div>
        </div>
        <span className="text-xs text-blue-400 font-medium shrink-0 ps-2">ویرایش / Edit</span>
      </button>

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
