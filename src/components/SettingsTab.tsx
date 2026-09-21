import React, { useState } from 'react';
import { ShieldCheck, FileText, BatteryCharging, Moon, Sun, Globe, Check } from 'lucide-react';
import { Language } from '../translations';

interface SettingsTabProps {
  bypassIran: boolean;
  onToggleBypassIran: () => void;
  onOpenLogs: () => void;
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  labels: {
    bypassIranTitle: string;
    bypassIranDesc: string;
    logsTitle: string;
    logsSubtitle: string;
    logsViewBtn: string;
    batteryOptTitle: string;
    batteryOptDesc: string;
    batteryOptBtn: string;
    themeSetting: string;
    themeDark: string;
    themeLight: string;
    langSetting: string;
  };
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  bypassIran,
  onToggleBypassIran,
  onOpenLogs,
  currentLang,
  onChangeLang,
  isDarkMode,
  onToggleTheme,
  labels,
}) => {
  const [batteryUnrestricted, setBatteryUnrestricted] = useState(false);

  return (
    <div className="space-y-3.5 pb-20 pt-2 px-4 max-w-md mx-auto animate-in fade-in duration-200">
      {/* Bypass Iran Switch Card */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white mb-0.5">{labels.bypassIranTitle}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{labels.bypassIranDesc}</p>
            </div>
          </div>
          <button
            id="bypass-iran-toggle-btn"
            onClick={onToggleBypassIran}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
              bypassIran ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <span className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
          </button>
        </div>
      </div>

      {/* System Logs & Diagnostics Card */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white mb-0.5">{labels.logsTitle}</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">{labels.logsSubtitle}</p>
          </div>
        </div>
        <button
          id="open-logs-modal-btn"
          onClick={onOpenLogs}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>{labels.logsViewBtn}</span>
        </button>
      </div>

      {/* Battery Optimization Card */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white mb-0.5">{labels.batteryOptTitle}</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">{labels.batteryOptDesc}</p>
          </div>
        </div>
        <button
          id="battery-unrestricted-btn"
          onClick={() => setBatteryUnrestricted(true)}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors ${
            batteryUnrestricted
              ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300'
              : 'bg-slate-700/70 hover:bg-slate-700 text-slate-200'
          }`}
        >
          {batteryUnrestricted ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>تنظیم شد / Unrestricted Active</span>
            </>
          ) : (
            <>
              <BatteryCharging className="w-4 h-4 text-amber-400" />
              <span>{labels.batteryOptBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Language & Theme Card */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 space-y-4">
        {/* Language Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">{labels.langSetting}</span>
          </div>
          <select
            id="settings-lang-select"
            value={currentLang}
            onChange={(e) => onChangeLang(e.target.value as Language)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="fa">فارسی</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="border-t border-slate-700/70" />

        {/* Theme Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="text-xs font-bold text-white">{labels.themeSetting}</span>
          </div>
          <button
            id="settings-theme-toggle-btn"
            onClick={onToggleTheme}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              isDarkMode ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <span className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          {isDarkMode ? labels.themeDark : labels.themeLight}
        </p>
      </div>
    </div>
  );
};
