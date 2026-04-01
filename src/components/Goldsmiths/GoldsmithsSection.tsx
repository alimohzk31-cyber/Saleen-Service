import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, ArrowLeft } from 'lucide-react';
import GoldsmithsBrowseScreen from './GoldsmithsBrowseScreen';

const goldTypes = [
  { id: 1, name: 'ذهب إماراتي', flag: '🇦🇪', image: 'https://picsum.photos/seed/emirati/400/300' },
  { id: 2, name: 'ذهب عراقي', flag: '🇮🇶', image: 'https://picsum.photos/seed/iraqi/400/300' },
  { id: 3, name: 'ذهب برازيلي', flag: '🇧🇷', image: 'https://picsum.photos/seed/brazilian/400/300' },
];

const GoldsmithsSection = ({ onBack, setIsSearchHidden }: { onBack: () => void, setIsSearchHidden?: (hidden: boolean) => void }) => {
  const [showBrowse, setShowBrowse] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  React.useEffect(() => {
    if (setIsSearchHidden) {
      setIsSearchHidden(showJoinForm);
    }
    return () => {
      if (setIsSearchHidden) setIsSearchHidden(false);
    };
  }, [showJoinForm, setIsSearchHidden]);

  return (
    <AnimatePresence mode="wait">
      {!showBrowse ? (
        <motion.div 
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-slate-950 text-amber-500 p-6"
        >
          <button onClick={onBack} className="mb-6 p-2 rounded-full bg-slate-900 border border-amber-700">
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-8 text-amber-400"
          >
            صياغة الذهب
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goldTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-900 rounded-xl overflow-hidden border border-amber-700 shadow-[0_0_15px_rgba(217,119,6,0.3)]"
              >
                <img src={type.image} alt={type.name} className="w-full h-48 object-cover" />
                <div className="p-4 text-center">
                  <h2 className="text-2xl font-semibold">{type.flag} {type.name}</h2>
                  <button 
                    onClick={() => setShowBrowse(true)}
                    className="mt-4 bg-amber-600 text-slate-950 px-4 py-2 rounded-lg font-bold hover:bg-amber-500"
                  >
                    عرض المنتجات
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setShowJoinForm(true)}
              className="bg-transparent border-2 border-amber-500 text-amber-500 px-8 py-3 rounded-full font-bold hover:bg-amber-500 hover:text-slate-950 transition"
            >
              <Store className="inline mr-2" /> انضمام كتاجر
            </button>
          </div>

          {showJoinForm && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-slate-900 border border-amber-700 rounded-3xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-amber-400">انضمام كتاجر ذهب</h2>
                <p className="text-amber-500/70 mb-6">يرجى التواصل مع الإدارة لتفعيل حسابك كتاجر في قسم الذهب.</p>
                <button 
                  onClick={() => setShowJoinForm(false)}
                  className="w-full py-3 rounded-xl bg-amber-600 text-slate-950 font-bold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="browse"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <GoldsmithsBrowseScreen onBack={() => setShowBrowse(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoldsmithsSection;
