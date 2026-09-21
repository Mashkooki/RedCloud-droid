import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Copy, Trash2, ArrowDown, Check } from 'lucide-react';
import { LogEntry } from '../types';
import { appLogger } from '../utils/logger';

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFa: boolean;
}

export const LogsModal: React.FC<LogsModalProps> = ({ isOpen, onClose, isFa }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const unsub = appLogger.subscribe((allLogs) => {
      setLogs([...allLogs]);
    });
    return unsub;
  }, [isOpen]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, logs.length]);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    const formatted = appLogger.formatAll();
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    appLogger.clear();
    setLogs([]);
  };

  const getTagColorClass = (tag: string) => {
    const t = tag.toUpperCase();
    if (t.includes('ERROR')) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (t.includes('TOR')) return 'text-purple-300 bg-purple-500/10 border-purple-500/30';
    if (t.includes('AETHER')) return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30';
    if (t.includes('V2RAY')) return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
    if (t.includes('L7-SCAN')) return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    if (t.includes('DNS')) return 'text-sky-300 bg-sky-500/10 border-sky-500/30';
    if (t.includes('TELEMETRY')) return 'text-pink-300 bg-pink-500/10 border-pink-500/30';
    if (t.includes('NATIVE')) return 'text-teal-300 bg-teal-500/10 border-teal-500/30';
    return 'text-blue-300 bg-blue-500/10 border-blue-500/30';
  };

  const filteredLogs = searchQuery
    ? logs.filter(
        (l) =>
          l.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : logs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[85vh] rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white">
              {isFa ? 'گزارشات و لاگ‌های سیستم' : 'System Logs & Diagnostics'}
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {logs.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyAll}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFa ? 'کپی تمام لاگ‌ها' : 'Copy All Logs'}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title={isFa ? 'پاک‌سازی' : 'Clear All'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ms-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFa ? 'جستجو در میان متن لاگ‌ها...' : 'Filter logs...'}
              className="w-full ps-9 pe-8 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Log Viewer Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3.5 space-y-1.5 bg-slate-950/90 font-mono text-[11px] select-text"
        >
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs font-sans">
              <span>{isFa ? 'هنوز هیچ لاگی ثبت نشده است.' : 'No logs available.'}</span>
            </div>
          ) : (
            filteredLogs.map((entry) => {
              const h = String(entry.time.getHours()).padStart(2, '0');
              const m = String(entry.time.getMinutes()).padStart(2, '0');
              const s = String(entry.time.getSeconds()).padStart(2, '0');
              const ms = String(entry.time.getMilliseconds()).padStart(3, '0');
              const timeStr = `${h}:${m}:${s}.${ms}`;

              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-1.5 leading-relaxed hover:bg-slate-900/50 p-1 rounded transition-colors"
                >
                  <span className="text-slate-500 shrink-0 select-none">[{timeStr}]</span>
                  <span
                    className={`px-1.5 py-0.2 rounded border text-[10px] font-bold shrink-0 ${getTagColorClass(
                      entry.tag
                    )}`}
                  >
                    {entry.tag}
                  </span>
                  <span
                    className={`break-all ${
                      entry.isError ? 'text-rose-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {entry.message}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Scroll to bottom FAB */}
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 end-4 p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
