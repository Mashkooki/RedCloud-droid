import React, { useState } from 'react';
import { X, Copy, Check, Heart, ShieldAlert } from 'lucide-react';
import { usdtBnbAddress } from '../services/networkService';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  labels: {
    title: string;
    desc: string;
    copyBtn: string;
    walletLabel: string;
    assetLabel: string;
    networkLabel: string;
    copiedMsg: string;
    close: string;
  };
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, labels }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(usdtBnbAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/30 p-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
            <Heart className="w-7 h-7 fill-amber-400" />
          </div>

          <h3 className="text-base font-bold text-white mb-1.5">{labels.title}</h3>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed px-1">
            {labels.desc}
          </p>

          <div className="w-full rounded-2xl bg-slate-800/90 border border-slate-700/80 p-3.5 mb-4 text-start space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{labels.assetLabel}</span>
              <span className="font-semibold text-emerald-400">USDT</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{labels.networkLabel}</span>
              <span className="font-semibold text-amber-400">BEP20</span>
            </div>
            <div className="pt-2 border-t border-slate-700">
              <span className="text-[11px] text-slate-400 block mb-1">{labels.walletLabel}</span>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-700/50 font-mono text-[11px] text-amber-200 break-all select-all">
                {usdtBnbAddress}
              </div>
            </div>
          </div>

          <button
            id="copy-donation-address-btn"
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-amber-500/20"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>{labels.copiedMsg}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{labels.copyBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
