import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Heart, ShieldCheck, Zap, Car, Stethoscope, Scale, Hammer, ShoppingBag, Pill } from 'lucide-react';
import { Language } from '../App';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const translations = {
  ar: {
    title: "عن التطبيق",
    subtitle: "Saleen Service - وجهتك الشاملة للخدمات",
    description: "تطبيق Saleen Service هو تطبيق ذكي يجمع مختلف الخدمات اليومية والمهنية في مكان واحد، ويتيح للمستخدم الوصول بسهولة إلى أفضل مقدّمي الخدمات مثل الأطباء، المحامين، الحرفيين، وخدمات المنازل والسيارات، مع عرض معلومات كاملة، صور، ومواقع دقيقة لتسهيل الاختيار والتواصل.",
    howItWorks: "فكرة عمل التطبيق",
    howItWorksText: "يعتمد التطبيق على نظام عرض خدمات متكامل حيث يختار المستخدم القسم ثم التخصص ويستعرض مقدّمي الخدمة مع إمكانية مشاهدة الصور والفيديوهات ومعرفة الموقع والتواصل مباشرة.",
    servicesTitle: "الخدمات التي يقدمها التطبيق",
    services: [
      { icon: Stethoscope, label: "خدمات طبية" },
      { icon: Scale, label: "خدمات قانونية" },
      { icon: Hammer, label: "صيانة عامة ومهنية" },
      { icon: Car, label: "خدمات السيارات" },
      { icon: Zap, label: "خدمات منزلية" },
      { icon: ShieldCheck, label: "أعمال إنشائية وحرفية" },
      { icon: Pill, label: "صيدليات وأدوية" },
      { icon: ShoppingBag, label: "منتجات متنوعة" }
    ],
    close: "إغلاق"
  },
  en: {
    title: "About the App",
    subtitle: "Saleen Service - Your Comprehensive Service Hub",
    description: "Saleen Service is a smart app that brings together various daily and professional services in one place, allowing users to easily access the best service providers such as doctors, lawyers, craftsmen, home and car services, with full information, photos, and accurate locations to facilitate selection and communication.",
    howItWorks: "How It Works",
    howItWorksText: "The app relies on an integrated service display system where the user selects the section then the specialty and browses service providers with the ability to view photos and videos, know the location, and communicate directly.",
    servicesTitle: "Services Provided by the App",
    services: [
      { icon: Stethoscope, label: "Medical Services" },
      { icon: Scale, label: "Legal Services" },
      { icon: Hammer, label: "General & Professional Maintenance" },
      { icon: Car, label: "Car Services" },
      { icon: Zap, label: "Home Services" },
      { icon: ShieldCheck, label: "Construction & Crafts" },
      { icon: Pill, label: "Pharmacies & Medicine" },
      { icon: ShoppingBag, label: "Various Products" }
    ],
    close: "Close"
  }
};

export function InfoModal({ isOpen, onClose, language }: Props) {
  const t = translations[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header Decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10" />
            
            {/* Sticky Header */}
            <div className="p-6 sm:p-8 pb-0 flex justify-between items-start z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Info className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">{t.title}</h2>
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base">{t.subtitle}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8 pt-4 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-8">
                {/* Brief Section */}
                <section>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                    {t.description}
                  </p>
                </section>

                {/* How it works */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.howItWorks}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.howItWorksText}
                  </p>
                </section>

                {/* Services Grid */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.servicesTitle}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {t.services.map((service, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/30 hover:border-blue-500/30 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <service.icon className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                          {service.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>


                {/* Credits Section */}
                <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <div className="mt-2 pt-4 border-t border-slate-200 dark:border-slate-700/50 text-center">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                      {language === 'ar' ? 'الإصدار 1.0' : 'Version 1.0'}
                    </span>
                  </div>
                </section>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-10 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-xl"
              >
                {t.close}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
