import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Clock, User } from 'lucide-react';
import { Language } from '../App';

interface Visit {
  id: number;
  visitor_id: string;
  user_agent: string;
  ip_address: string;
  created_at: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  visits: Visit[];
  isAdmin?: boolean;
  onReset?: () => void;
}

export function VisitorsModal({ isOpen, onClose, language, visits = [], isAdmin, onReset }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border-2 border-[#00f0ff] rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.3)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#00f0ff]/20 flex justify-between items-center bg-gradient-to-r from-[#00f0ff]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#00f0ff]/20 text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    {language === 'ar' ? 'سجل الزوار' : 'Visitors Log'}
                  </h2>
                  <p className="text-xs text-[#00f0ff] font-bold uppercase tracking-widest opacity-70">
                    {language === 'ar' ? `إجمالي الزيارات: ${visits.length}` : `Total Visits: ${visits.length}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && onReset && (
                  <button 
                    onClick={onReset}
                    className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all active:scale-95"
                  >
                    {language === 'ar' ? 'تصفير' : 'Reset'}
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {visits.length === 0 ? (
                  <div className="text-center py-12 text-white/30 font-medium italic">
                    {language === 'ar' ? 'لا يوجد زوار بعد...' : 'No visitors yet...'}
                  </div>
                ) : (
                  visits.map((visit, index) => (
                    <motion.div
                      key={visit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00f0ff]/50 transition-all hover:bg-[#00f0ff]/5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-[#00f0ff] transition-colors">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                              {language === 'ar' ? `زائر #${visits.length - index}` : `Visitor #${visits.length - index}`}
                            </div>
                            <div className="text-[10px] text-white/40 font-mono mt-0.5 truncate max-w-[200px]">
                              {visit.user_agent}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 text-[#00f0ff] text-[10px] font-black uppercase tracking-tighter">
                            <Clock className="w-3 h-3" />
                            {new Date(visit.created_at).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-[10px] text-white/30 font-medium mt-1">
                            {new Date(visit.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/5 border-t border-white/10 text-center">
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                {language === 'ar' ? 'يتم تحديث البيانات تلقائياً' : 'Data updates automatically'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
