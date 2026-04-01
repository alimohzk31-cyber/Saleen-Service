import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, MapPin, Phone, Star } from 'lucide-react';
import { Language } from '../App';
import { Provider } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  providers: Provider[];
  onSelectProvider: (provider: Provider) => void;
}

export function NewAdditionsModal({ isOpen, onClose, language, providers = [], onSelectProvider }: Props) {
  // Filter providers added in the last 48 hours
  const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;
  const now = Date.now();
  
  const newAdditions = providers.filter(p => {
    if (!p.createdAt) return false;
    return (now - p.createdAt) <= FORTY_EIGHT_HOURS;
  }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[85vh] bg-card-bg dark:bg-card-bg-dark rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {language === 'ar' ? 'الإضافات الجديدة' : 'New Additions'}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  {language === 'ar' ? 'أحدث الخدمات المضافة خلال 48 ساعة' : 'Latest services added in the last 48 hours'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {newAdditions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Clock className="w-16 h-16 mb-4" />
                <p className="text-xl font-bold">
                  {language === 'ar' ? 'لا توجد إضافات جديدة حالياً' : 'No new additions currently'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {newAdditions.map((provider) => (
                  <motion.div
                    key={provider.id}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      onSelectProvider(provider);
                      onClose();
                    }}
                    className="group cursor-pointer bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={provider.image} 
                        alt={provider.name[language]} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {language === 'ar' ? 'جديد' : 'New'}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{provider.name[language]}</h3>
                        <p className="text-slate-300 text-sm font-medium line-clamp-1">{provider.specialty[language]}</p>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="line-clamp-1">{provider.locationName[language]}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{provider.rating}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                          <Phone className="w-4 h-4" />
                          <span dir="ltr">{provider.phone}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
