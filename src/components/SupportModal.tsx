import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, CheckCircle2, Wallet, CreditCard, Heart, Phone } from 'lucide-react';
import { Language } from '../App';
import { AppSettings } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const translations = {
  ar: {
    title: "الدعم المباشر",
    subtitle: "زين كاش",
    copy: "نسخ",
    copied: "تم النسخ",
    close: "إغلاق",
    supportNumber: "07736034126"
  },
  en: {
    title: "Direct Support",
    subtitle: "Zain Cash",
    copy: "Copy",
    copied: "Copied",
    close: "Close",
    supportNumber: "07736034126"
  }
};

export function SupportModal({ isOpen, onClose, language }: Props) {
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(t.supportNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[320px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{t.title}</h2>
                    <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">{t.subtitle}</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center gap-4">
                <code className="text-2xl font-mono font-black text-slate-900 dark:text-white tracking-tighter">
                  {t.supportNumber}
                </code>
                
                <div className="flex gap-2 w-full">
                  <a
                    href={`tel:${t.supportNumber}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    {language === 'ar' ? 'اتصال' : 'Call'}
                  </a>
                  <button
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all active:scale-95 ${
                      copied 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        {t.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t.copy}
                      </>
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                {t.close}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
