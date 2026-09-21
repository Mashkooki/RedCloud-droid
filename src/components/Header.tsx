import React from 'react';
import { Shield, Moon, Sun, Globe } from 'lucide-react';
import { ActiveEngine } from '../types';
import { Language } from '../translations';

interface HeaderProps {
  currentLang: Language;
  isDarkMode: boolean;
  activeEngine: ActiveEngine;
  onToggleTheme: () => void;
  onChangeLang: (lang: Language) => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  isDarkMode,
  activeEngine,
  onToggleTheme,
  onChangeLang,
  title,
}) => {
  const getEngineBadge = () => {
    switch (activeEngine) {
      case 'dashboard':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">V2Ray Active</span>;
      case 'aether':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium">Aether Active</span>;
      case 'tor':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">Tor Active</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 px-4 py-3 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 p-1.5">
            <img 
              src="/assets/images/logo.png" 
              alt="RedCloud Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback icon if logo image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }} 
            />
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">{title}</h1>
              {getEngineBadge()}
            </div>
            <p className="text-[10px] text-slate-400 leading-none">v1.2.2 • Multi-Core Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Language Toggle Button */}
          <button
            id="lang-toggle-btn"
            onClick={() => onChangeLang(currentLang === 'fa' ? 'en' : 'fa')}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Switch Language"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>{currentLang === 'fa' ? 'EN' : 'فا'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
