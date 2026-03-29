import React, { useState, useEffect } from 'react';
import { Language, Theme } from '../App';
import { ArrowLeft, ArrowRight, Search, Stethoscope, Scale, BookOpen, Hammer, Wrench, Droplet, Zap, Car, Wifi, Hotel, Sparkles, Tv, LogOut, User as UserIcon, Baby, HeartPulse, Footprints, Disc, Utensils, ShoppingBag, Camera, Pill, Flame, Sprout, Snowflake, PaintRoller, Building2, Smartphone, Bike, Shirt, Scissors, Microscope, Cake, Croissant, Settings, Info, Globe, GraduationCap, Hospital, ShieldAlert, Shield, Fuel, Trophy, HardHat } from 'lucide-react';
import { categories } from '../data/mock';
import { BrowseScreen } from './BrowseScreen';
import { ProviderDetails } from './ProviderDetails';
import { ProfileSheet } from './ProfileSheet';
import { InfoModal } from './InfoModal';
import { Category, Provider, UserProfile, AppSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import GoldsmithsSection from './Goldsmiths/GoldsmithsSection';
import CarsSection from './Cars/CarsSection';
import { SupportModal } from './SupportModal';
import { Banknote } from 'lucide-react';

const iconMap: Record<string, any> = {
  Stethoscope, Scale, BookOpen, Hammer, Wrench, Droplet, Zap, Car, Wifi, Hotel, Sparkles, Tv, Baby, HeartPulse, Footprints, Disc, Utensils, ShoppingBag, Pill, Flame, Sprout, Snowflake, PaintRoller, Building2, Smartphone, Bike, Shirt, Scissors, Microscope, Cake, Croissant, GraduationCap, Hospital, ShieldAlert, Shield, Fuel, Trophy, HardHat
};

interface Props {
  onBack: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  allProviders: Provider[];
  setAllProviders: React.Dispatch<React.SetStateAction<Provider[]>>;
  currentUser: any | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<any | null>>;
  appSettings: AppSettings | null;
  isAdmin?: boolean;
}

export function MainApp({ onBack, language, setLanguage, allProviders, setAllProviders, currentUser, setCurrentUser, appSettings, isAdmin }: Props) {
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'details' | 'goldsmiths' | 'cars'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (currentUser) {
      const savedProfile = localStorage.getItem(`profile_${currentUser.id}`);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        setUserProfile({
          id: currentUser.id,
          name: currentUser.name,
          phone: currentUser.phone,
          birth: '',
          job: '',
          otherJobs: '',
          bio: '',
          city: '',
          createdAt: Date.now()
        });
      }
    }
  }, [currentUser]);

  const handleCategoryClick = (category: Category) => {
    if (category.id === 'goldsmiths') {
      setCurrentView('goldsmiths');
    } else if (category.id === 'cars') {
      setCurrentView('cars');
    } else {
      setSelectedCategory(category);
      setCurrentView('browse');
    }
  };

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setCurrentView('details');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
  };

  const handleBackToBrowse = () => {
    setCurrentView('browse');
    setSelectedProvider(null);
  };

  return (
    <div className="min-h-screen w-full relative">
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 sm:p-6 pt-8"
          >
            {/* Top Bar */}
            <div className="w-full flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-3 rounded-full bg-bg-app/50 backdrop-blur-md border border-slate-200 hover:bg-bg-app transition-all">
                  {language === 'ar' ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
                </button>

                {appSettings?.showSettingsIcon !== false && (
                  <div className="relative">
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-3 rounded-full bg-slate-800/20 backdrop-blur-md border border-slate-400/20 hover:bg-slate-800/30 transition-all hover:scale-110 active:scale-95"
                      title={language === 'ar' ? 'الإعدادات' : 'Settings'}
                    >
                      <Settings className="w-6 h-6" />
                    </button>
                    
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full mt-2 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-3 z-50 overflow-hidden"
                          style={{
                            boxShadow: '0 0 25px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="p-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                              {language === 'ar' ? 'اللغة' : 'Language'}
                            </div>
                            <button onClick={() => { setLanguage('ar'); setShowSettings(false); }} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors hover:bg-slate-800 ${language === 'ar' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}>
                              <Globe className="w-4 h-4" /> العربية
                            </button>
                            <button onClick={() => { setLanguage('en'); setShowSettings(false); }} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors hover:bg-slate-800 ${language === 'en' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}>
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
                    className="px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/10 font-bold text-sm"
                    title={language === 'ar' ? 'عن التطبيق' : 'About App'}
                  >
                    {language === 'ar' ? 'نبذة' : 'About'}
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {/* Support Button */}
                {appSettings?.walletInfo?.showWallet !== false && (
                  <button 
                    onClick={() => setShowSupport(true)}
                    className="px-4 py-2 rounded-full bg-yellow-400/20 backdrop-blur-md border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/30 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/10 font-bold text-sm relative"
                    title={language === 'ar' ? 'دعم التطبيق' : 'Support App'}
                  >
                    {language === 'ar' ? 'دعم' : 'Support'}
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  </button>
                )}

                {loginError && (
                  <div className="text-red-500 text-sm font-medium bg-red-500/10 px-3 py-1 rounded-full">
                    {loginError}
                  </div>
                )}
                
                {/* Profile Button */}
                {currentUser && (
                  <button 
                    onClick={() => setShowProfile(true)}
                    className="p-0 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-primary/20 w-12 h-12 overflow-hidden"
                    title={language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                  >
                    {userProfile?.image || currentUser.photoURL ? (
                      <img src={userProfile?.image || currentUser.photoURL || ''} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="w-6 h-6" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Greeting */}
            <div className="w-full text-center sm:text-start mb-8">
              <h1 className="text-3xl sm:text-5xl font-black mb-2">
                {language === 'ar' ? `مرحباً بك ${currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Saleen'}،` : `Welcome ${currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Saleen'},`}
              </h1>
              <p className="text-xl sm:text-2xl opacity-70 font-medium">
                {language === 'ar' ? 'شنو تحتاج اليوم؟' : 'What do you need today?'}
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full relative mb-12 group">
              <div className="absolute inset-0 bg-primary rounded-2xl blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center bg-card-bg dark:bg-card-bg-dark rounded-2xl border border-slate-200 dark:border-slate-700 p-2 shadow-lg">
                <Search className="w-6 h-6 text-slate-400 ml-3 mr-3" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث عن خدمة، طبيب، فني...' : 'Search for a service, doctor, technician...'}
                  className="flex-1 bg-transparent border-none outline-none text-lg p-2 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Categories Grid */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((cat) => {
                const Icon = iconMap[cat.iconName];
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(cat)}
                    className="flex flex-col items-center justify-center gap-4 p-6 rounded-3xl bg-card-bg dark:bg-card-bg-dark border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                      {Icon && <Icon className="w-8 h-8" />}
                    </div>
                    <span className="font-bold text-center text-sm sm:text-base text-slate-900 dark:text-white">
                      {cat.label[language]}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {currentView === 'browse' && selectedCategory && (
          <BrowseScreen 
            category={selectedCategory} 
            onBack={handleBackToHome} 
            onSelectProvider={handleProviderClick}
            language={language}
            allProviders={allProviders}
            setAllProviders={setAllProviders}
            currentUser={currentUser}
            isAdmin={isAdmin}
            setLanguage={setLanguage}
            appSettings={appSettings}
          />
        )}

        {currentView === 'details' && selectedProvider && (
          <ProviderDetails 
            provider={selectedProvider} 
            onBack={handleBackToBrowse}
            language={language}
            isAdmin={isAdmin}
            setAllProviders={setAllProviders}
          />
        )}

        {currentView === 'goldsmiths' && (
          <GoldsmithsSection onBack={handleBackToHome} />
        )}

        {currentView === 'cars' && (
          <CarsSection onBack={handleBackToHome} language={language} currentUser={currentUser} />
        )}
      </AnimatePresence>
      
      {showProfile && currentUser && (
        <ProfileSheet user={currentUser} onClose={() => setShowProfile(false)} language={language} setCurrentUser={setCurrentUser} />
      )}

      <SupportModal 
        isOpen={showSupport} 
        onClose={() => setShowSupport(false)} 
        language={language} 
        walletInfo={appSettings?.walletInfo}
      />

      <InfoModal 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
        language={language} 
      />
    </div>
  );
}
