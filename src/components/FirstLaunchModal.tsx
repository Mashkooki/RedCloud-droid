import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';
import { Language } from '../translations';

interface FirstLaunchModalProps {
  isOpen: boolean;
  onSelectLanguage: (lang: Language) => void;
}

export const FirstLaunchModal: React.FC<FirstLaunchModalProps> = ({ isOpen, onSelectLanguage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4">
          <Globe className="w-7 h-7" />
        </div>

        <h3 className="text-base font-bold text-white mb-1">Select App Language</h3>
        <p className="text-xs text-slate-400 mb-6">زبان برنامه را انتخاب نمایید</p>

        <div className="space-y-3">
          <button
            onClick={() => onSelectLanguage('fa')}
            className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 flex items-center justify-between transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇮🇷</span>
              <span className="text-sm font-bold text-white group-hover:text-blue-400">فارسی (Persian)</span>
            </div>
            <span className="text-xs text-slate-400">پیش‌فرض</span>
          </button>

          <button
            onClick={() => onSelectLanguage('en')}
            className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 flex items-center justify-between transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇬🇧</span>
              <span className="text-sm font-bold text-white group-hover:text-blue-400">English (US)</span>
            </div>
            <span className="text-xs text-slate-400">Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};
