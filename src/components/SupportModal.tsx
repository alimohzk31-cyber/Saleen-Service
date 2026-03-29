import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, CheckCircle2, Wallet, CreditCard, Heart } from 'lucide-react';
import { Language } from '../App';
import { AppSettings } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  walletInfo?: AppSettings['walletInfo'];
}

const translations = {
  ar: {
    title: "دعم التطبيق",
    subtitle: "مساهمتك تساعدنا على الاستمرار وتطوير الخدمات",
    zainCash: "زين كاش",
    masterCard: "ماستر كارد",
    copy: "نسخ",
    copied: "تم النسخ",
    close: "إغلاق",
    zainNumber: "+964 770 123 4567",
    masterNumber: "4234 5678 9012 3456"
  },
  en: {
    title: "Support the App",
    subtitle: "Your contribution helps us continue and develop services",
    zainCash: "Zain Cash",
    masterCard: "MasterCard",
    copy: "Copy",
    copied: "Copied",
    close: "Close",
    zainNumber: "+964 770 123 4567",
    masterNumber: "4234 5678 9012 3456"
  }
};

export function SupportModal({ isOpen, onClose, language, walletInfo }: Props) {
  const t = translations[language];
  const [copiedField, setCopiedField] = useState<'zain' | 'master' | null>(null);

  const zainNumber = walletInfo?.zainCash || t.zainNumber;
  const masterNumber = walletInfo?.masterCard || t.masterNumber;

  const handleCopy = (text: string, field: 'zain' | 'master') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Header Decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl -z-10" />
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t.subtitle}</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Zain Cash */}
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 group transition-all hover:border-purple-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Wallet className="w-5 h-5 text-purple-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">{t.zainCash}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <code className="text-lg font-mono font-bold text-slate-900 dark:text-white tracking-wider">
                      {zainNumber}
                    </code>
                    <button
                      onClick={() => handleCopy(zainNumber, 'zain')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        copiedField === 'zain' 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {copiedField === 'zain' ? (
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

                {/* MasterCard */}
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 group transition-all hover:border-blue-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">{t.masterCard}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <code className="text-lg font-mono font-bold text-slate-900 dark:text-white tracking-wider">
                      {masterNumber}
                    </code>
                    <button
                      onClick={() => handleCopy(masterNumber, 'master')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        copiedField === 'master' 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {copiedField === 'master' ? (
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
              </div>

              <button
                onClick={onClose}
                className="w-full mt-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-all active:scale-[0.98]"
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
