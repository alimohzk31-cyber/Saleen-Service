import React, { useState, useEffect, useMemo } from 'react';
import { Language, Theme } from '../App';
import { ArrowLeft, ArrowRight, Search, Stethoscope, Scale, BookOpen, Hammer, Wrench, Droplet, Zap, Car, Wifi, Hotel, Sparkles, Tv, LogOut, User as UserIcon, Baby, HeartPulse, Footprints, Disc, Utensils, ShoppingBag, Camera, Pill, Flame, Sprout, Snowflake, PaintRoller, Building2, Smartphone, Bike, Shirt, Scissors, Microscope, Cake, Croissant, Info, Globe, GraduationCap, Hospital, ShieldAlert, Shield, Fuel, Trophy, HardHat, MoonStar, Grid, X, BrainCircuit, AlertTriangle, Menu } from 'lucide-react';
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
import { NewAdditionsModal } from './NewAdditionsModal';

import { SuggestionsModal } from './SuggestionsModal';
import { Banknote, Clock, MapPin } from 'lucide-react';

const iconMap: Record<string, any> = {
  Stethoscope, Scale, BookOpen, Hammer, Wrench, Droplet, Zap, Car, Wifi, Hotel, Sparkles, Tv, Baby, HeartPulse, Footprints, Disc, Utensils, ShoppingBag, Pill, Flame, Sprout, Snowflake, PaintRoller, Building2, Smartphone, Bike, Shirt, Scissors, Microscope, Cake, Croissant, GraduationCap, Hospital, ShieldAlert, Shield, Fuel, Trophy, HardHat, MoonStar
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
  location: { lat: number; lng: number } | null;
  locationError: string | null;
  isMockMode?: boolean;
}

export function MainApp({ onBack, language, setLanguage, allProviders, setAllProviders, currentUser, setCurrentUser, appSettings, isAdmin, location, locationError, isMockMode }: Props) {
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'details' | 'goldsmiths' | 'cars'>(() => {
    return (localStorage.getItem('currentView') as any) || 'home';
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(() => {
    const saved = localStorage.getItem('selectedCategory');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(() => {
    const saved = localStorage.getItem('selectedProvider');
    return saved ? JSON.parse(saved) : null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showNewAdditions, setShowNewAdditions] = useState(false);
  const [showVisitorDropdown, setShowVisitorDropdown] = useState(false);
  const [myVisitTime, setMyVisitTime] = useState<string | null>(null);

  useEffect(() => {
    const time = localStorage.getItem('my_visit_time');
    if (time) {
      setMyVisitTime(time);
    } else {
      const newTime = new Date().toISOString();
      localStorage.setItem('my_visit_time', newTime);
      setMyVisitTime(newTime);
    }
  }, []);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchHidden, setIsSearchHidden] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
    if (selectedCategory) {
      localStorage.setItem('selectedCategory', JSON.stringify(selectedCategory));
    } else {
      localStorage.removeItem('selectedCategory');
    }
    if (selectedProvider) {
      localStorage.setItem('selectedProvider', JSON.stringify(selectedProvider));
    } else {
      localStorage.removeItem('selectedProvider');
    }
  }, [currentView, selectedCategory, selectedProvider]);

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 1) return { categories: [], providers: [] };
    
    const query = searchQuery.toLowerCase();
    
    const filteredCats = categories.filter(cat => 
      cat.label.ar.toLowerCase().includes(query) || 
      cat.label.en.toLowerCase().includes(query)
    );
    
    const filteredProviders = allProviders.filter(p => 
      p.name.ar.toLowerCase().includes(query) || 
      p.name.en.toLowerCase().includes(query) ||
      p.specialty.ar.toLowerCase().includes(query) ||
      p.specialty.en.toLowerCase().includes(query)
    );
    
    return { categories: filteredCats, providers: filteredProviders };
  }, [searchQuery, allProviders]);

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
    // Increment views locally
    if (setAllProviders) {
      setAllProviders(prev => prev.map(p => 
        p.id === provider.id ? { ...p, views: (p.views || 0) + 1 } : p
      ));
    }
    // Increment views on server
    fetch(`/api/services/${provider.id}/view`, { method: 'PATCH' }).catch(err => console.error('Error incrementing views:', err));
    
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

  const activeCategoriesCount = new Set(allProviders?.map(p => p.categoryId)).size;
  const servicesCount = allProviders?.length || 0;

  return (
    <div className="min-h-screen w-full relative bg-slate-950">
      {isMockMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 p-2 text-center relative z-[200]">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-amber-500 text-xs sm:text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {language === 'ar' 
                ? 'تنبيه: التطبيق يعمل في وضع التجربة. البيانات لن تُحفظ بشكل دائم. يرجى ضبط DATABASE_URL.' 
                : 'Warning: Running in Mock Mode. Data will not be persisted. Please set DATABASE_URL.'}
            </span>
          </div>
        </div>
      )}
      {/* Global Header */}
      <div className="sticky top-0 z-[100] w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          {/* Top Bar */}
          <div className="w-full flex flex-wrap justify-between items-center gap-4 relative z-[60]">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {isAdmin && (
                <button 
                  onClick={() => setMenuOpen(true)}
                  className="p-3 rounded-full bg-slate-800/50 backdrop-blur-md border border-slate-700 hover:bg-slate-800 transition-all hover:scale-110 active:scale-95"
                  title={language === 'ar' ? 'القائمة' : 'Menu'}
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}

              {currentView !== 'home' && (
                <button 
                  onClick={currentView === 'browse' ? handleBackToHome : (currentView === 'details' ? handleBackToBrowse : handleBackToHome)} 
                  className="p-2 transition-all hover:scale-110 active:scale-95"
                >
                  {language === 'ar' ? <ArrowRight className="w-7 h-7 text-white" /> : <ArrowLeft className="w-7 h-7 text-white" />}
                </button>
              )}
              
              {currentView === 'home' && (
                <button onClick={onBack} className="p-2 transition-all hover:scale-110 active:scale-95">
                  {language === 'ar' ? <ArrowRight className="w-7 h-7 text-white" /> : <ArrowLeft className="w-7 h-7 text-white" />}
                </button>
              )}

              {currentView === 'home' && !isAdmin && appSettings?.showInfoIcon !== false && (
                <button 
                  onClick={() => setShowInfo(true)}
                  className="px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/10 font-bold text-sm"
                  title={language === 'ar' ? 'عن التطبيق' : 'About App'}
                >
                  {language === 'ar' ? 'نبذة' : 'About'}
                </button>
              )}
              
              {currentView === 'home' && !isAdmin && (
                <button 
                  onClick={() => setShowNewAdditions(true)}
                  className="p-2.5 rounded-full bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 transition-all hover:scale-110 active:scale-95 shadow-lg shadow-amber-500/5"
                  title={language === 'ar' ? 'الإضافات الجديدة' : 'New Additions'}
                >
                  <Clock className="w-5 h-5" />
                </button>
              )}

              {currentView === 'home' && !isAdmin && (
                <button 
                  onClick={() => setShowSuggestions(true)}
                  className="relative p-3 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-md border border-indigo-400/40 text-indigo-400 hover:from-indigo-500/30 hover:to-purple-600/30 transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.3)] group overflow-hidden"
                  title={language === 'ar' ? 'اقتراحات ذكية (AI)' : 'Smart AI Suggestions'}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <BrainCircuit className="w-6 h-6 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500 text-[8px] font-black text-white items-center justify-center">AI</span>
                  </span>
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {/* Support Button */}
              {currentView === 'home' && !isAdmin && appSettings?.walletInfo?.showWallet !== false && (
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
              {currentView === 'home' && !isAdmin && currentUser && (
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

          {/* Search Bar */}
          {!isSearchHidden && (
            <div className="w-full max-w-md mx-auto relative z-50 group">
              {/* Services Count Badge */}
              <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#ff00c8] text-white text-[10px] font-black shadow-[0_0_10px_#ff00c8] z-10 flex items-center gap-1">
                <Hammer className="w-2.5 h-2.5" />
                <span>{servicesCount}</span>
              </div>
              
              <div className="absolute inset-0 bg-[#00f0ff] rounded-xl blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center bg-slate-900/80 backdrop-blur-md rounded-xl border-2 border-[#00f0ff] p-0.5 shadow-[0_0_10px_rgba(0,240,255,0.2)] focus-within:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
                <Search className="w-4 h-4 text-[#00f0ff] ml-3 mr-2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث عن قسم أو خدمة...' : 'Search for a category or service...'}
                  className="flex-1 bg-transparent border-none outline-none text-sm p-2 text-white placeholder:text-slate-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors mr-1"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchQuery.trim().length >= 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-slate-900/95 backdrop-blur-xl border border-[#00f0ff]/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
                  >
                    {searchResults.categories.length === 0 && searchResults.providers.length === 0 ? (
                      <div className="p-10 text-center text-slate-500">
                        {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                      </div>
                    ) : (
                      <div className="p-2">
                        {searchResults.categories.length > 0 && (
                          <div className="mb-4">
                            <div className="px-4 py-2 text-[10px] font-black text-[#00f0ff] uppercase tracking-[0.2em] opacity-50">
                              {language === 'ar' ? 'الأقسام' : 'Categories'}
                            </div>
                            {searchResults.categories.map(cat => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  handleCategoryClick(cat);
                                  setSearchQuery('');
                                }}
                                className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-start group"
                              >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                                  <Grid className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                                  {cat.label[language]}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {searchResults.providers.length > 0 && (
                          <div>
                            <div className="px-4 py-2 text-[10px] font-black text-[#ff00c8] uppercase tracking-[0.2em] opacity-50">
                              {language === 'ar' ? 'الخدمات' : 'Services'}
                            </div>
                            {searchResults.providers.map(p => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  handleProviderClick(p);
                                  setSearchQuery('');
                                }}
                                className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-start group"
                              >
                                <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                <div>
                                  <div className="font-bold text-white group-hover:text-[#ff00c8] transition-colors">
                                    {p.name[language]}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {p.specialty[language]}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 sm:p-6 pt-8"
          >
            {/* Greeting */}
            <div className="w-full text-center sm:text-start mb-8">
              <h1 className="text-3xl sm:text-5xl font-black mb-2">
                {language === 'ar' ? `مرحباً بك ${currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Saleen'}،` : `Welcome ${currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Saleen'},`}
              </h1>
              <p className="text-xl sm:text-2xl opacity-70 font-medium">
                {language === 'ar' ? 'شنو تحتاج اليوم؟' : 'What do you need today?'}
              </p>
            </div>

            {/* Categories Grid */}
            <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
              {categories.map((cat) => {
                const Icon = iconMap[cat.iconName];
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(cat)}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-card-bg dark:bg-card-bg-dark border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md`}>
                      {Icon && <Icon className="w-5 h-5" />}
                    </div>
                    <span className="font-bold text-center text-[10px] sm:text-xs text-slate-900 dark:text-white line-clamp-1">
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
            onSelectCategory={handleCategoryClick}
            language={language}
            allProviders={allProviders}
            setAllProviders={setAllProviders}
            currentUser={currentUser}
            isAdmin={isAdmin}
            setLanguage={setLanguage}
            appSettings={appSettings}
            setIsSearchHidden={setIsSearchHidden}
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
          <GoldsmithsSection onBack={handleBackToHome} setIsSearchHidden={setIsSearchHidden} />
        )}

        {currentView === 'cars' && (
          <CarsSection onBack={handleBackToHome} language={language} currentUser={currentUser} setIsSearchHidden={setIsSearchHidden} />
        )}
      </AnimatePresence>
      
      {showProfile && currentUser && (
        <ProfileSheet user={currentUser} onClose={() => setShowProfile(false)} language={language} setCurrentUser={setCurrentUser} />
      )}

      <SupportModal 
        isOpen={showSupport} 
        onClose={() => setShowSupport(false)} 
        language={language} 
      />

      <NewAdditionsModal
        isOpen={showNewAdditions}
        onClose={() => setShowNewAdditions(false)}
        language={language}
        providers={allProviders}
        onSelectProvider={handleProviderClick}
      />



      <InfoModal 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
        language={language} 
      />

      <SuggestionsModal
        isOpen={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        allProviders={allProviders}
        location={location}
        language={language}
        onSelectProvider={handleProviderClick}
      />

      {/* Admin Side Menu Overlay */}
      <AnimatePresence>
        {isAdmin && menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: language === 'ar' ? -300 : 300 }}
              animate={{ x: 0 }}
              exit={{ x: language === 'ar' ? -300 : 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-72 bg-slate-900/95 backdrop-blur-xl border-${language === 'ar' ? 'r' : 'l'} border-slate-800 shadow-2xl z-[201] p-6 flex flex-col`}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                  {language === 'ar' ? 'قائمة التحكم' : 'Control Menu'}
                </h2>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Support */}
                {appSettings?.walletInfo?.showWallet !== false && (
                  <button
                    onClick={() => { setShowSupport(true); setMenuOpen(false); }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-all text-right w-full"
                  >
                    <div className="w-10 h-10 rounded-xl bg-yellow-500 text-white flex items-center justify-center shrink-0">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <span className="font-bold">{language === 'ar' ? 'الدعم المالي' : 'Financial Support'}</span>
                  </button>
                )}

                {/* Info */}
                {appSettings?.showInfoIcon !== false && (
                  <button
                    onClick={() => { setShowInfo(true); setMenuOpen(false); }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all text-right w-full"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Info className="w-5 h-5" />
                    </div>
                    <span className="font-bold">{language === 'ar' ? 'عن التطبيق' : 'About App'}</span>
                  </button>
                )}

                {/* AI Suggestions */}
                <button
                  onClick={() => { setShowSuggestions(true); setMenuOpen(false); }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition-all text-right w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <span className="font-bold">{language === 'ar' ? 'اقتراحات الذكاء الاصطناعي' : 'AI Suggestions'}</span>
                </button>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-800">
                <p className="text-xs text-center text-slate-500">
                  {language === 'ar' ? 'وضع الإدارة نشط' : 'Admin Mode Active'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
