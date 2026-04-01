import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, TrendingUp, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Provider } from '../types';
import { Language } from '../App';
import { calculateDistance, Location } from '../utils/geo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  allProviders: Provider[];
  location: Location | null;
  language: Language;
  onSelectProvider: (provider: Provider) => void;
}

export function SuggestionsModal({ isOpen, onClose, allProviders, location, language, onSelectProvider }: Props) {
  const popularProviders = useMemo(() => {
    return [...allProviders]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [allProviders]);

  const nearbyProviders = useMemo(() => {
    if (!location) return [];
    return allProviders
      .map(p => ({
        ...p,
        distance: calculateDistance(location.lat, location.lng, p.lat, p.lng)
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5);
  }, [allProviders, location]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900 border-2 border-[#00ffcc] rounded-3xl shadow-[0_0_30px_rgba(0,255,204,0.3)] overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#00ffcc]/10 via-transparent to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 bg-[#00ffcc] text-slate-950 text-[10px] font-black uppercase tracking-tighter rounded-bl-xl shadow-lg">
                AI Powered
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00ffcc] blur-md opacity-30 animate-pulse"></div>
                  <div className="relative p-2 rounded-xl bg-[#00ffcc]/20 text-[#00ffcc] border border-[#00ffcc]/30">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    {language === 'ar' ? 'اقتراحات ذكية' : 'Smart Suggestions'}
                    <span className="px-1.5 py-0.5 rounded bg-[#00ffcc]/20 text-[#00ffcc] text-[10px] border border-[#00ffcc]/30">AI</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {language === 'ar' ? 'خوارزميات ذكية تختار الأفضل لك' : 'Smart algorithms selecting the best for you'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Popular Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#ff00c8]" />
                  <h3 className="text-lg font-bold text-white">
                    {language === 'ar' ? 'الأكثر استخداماً' : 'Most Popular'}
                  </h3>
                </div>
                <div className="grid gap-3">
                  {popularProviders.map((p) => (
                    <button
                      key={`popular-${p.id}`}
                      onClick={() => {
                        onSelectProvider(p);
                        onClose();
                      }}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ff00c8]/50 hover:bg-[#ff00c8]/5 transition-all text-start group"
                    >
                      <img src={p.image} alt="" className="w-14 h-14 rounded-xl object-cover shadow-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate group-hover:text-[#ff00c8] transition-colors">
                          {p.name[language]}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {p.specialty[language]}
                        </p>
                      </div>
                      <div className="text-[#ff00c8] opacity-0 group-hover:opacity-100 transition-opacity">
                        {language === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Nearby Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#00f0ff]" />
                  <h3 className="text-lg font-bold text-white">
                    {language === 'ar' ? 'القريبة منك' : 'Nearby Services'}
                  </h3>
                </div>
                {!location ? (
                  <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-slate-700">
                    <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      {language === 'ar' ? 'يرجى تفعيل الموقع لعرض الخدمات القريبة' : 'Please enable location to see nearby services'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {nearbyProviders.map((p) => (
                      <button
                        key={`nearby-${p.id}`}
                        onClick={() => {
                          onSelectProvider(p);
                          onClose();
                        }}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 transition-all text-start group"
                      >
                        <img src={p.image} alt="" className="w-14 h-14 rounded-xl object-cover shadow-lg" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white truncate group-hover:text-[#00f0ff] transition-colors">
                            {p.name[language]}
                          </h4>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <MapPin className="w-3 h-3" />
                            <span>{(p as any).distance?.toFixed(1)} km</span>
                          </div>
                        </div>
                        <div className="text-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity">
                          {language === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-800/50 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI Powered Suggestions'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
