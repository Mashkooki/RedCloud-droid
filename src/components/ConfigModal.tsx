import React, { useState } from 'react';
import { X, ClipboardPaste, Check, AlertCircle } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  initialConfig: string;
  onClose: () => void;
  onSave: (config: string) => void;
  labels: {
    title: string;
    pasteBtn: string;
    saveBtn: string;
    emptyClipboard: string;
    configSaved: string;
    configErr: string;
  };
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  initialConfig,
  onClose,
  onSave,
  labels,
}) => {
  const [configText, setConfigText] = useState(initialConfig);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setConfigText(text.trim());
        setErrorMsg(null);
      } else {
        setErrorMsg(labels.emptyClipboard);
      }
    } catch {
      setErrorMsg(labels.emptyClipboard);
    }
  };

  const handleSave = () => {
    const trimmed = configText.trim();
    if (!trimmed) {
      setErrorMsg(labels.configErr);
      return;
    }

    // Check basic protocol formats: vless://, vmess://, trojan://, ss:// or plain worker domain
    if (
      trimmed.startsWith('vless://') ||
      trimmed.startsWith('vmess://') ||
      trimmed.startsWith('trojan://') ||
      trimmed.startsWith('ss://') ||
      trimmed.includes('.workers.dev') ||
      trimmed.includes('uuid')
    ) {
      onSave(trimmed);
      onClose();
    } else {
      setErrorMsg(labels.configErr);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-sm font-bold text-white mb-3 pe-8">{labels.title}</h3>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mb-4">
          <textarea
            value={configText}
            onChange={(e) => {
              setConfigText(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="vless://uuid@domain:443?path=...#remark"
            dir="ltr"
            rows={5}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-700/80 p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePaste}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ClipboardPaste className="w-4 h-4 text-blue-400" />
            <span>{labels.pasteBtn}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-600/30"
          >
            <Check className="w-4 h-4" />
            <span>{labels.saveBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
