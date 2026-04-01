import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, MapPin, Star, Phone, Share2, Navigation, Award, Clock, Edit, Trash, GraduationCap, Banknote, Users, BookOpen, Calendar, Baby, Activity, Scissors, Stethoscope, Heart, Brain, Microscope } from 'lucide-react';
import { Language } from '../App';
import { Provider } from '../types';

interface Props {
  provider: Provider;
  onBack: () => void;
  language: Language;
  isAdmin?: boolean;
  setAllProviders?: React.Dispatch<React.SetStateAction<Provider[]>>;
}

const iconMap: Record<string, any> = {
  Activity,
  Scissors,
  Stethoscope,
  Heart,
  Brain,
  Microscope,
  Users,
  Baby
};

export function ProviderDetails({ provider, onBack, language, isAdmin, setAllProviders }: Props) {
  const [currentImage, setCurrentImage] = useState(0);

  const deleteService = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) {
      if (setAllProviders) {
        setAllProviders(prev => prev.filter(p => p.id !== id));
        onBack();
      }
    }
  };

  const shareWhatsApp = () => {
    const text = language === 'ar' 
      ? `مرحباً، أود الاستفسار عن خدمات ${provider.name.ar}`
      : `Hello, I would like to inquire about the services of ${provider.name.en}`;
    window.open(`https://wa.me/${provider.phone.replace('+', '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen w-full max-w-4xl mx-auto pb-24"
    >
      {/* Header / Image Slider */}
      <div className="relative h-64 sm:h-96 w-full rounded-b-3xl overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={provider.images[currentImage]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Provider"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
        
        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-black/40 transition-all z-10"
        >
          {language === 'ar' ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
        </button>

        {isAdmin && (
          <div className="absolute top-6 right-6 flex gap-2 z-10">
            <button 
              onClick={() => deleteService(provider.id)}
              className="p-3 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-500 hover:bg-red-500/40 transition-all"
            >
              <Trash className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Image Indicators */}
        {provider.images?.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
            {provider.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentImage === idx ? 'bg-white w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 -mt-8 relative z-20">
        <div className="bg-card-bg dark:bg-card-bg-dark rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-text-app dark:text-text-app-dark">{provider.name[language]}</h1>
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl font-bold">
              <Star className="w-5 h-5 fill-current" />
              {provider.rating}
            </div>
          </div>
          <p className="text-xl text-primary font-medium mb-4">
            {provider.specialty[language]}
          </p>
          
          {/* School Specific Info */}
          {provider.categoryId === 'schools' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              {provider.tuition && (
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs opacity-60">{language === 'ar' ? 'القسط السنوي' : 'Annual Tuition'}</span>
                    <span className="font-bold text-primary">{provider.tuition}</span>
                  </div>
                </div>
              )}
              {provider.teachingStaff && (
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs opacity-60">{language === 'ar' ? 'الكادر التعليمي' : 'Teaching Staff'}</span>
                    <span className="font-bold">{provider.teachingStaff[language]}</span>
                  </div>
                </div>
              )}
              {provider.studentCount && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs opacity-60">{language === 'ar' ? 'عدد الطلاب' : 'Student Count'}</span>
                    <span className="font-bold">{provider.studentCount}</span>
                  </div>
                </div>
              )}
              {provider.acceptedAge && (
                <div className="flex items-center gap-3">
                  <Baby className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs opacity-60">{language === 'ar' ? 'العمر المقبول' : 'Accepted Age'}</span>
                    <span className="font-bold">{provider.acceptedAge[language]}</span>
                  </div>
                </div>
              )}
              {provider.workingHours && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs opacity-60">{language === 'ar' ? 'أوقات الدوام' : 'Working Hours'}</span>
                    <span className="font-bold">{provider.workingHours[language]}</span>
                  </div>
                </div>
              )}
              {provider.educationalPrograms && (
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs opacity-60">{language === 'ar' ? 'البرامج التعليمية' : 'Educational Programs'}</span>
                    <span className="font-bold">{provider.educationalPrograms[language]}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hospital Specific Info */}
          {provider.categoryId === 'hospitals' && (
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                {provider.bedCount && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs opacity-60">{language === 'ar' ? 'عدد الأسرة' : 'Bed Count'}</span>
                      <span className="font-bold">{provider.bedCount}</span>
                    </div>
                  </div>
                )}
                {provider.isEmergency24h && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs opacity-60">{language === 'ar' ? 'الطوارئ' : 'Emergency'}</span>
                      <span className="font-bold text-red-500">{language === 'ar' ? '24 ساعة' : '24 Hours'}</span>
                    </div>
                  </div>
                )}
                {provider.approximatePrices && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Banknote className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs opacity-60">{language === 'ar' ? 'الأسعار التقريبية' : 'Approx. Prices'}</span>
                      <span className="font-bold">{provider.approximatePrices[language]}</span>
                    </div>
                  </div>
                )}
              </div>

              {provider.departments && (
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-500" />
                    {language === 'ar' ? 'الأقسام المتوفرة' : 'Available Departments'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {provider.departments.map((dept) => {
                      const DeptIcon = iconMap[dept.icon] || Activity;
                      return (
                        <div key={dept.id} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                          <DeptIcon className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium">{dept.label[language]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {provider.specialServices && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <h3 className="text-sm font-bold text-amber-600 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {language === 'ar' ? 'خدمات ومميزات خاصة' : 'Special Services & Features'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {provider.specialServices[language]}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col gap-3 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span>{provider.experience[language]}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="flex flex-col">
                <span>{provider.locationName[language]}</span>
                {provider.nearestLandmark && (
                  <span className="text-sm opacity-70 italic">
                    {language === 'ar' ? 'أقرب نقطة دالة: ' : 'Nearest Landmark: '}
                    {provider.nearestLandmark[language]}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {provider.bio && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-2 text-text-app dark:text-text-app-dark">
                {language === 'ar' ? 'نبذة عن الخدمات' : 'About Services'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {provider.bio[language]}
              </p>
            </div>
          )}

          {provider.activities && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-2 text-text-app dark:text-text-app-dark">
                {language === 'ar' ? 'الأنشطة والفعاليات' : 'Activities & Events'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {provider.activities[language]}
              </p>
            </div>
          )}
        </div>

        {/* Certificates */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-text-app dark:text-text-app-dark">
            <Award className="w-6 h-6 text-primary" />
            {language === 'ar' ? 'الشهادات والاعتمادات' : 'Certificates & Accreditations'}
          </h3>
          <div className="flex flex-col gap-3">
            {provider.certificates.map((cert, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-bg-app dark:bg-card-bg-dark border border-slate-200 dark:border-slate-700 text-text-app dark:text-text-app-dark">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <p className="font-medium">{cert[language]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location Coordinates */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-text-app dark:text-text-app-dark">
              <MapPin className="w-6 h-6 text-primary" />
              {language === 'ar' ? 'الموقع الجغرافي (الإحداثيات)' : 'Location Coordinates'}
            </h3>
            <button 
              onClick={() => window.open(`https://waze.com/ul?ll=${provider.lat},${provider.lng}&navigate=yes`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all"
            >
              <Navigation className="w-5 h-5" />
              {language === 'ar' ? 'افتح Waze' : 'Open Waze'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-bg-app dark:bg-card-bg-dark border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">
                {language === 'ar' ? 'خط العرض' : 'Latitude'}
              </p>
              <p className="font-mono text-lg font-bold text-primary">
                {provider.lat.toFixed(6)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-bg-app dark:bg-card-bg-dark border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">
                {language === 'ar' ? 'خط الطول' : 'Longitude'}
              </p>
              <p className="font-mono text-lg font-bold text-primary">
                {provider.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-app/90 dark:bg-card-bg-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 z-50">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {provider.categoryId === 'hospitals' && provider.isEmergency24h && (
            <a 
              href={`tel:${provider.phone}`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-600 text-white font-bold text-lg shadow-lg hover:bg-red-700 transition-all animate-pulse"
            >
              <Activity className="w-6 h-6" />
              {language === 'ar' ? 'اتصال للطوارئ (24 ساعة)' : 'Emergency Call (24h)'}
            </a>
          )}
          <div className="flex gap-4">
            <a 
              href={`tel:${provider.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg hover:bg-primary-dark transition-all hover:scale-105"
            >
              <Phone className="w-6 h-6" />
              {language === 'ar' ? 'اتصال مباشر' : 'Call Now'}
            </a>
            <button 
            onClick={shareWhatsApp}
            className="flex items-center justify-center w-16 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all hover:scale-105"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
    </motion.div>
  );
}
