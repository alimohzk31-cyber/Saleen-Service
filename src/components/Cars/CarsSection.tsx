import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Plus, 
  Filter, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  DollarSign,
  Tag,
  Car as CarIcon,
  Info,
  X
} from 'lucide-react';
import { Language } from '../../App';
import { Category, Car } from '../../types';
import { mockCars } from '../../data/mock';
import { AddCarForm } from './AddCarForm';

interface Props {
  onBack: () => void;
  language: Language;
  currentUser: any | null;
  setIsSearchHidden?: (hidden: boolean) => void;
}

export default function CarsSection({ onBack, language, currentUser, setIsSearchHidden }: Props) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  React.useEffect(() => {
    if (setIsSearchHidden) {
      setIsSearchHidden(showAddForm);
    }
    return () => {
      if (setIsSearchHidden) setIsSearchHidden(false);
    };
  }, [showAddForm, setIsSearchHidden]);

  const categories = [
    { id: 'all', label: { ar: 'الكل', en: 'All' } },
    { id: 'american', label: { ar: 'أمريكي', en: 'American' } },
    { id: 'thai', label: { ar: 'تايلاندي', en: 'Thai' } },
    { id: 'chinese', label: { ar: 'صيني', en: 'Chinese' } },
    { id: 'korean', label: { ar: 'كوري', en: 'Korean' } },
    { id: 'iranian', label: { ar: 'إيراني', en: 'Iranian' } },
    { id: 'gulf', label: { ar: 'خليجي', en: 'Gulf' } },
  ];

  const filteredCars = useMemo(() => {
    return mockCars.filter(car => {
      const matchesTab = activeTab === 'all' || car.origin === activeTab;
      const matchesSearch = 
        car.brand.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.ar.includes(searchQuery) ||
        car.model.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.ar.includes(searchQuery);
      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      const matchesType = selectedType === 'all' || car.type === selectedType;
      const matchesOrigin = selectedOrigin === 'all' || car.origin === selectedOrigin;
      
      return matchesTab && matchesSearch && matchesPrice && matchesType && matchesOrigin;
    });
  }, [activeTab, searchQuery, priceRange, selectedType, selectedOrigin]);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div className="min-h-screen w-full flex flex-col max-w-5xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 transition-all hover:scale-110 active:scale-95"
          >
            {language === 'ar' ? <ArrowRight className="w-7 h-7 text-slate-900 dark:text-white" /> : <ArrowLeft className="w-7 h-7 text-slate-900 dark:text-white" />}
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-text-app dark:text-text-app-dark">
            {language === 'ar' ? 'بيع وشراء السيارات' : 'Buy & Sell Cars'}
          </h1>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-full transition-all ${showFilters ? 'bg-primary text-white' : 'bg-white/10 dark:bg-slate-800/50 border border-slate-200/20 dark:border-slate-700/50'}`}
        >
          <Filter className="w-6 h-6" />
        </button>
      </div>

      {/* Search Bar */}
      {!showAddForm && (
        <div className="w-full relative mb-6">
          <div className="flex items-center bg-card-bg dark:bg-card-bg-dark rounded-2xl border border-slate-200 dark:border-slate-700 p-2 shadow-lg">
            <Search className="w-6 h-6 text-slate-400 ml-3 mr-3" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث عن سيارة، موديل...' : 'Search for a car, model...'}
              className="flex-1 bg-transparent border-none outline-none text-lg p-2 text-text-app dark:text-text-app-dark placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-6 rounded-3xl bg-card-bg dark:bg-card-bg-dark border border-slate-200 dark:border-slate-700 shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 opacity-70">
                  {language === 'ar' ? 'نطاق السعر ($)' : 'Price Range ($)'}
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    value={priceRange[0]} 
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 opacity-70">
                  {language === 'ar' ? 'نوع السيارة' : 'Car Type'}
                </label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none appearance-none"
                >
                  <option value="sedan">{language === 'ar' ? 'سيدان' : 'Sedan'}</option>
                  <option value="suv">{language === 'ar' ? 'SUV' : 'SUV'}</option>
                  <option value="truck">{language === 'ar' ? 'شاحنة' : 'Truck'}</option>
                  <option value="other">{language === 'ar' ? 'أخرى' : 'Other'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 opacity-70">
                  {language === 'ar' ? 'المنشأ' : 'Origin'}
                </label>
                <select 
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none appearance-none"
                >
                  <option value="american">{language === 'ar' ? 'أمريكي' : 'American'}</option>
                  <option value="korean">{language === 'ar' ? 'كوري' : 'Korean'}</option>
                  <option value="chinese">{language === 'ar' ? 'صيني' : 'Chinese'}</option>
                  <option value="iranian">{language === 'ar' ? 'إيراني' : 'Iranian'}</option>
                  <option value="gulf">{language === 'ar' ? 'خليجي' : 'Gulf'}</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-8 pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold transition-all ${
              activeTab === cat.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                : 'bg-white/10 dark:bg-slate-800/50 border border-slate-200/20 dark:border-slate-700/50 hover:bg-white/20'
            }`}
          >
            {cat.label[language]}
          </button>
        ))}
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <motion.div
            key={car.id}
            layoutId={car.id}
            onClick={() => setSelectedCar(car)}
            className="group relative flex flex-col bg-card-bg dark:bg-card-bg-dark rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={car.image} 
                alt={car.brand[language]} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold">
                {car.year}
              </div>
              <div className="absolute bottom-4 left-4 bg-primary text-white px-4 py-1 rounded-xl text-lg font-black shadow-lg">
                ${car.price.toLocaleString()}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black">{car.brand[language]} {car.model[language]}</h3>
                <span className="text-xs font-bold uppercase tracking-wider opacity-50">{car.origin}</span>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-1 text-sm opacity-70">
                  <Tag className="w-4 h-4" />
                  <span>{car.condition[language]}</span>
                </div>
                <div className="flex items-center gap-1 text-sm opacity-70">
                  <MapPin className="w-4 h-4" />
                  <span>{car.location[language]}</span>
                </div>
              </div>
              <p className="text-sm opacity-60 line-clamp-2 mb-4">
                {car.description[language]}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <CarIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">{car.sellerName}</span>
                </div>
                <button className="p-2 rounded-full bg-primary/10 text-primary">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <CarIcon className="w-16 h-16 mb-4" />
          <p className="text-xl font-bold">{language === 'ar' ? 'لا توجد سيارات مطابقة' : 'No matching cars found'}</p>
        </div>
      )}

      {/* Floating Add Button */}
      <button 
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Car Details Modal */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedCar(null)}
          >
            <motion.div 
              layoutId={selectedCar.id}
              className="bg-card-bg dark:bg-card-bg-dark w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 sm:h-80">
                <img src={selectedCar.image} alt="" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedCar(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-black mb-2">{selectedCar.brand[language]} {selectedCar.model[language]}</h2>
                    <div className="flex items-center gap-4 text-lg font-bold text-primary">
                      <span>${selectedCar.price.toLocaleString()}</span>
                      <span className="opacity-30">|</span>
                      <span>{selectedCar.year}</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold uppercase tracking-widest text-sm">
                    {selectedCar.origin}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold opacity-50 block mb-1">{language === 'ar' ? 'الحالة' : 'Condition'}</span>
                    <span className="font-bold">{selectedCar.condition[language]}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold opacity-50 block mb-1">{language === 'ar' ? 'الموقع' : 'Location'}</span>
                    <span className="font-bold">{selectedCar.location[language]}</span>
                  </div>
                </div>

                <p className="text-lg opacity-70 mb-8 leading-relaxed">
                  {selectedCar.description[language]}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleCall(selectedCar.sellerPhone)}
                    className="flex-1 py-4 rounded-2xl bg-primary text-white font-black flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                  >
                    <Phone className="w-6 h-6" />
                    {language === 'ar' ? 'اتصال بالبائع' : 'Call Seller'}
                  </button>
                  <button 
                    onClick={() => handleWhatsApp(selectedCar.sellerWhatsApp || selectedCar.sellerPhone)}
                    className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-black flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-6 h-6" />
                    {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Car Form Modal */}
      {showAddForm && (
        <AddCarForm 
          onClose={() => setShowAddForm(false)} 
          language={language} 
          currentUser={currentUser} 
        />
      )}
    </div>
  );
}
