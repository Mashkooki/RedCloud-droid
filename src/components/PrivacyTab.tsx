import React from 'react';
import { Shield } from 'lucide-react';

interface PrivacyTabProps {
  title: string;
  text: string;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({ title, text }) => {
  return (
    <div className="pb-20 pt-3 px-4 max-w-md mx-auto animate-in fade-in duration-200">
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 backdrop-blur">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-white">{title}</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed text-justify">
          {text}
        </p>
      </div>
    </div>
  );
};
