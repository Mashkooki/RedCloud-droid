import React from 'react';
import { ArrowDown, ArrowUp, HardDriveDownload, HardDriveUpload } from 'lucide-react';
import { V2RayStatus } from '../types';

interface StatsGridProps {
  status: V2RayStatus;
  labels: {
    downSpeed: string;
    upSpeed: string;
    totalDown: string;
    totalUp: string;
  };
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatSpeed(bytesPerSec: number): string {
  return `${formatBytes(bytesPerSec)}/s`;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ status, labels }) => {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {/* Download Speed */}
      <div className="rounded-xl bg-slate-800/70 border border-slate-700/60 p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium">{labels.downSpeed}</span>
          <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
        </div>
        <span className="text-sm font-bold text-white font-mono">
          {formatSpeed(status.downloadSpeed)}
        </span>
      </div>

      {/* Upload Speed */}
      <div className="rounded-xl bg-slate-800/70 border border-slate-700/60 p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium">{labels.upSpeed}</span>
          <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <span className="text-sm font-bold text-white font-mono">
          {formatSpeed(status.uploadSpeed)}
        </span>
      </div>

      {/* Total Download */}
      <div className="rounded-xl bg-slate-800/70 border border-slate-700/60 p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium">{labels.totalDown}</span>
          <HardDriveDownload className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <span className="text-sm font-bold text-white font-mono">
          {formatBytes(status.download)}
        </span>
      </div>

      {/* Total Upload */}
      <div className="rounded-xl bg-slate-800/70 border border-slate-700/60 p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium">{labels.totalUp}</span>
          <HardDriveUpload className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <span className="text-sm font-bold text-white font-mono">
          {formatBytes(status.upload)}
        </span>
      </div>
    </div>
  );
};
