import React from 'react';
import { Send, Heart } from 'lucide-react';
import { telegramChannelUrl } from '../services/networkService';

interface ContactTabProps {
  onOpenDonate: () => void;
  labels: {
    title: string;
    telegram: string;
    donate: string;
  };
}

export const ContactTab: React.FC<ContactTabProps> = ({ onOpenDonate, labels }) => {
  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
      <h2 className="text-center text-xs font-bold text-slate-400 mb-2">
        {labels.title}
      </h2>

      <div className="grid grid-cols-2 gap-3.5">
        {/* Telegram Card */}
        <a
          id="contact-telegram-link"
          href={telegramChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-sky-500/30 p-5 flex flex-col items-center justify-center text-center transition-all group active:scale-95 shadow-sm"
        >
          <div className="w-14 h-14 rounded-full bg-sky-500/15 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform shadow-md shadow-sky-500/10">
            <Send className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
            {labels.telegram}
          </span>
        </a>

        {/* Donate Card */}
        <button
          id="contact-donate-btn"
          onClick={onOpenDonate}
          className="rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-amber-500/30 p-5 flex flex-col items-center justify-center text-center transition-all group active:scale-95 shadow-sm"
        >
          <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform shadow-md shadow-amber-500/10">
            <Heart className="w-7 h-7 fill-amber-400" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
            {labels.donate}
          </span>
        </button>
      </div>
    </div>
  );
};
