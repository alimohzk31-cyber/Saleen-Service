import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Star, 
  Car, 
  Building2, 
  Plus, 
  UserPlus, 
  Edit, 
  Trash,
  HardHat,
  Droplets,
  PaintRoller,
  Zap,
  Snowflake,
  ShieldCheck,
  Grid,
  Hammer,
  Brain,
  Microscope,
  Scissors as ScissorsIcon,
  Stethoscope as StethoscopeIcon,
  DollarSign,
  Palmtree,
  Building,
  Soup,
  Pizza,
  Fish,
  Cookie,
  Croissant,
  Cake as CakeIcon,
  Candy,
  Settings,
  Info,
  Banknote,
  Globe
} from 'lucide-react';

const subcategoryIcons: Record<string, any> = {
  contracting: HardHat,
  plumbing: Droplets,
  painting: PaintRoller,
  electrical: Zap,
  hvac: Snowflake,
  insulation: ShieldCheck,
  ceramic: Grid,
  blacksmith: Hammer,
  dental: StethoscopeIcon,
  surgical: ScissorsIcon,
  psychiatric: Brain,
  laser: Zap,
  luxury: Star,
  budget: DollarSign,
  resorts: Palmtree,
  apartments: Building,
  oriental: Soup,
  western: Pizza,
  fastfood: Zap,
  seafood: Fish,
  arabic: Cookie,
  pastries: Croissant,
  cakes: CakeIcon,
  chocolate: Candy,
};
import { AddServiceForm } from './AddServiceForm';
import { SupportModal } from './SupportModal';
import { InfoModal } from './InfoModal';
import { Language } from '../App';
import { Category, Provider } from '../types';
import { useGeolocation, calculateDistance } from '../utils/geo';

interface Props {
  category: Category;
  onBack: () => void;
  onSelectProvider: (provider: Provider) => void;
  language: Language;
  allProviders: Provider[];
  setAllProviders?: React.Dispatch<React.SetStateAction<Provider[]>>;
  currentUser: any | null;
  isAdmin?: boolean;
  onJoinClick?: () => void;
  setLanguage: (lang: Language) => void;
  appSettings: any;
}

export function BrowseScreen({ 
  category, 
  onBack, 
  onSelectProvider, 
  language, 
  allProviders, 
  setAllProviders, 
  currentUser, 
  isAdmin, 
  onJoinClick,
  setLanguage,
  appSettings
}: Props) {
  const [activeTab, setActiveTab] = useState('all');
  const { location } = useGeolocation();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showAddService, setShowAddService] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [schoolType, setSchoolType] = useState<'public' | 'private' | 'kindergarten' | 'all'>('all');
  const [schoolLevel, setSchoolLevel] = useState<'primary' | 'intermediate' | 'secondary' | 'all'>('all');
  const [hospitalType, setHospitalType] = useState<'public' | 'private' | 'all'>('all');

  const handleShare = async (provider: Provider) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: provider.name[language],
          text: `Check out ${provider.name[language]}`,
          url: `https://www.google.com/maps?q=${provider.lat},${provider.lng}`,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`https://www.google.com/maps?q=${provider.lat},${provider.lng}`);
      alert(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied');
    }
  };

  const filteredProviders = useMemo(() => {
    let filtered = allProviders.filter(p => p.categoryId === category.id);
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(p => p.subcategoryId === activeTab);
    }

    // Calculate distance and sort if location is available
    if (location) {
      return filtered.map(p => ({
        ...p,
        distance: calculateDistance(location.lat, location.lng, p.lat, p.lng)
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return filtered;
  }, [category.id, activeTab, location]);

  const handleEditService = (provider: Provider) => {
    setEditingProvider(provider);
    setShowAddService(true);
  };

  const deleteService = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) {
      if (setAllProviders) {
        setAllProviders(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen w-full flex flex-col max-w-4xl mx-auto p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 bg-gradient-to-br ${category.color}`} />
        <div className={`absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 bg-gradient-to-tr ${category.color}`} />
      </div>

      {/* Header */}
      {isAdmin && (
        <div className="bg-purple-600 text-white text-[10px] font-bold py-1 px-4 flex items-center justify-center gap-2 mb-4 rounded-xl">
          <ShieldCheck className="w-3 h-3" />
          <span>ADMIN MODE ACTIVE</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-slate-200/20 hover:bg-white/20 transition-all"
          >
            {language === 'ar' ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-app">
            {category.label[language]}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {appSettings?.showSettingsIcon !== false && (
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-slate-200/20 hover:bg-white/20 transition-all"
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
                    className="absolute top-full mt-2 left-0 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-3 z-50 overflow-hidden"
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
              className="px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-600 hover:bg-blue-500/30 transition-all font-bold text-sm"
              title={language === 'ar' ? 'عن التطبيق' : 'About App'}
            >
              {language === 'ar' ? 'نبذة' : 'About'}
            </button>
          )}

          {appSettings?.walletInfo?.showWallet !== false && (
            <button 
              onClick={() => setShowSupport(true)}
              className="px-4 py-2 rounded-full bg-yellow-400/20 backdrop-blur-md border border-yellow-400/30 text-yellow-600 hover:bg-yellow-400/30 transition-all font-bold text-sm"
              title={language === 'ar' ? 'دعم التطبيق' : 'Support App'}
            >
              {language === 'ar' ? 'دعم' : 'Support'}
            </button>
          )}
        </div>
      </div>

      {showAddService && (
        <AddServiceForm 
          onClose={() => setShowAddService(false)} 
          language={language} 
          currentUser={currentUser} 
          providerToEdit={editingProvider || undefined} 
          setAllProviders={setAllProviders} 
          initialCategoryId={category.id}
          initialSubcategoryId={activeTab !== 'all' ? activeTab : category.subcategories[0]?.id}
        />
      )}

      {/* Tabs (Horizontal Scroll) */}
      <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-6 pb-2">
        {category.subcategories.length > 0 && (
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all ${
              activeTab === 'all' 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white/10 dark:bg-slate-800/50 border border-slate-200/20 dark:border-slate-700/50 hover:bg-white/20'
            }`}
          >
            {language === 'ar' ? 'الكل' : 'All'}
          </button>
        )}
        {category.subcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveTab(sub.id)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all ${
              activeTab === sub.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white/10 dark:bg-slate-800/50 border border-slate-200/20 dark:border-slate-700/50 hover:bg-white/20'
            }`}
          >
            {sub.label[language]}
          </button>
        ))}
      </div>

      {/* Join Button for this specific subcategory */}
      <div className="w-full mb-8">
        <button
          onClick={() => {
            setEditingProvider(null);
            setShowAddService(true);
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <UserPlus className="w-6 h-6" />
          {language === 'ar' 
            ? `انضمام كمقدم خدمة في ${category.subcategories.find(s => s.id === activeTab)?.label.ar || category.label.ar}` 
            : `Join as provider in ${category.subcategories.find(s => s.id === activeTab)?.label.en || category.label.en}`}
        </button>
      </div>

      {/* Provider List */}
      <div className="flex flex-col gap-4">
        {filteredProviders.length === 0 ? (
          <div className="text-center py-12 opacity-60">
            {language === 'ar' ? 'لا يوجد خدمات متاحة حالياً' : 'No services available currently'}
          </div>
        ) : (
          filteredProviders.map((provider: any) => (
            <motion.div
              key={provider.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectProvider(provider)}
              className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-slate-800/5 dark:bg-white/5 backdrop-blur-md border border-slate-400/20 dark:border-white/10 cursor-pointer hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all"
            >
              <img 
                src={provider.image} 
                alt={provider.name[language]} 
                className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-xl"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold">{provider.name[language]}</h3>
                    <div className="flex items-center gap-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg text-sm font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      {provider.rating}
                    </div>
                  </div>
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-2">
                    {provider.specialty[language]}
                  </p>
                  {provider.bio && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">
                      {provider.bio[language]}
                    </p>
                  )}
                  <div className="flex items-center gap-2 opacity-70 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{provider.locationName[language]}</span>
                    {provider.distance !== undefined && (
                      <span className="font-bold text-pink-600 dark:text-pink-400">
                        ({provider.distance.toFixed(1)} km)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${
                    provider.type === 'mobile' 
                      ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' 
                      : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {provider.type === 'mobile' ? <Car className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                    {provider.type === 'mobile' 
                      ? (language === 'ar' ? 'متنقل' : 'Mobile') 
                      : (language === 'ar' ? 'ثابت' : 'Fixed')}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedProvider(provider); }}
                    className="p-2 rounded-full bg-blue-500/20 text-blue-600 hover:bg-blue-500/30"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                  {isAdmin && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handleEditService(provider); }} className="p-2 rounded-full bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteService(provider.id); }} className="p-2 rounded-full bg-red-500/20 text-red-600 hover:bg-red-500/30">
                        <Trash className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{language === 'ar' ? 'اختر طريقة الوصول' : 'Choose access method'}</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => window.open(`https://www.google.com/maps?q=${selectedProvider.lat},${selectedProvider.lng}`, '_blank')} className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold">Google Maps</button>
              <button onClick={() => window.open(`https://waze.com/ul?ll=${selectedProvider.lat},${selectedProvider.lng}&navigate=yes`, '_blank')} className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold">Waze</button>
              <button onClick={() => handleShare(selectedProvider)} className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold">{language === 'ar' ? 'مشاركة الموقع' : 'Share Location'}</button>
              <button onClick={() => setSelectedProvider(null)} className="w-full py-3 rounded-xl text-slate-500">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <button 
          onClick={() => {
            setEditingProvider(null);
            setShowAddService(true);
          }}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-8 h-8" />
        </button>
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
    </motion.div>
  );
}
