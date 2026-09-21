import React from 'react';
import { LayoutDashboard, Zap, Shield, Settings, ShieldCheck, HeartHandshake } from 'lucide-react';

interface NavigationProps {
  currentTab: number;
  onTabChange: (index: number) => void;
  labels: {
    dashboard: string;
    aether: string;
    tor: string;
    settings: string;
    privacy: string;
    contact: string;
  };
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange, labels }) => {
  const tabs = [
    { id: 'tab-btn-0', index: 0, label: labels.dashboard, icon: LayoutDashboard },
    { id: 'tab-btn-1', index: 1, label: labels.aether, icon: Zap },
    { id: 'tab-btn-2', index: 2, label: labels.tor, icon: Shield },
    { id: 'tab-btn-3', index: 3, label: labels.settings, icon: Settings },
    { id: 'tab-btn-4', index: 4, label: labels.privacy, icon: ShieldCheck },
    { id: 'tab-btn-5', index: 5, label: labels.contact, icon: HeartHandshake },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-safe transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center px-1 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.index;
          return (
            <button
              key={tab.index}
              id={tab.id}
              onClick={() => onTabChange(tab.index)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`relative p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-400" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
