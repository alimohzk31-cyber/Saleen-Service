import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Star, Shield, Moon, Sun, Globe, ArrowRight, X, AlertTriangle, Phone, Settings, ChevronRight, LogIn, Info } from 'lucide-react';
import { Theme, Language } from '../App';
import { AppSettings } from '../types';
import { InfoModal } from './InfoModal';

const translations = {
  ar: {
    title: "Saleen Service",
    subtitle: "كل الخدمات بمكان واحد",
    speed: "سرعة",
    security: "أمان",
    quality: "جودة",
    enter: "تفضل بالدخول",
    emergency: "طوارئ",
    areYouSure: "هل أنت متأكد من الاتصال بالطوارئ؟",
    yes: "نعم، اتصل",
    no: "إلغاء",
    settings: "الإعدادات",
    language: "اللغة",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    adminCode: "أدخل رمز الإدارة",
    submit: "تأكيد",
    invalidCode: "رمز غير صحيح",
    login: "تسجيل الدخول"
  },
  en: {
    title: "Saleen Service",
    subtitle: "All services in one place",
    speed: "Speed",
    security: "Security",
    quality: "Quality",
    enter: "Enter",
    emergency: "Emergency",
    areYouSure: "Are you sure you want to call emergency?",
    yes: "Yes, Call",
    no: "Cancel",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    adminCode: "Enter Admin Code",
    submit: "Submit",
    invalidCode: "Invalid Code",
    login: "Login"
  }
};

const sliderImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=800&h=400", title: { ar: "أطباء", en: "Doctors" } },
  { id: 2, src: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=800&h=400", title: { ar: "سباك", en: "Plumber" } },
  { id: 3, src: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&q=80&w=800&h=400", title: { ar: "نجار", en: "Carpenter" } },
  { id: 4, src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800&h=400", title: { ar: "كهربائي", en: "Electrician" } },
  { id: 5, src: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800&h=400", title: { ar: "ميكانيكي", en: "Mechanic" } },
  { id: 6, src: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800&h=400", title: { ar: "إنترنت", en: "Internet" } },
  { id: 7, src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800&h=400", title: { ar: "فنادق", en: "Hotels" } },
];

interface Props {
  language: Language;
  setLanguage: (l: Language) => void;
  onEnter: () => void;
  onAdminLogin: () => void;
  appSettings: AppSettings | null;
}

export function WelcomeScreen({ language, setLanguage, onEnter, onAdminLogin, appSettings }: Props) {
  const t = translations[language];
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adminClicks, setAdminClicks] = useState(0);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');

  const handleAdminClick = () => {
    const newClicks = adminClicks + 1;
    if (newClicks >= 5) {
      setAdminClicks(0);
      setShowAdminLogin(true);
    } else {
      setAdminClicks(newClicks);
      setTimeout(() => setAdminClicks(0), 3000);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: adminCode })
      });
      
      if (!response.ok) {
        throw new Error(t.invalidCode);
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      onAdminLogin();
      setShowAdminLogin(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-6 overflow-hidden w-full">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          {appSettings?.showSettingsIcon !== false && (
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-full bg-slate-800/20 backdrop-blur-md border border-slate-400/20 hover:bg-slate-800/30 transition-all"
              >
                <Settings className="w-6 h-6" />
              </button>
              
              <AnimatePresence>
                {showSettings && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-48 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/20 shadow-2xl p-2 z-50 overflow-hidden"
                    style={{
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="p-2 text-sm font-semibold opacity-70 border-b border-slate-300 dark:border-white/10">{t.language}</div>
                      <button onClick={() => setLanguage('ar')} className={`flex items-center gap-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 ${language === 'ar' ? 'bg-slate-300 dark:bg-white/20' : ''}`}>
                        <Globe className="w-4 h-4" /> العربية
                      </button>
                      <button onClick={() => setLanguage('en')} className={`flex items-center gap-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 ${language === 'en' ? 'bg-slate-300 dark:bg-white/20' : ''}`}>
                        <Globe className="w-4 h-4" /> English
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {appSettings?.showInfoIcon !== false && (
            <button 
              onClick={() => setShowInfo(true)}
              className="p-3 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all hover:scale-110 active:scale-95 shadow-lg shadow-blue-500/10 group"
              title={language === 'ar' ? 'عن التطبيق' : 'About App'}
            >
              <Info className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
          )}
        </div>

        {/* Small Emergency Button */}
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}
          onClick={() => setShowEmergencyConfirm(true)}
          className="relative group flex items-center justify-center px-6 py-2 rounded-full bg-red-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-red-500 transition-all hover:scale-105"
        >
          <div className="absolute inset-0 rounded-full border-2 border-red-400/50 animate-ping"></div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <span>911</span>
          </div>
        </motion.button>

        <button 
          onClick={handleAdminClick}
          className="p-3 rounded-full bg-slate-800/20 dark:bg-white/10 backdrop-blur-md border border-slate-400/20 dark:border-white/20 hover:bg-slate-800/30 dark:hover:bg-white/20 transition-all"
        >
          <Shield className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl z-10 my-8">
        
        {/* Slider */}
        <div className="w-full max-w-2xl aspect-[21/9] sm:aspect-[21/9] rounded-3xl overflow-hidden relative shadow-[0_0_40px_rgba(236,72,153,0.2)] mb-8 border border-slate-300 dark:border-white/10 bg-slate-200 dark:bg-slate-800">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={sliderImages[currentSlide].src}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Service"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-6">
            <motion.h3 
              key={`title-${currentSlide}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold text-white tracking-wide"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              {sliderImages[currentSlide].title[language]}
            </motion.h3>
          </div>
        </div>

        {/* Title & Subtitle */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl sm:text-7xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-500" style={{ filter: 'drop-shadow(0 0 10px rgba(236,72,153,0.3))' }}>
            Saleen Service
          </h1>
        </motion.div>

        {/* Emergency Confirm Modal */}
        <AnimatePresence>
          {showAdminLogin && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900 border-2 border-purple-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.4)] w-full max-w-md text-center"
              >
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-8">{t.adminCode}</h3>
                <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4">
                  <input 
                    type="password" 
                    value={adminCode} 
                    onChange={(e) => setAdminCode(e.target.value)} 
                    className="w-full py-4 px-6 rounded-2xl bg-white/10 border border-white/20 text-white text-center text-2xl tracking-widest outline-none focus:border-purple-500 transition-all"
                    placeholder="****"
                    autoFocus
                  />
                  {error && <p className="text-red-500 font-bold">{error}</p>}
                  <div className="flex gap-4 mt-4">
                    <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 py-4 rounded-2xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors">
                      {t.no}
                    </button>
                    <button type="submit" className="flex-1 py-4 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
                      {t.submit}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emergency Confirm Modal */}
        <AnimatePresence>
          {showEmergencyConfirm && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900 border-2 border-red-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.4)] w-full max-w-md text-center"
              >
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-8">{t.areYouSure}</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setShowEmergencyConfirm(false)} className="flex-1 py-4 rounded-2xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors">
                    {t.no}
                  </button>
                  <a href="tel:911" onClick={() => setShowEmergencyConfirm(false)} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" /> {t.yes}
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
        className="w-full max-w-4xl flex flex-col items-center gap-8 z-10"
      >
        {/* Chips */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
          {[t.speed, t.security, t.quality].map((chip, idx) => (
            <div key={idx} className="px-6 py-2 rounded-full bg-slate-800/10 dark:bg-white/5 backdrop-blur-sm border border-slate-400/20 dark:border-white/10 text-sm sm:text-base font-medium shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all">
              {chip}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Enter Button */}
          <button 
            onClick={onEnter}
            className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl sm:text-2xl text-white shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-all hover:scale-105 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            <span>{t.enter}</span>
            <ChevronRight className={`w-7 h-7 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </motion.div>


      <InfoModal 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
        language={language} 
      />
    </div>
  );
}
