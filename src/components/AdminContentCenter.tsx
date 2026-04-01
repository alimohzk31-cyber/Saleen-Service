import React, { useState } from 'react';
import { Category, Provider } from '../types';
import { Language } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  PlusCircle,
  Stethoscope, Scale, BookOpen, Hammer, Wrench, Droplet, Zap, Car, Wifi, Hotel, Sparkles, Tv, ShoppingBag, Utensils, Disc, Footprints, HeartPulse, Baby
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Stethoscope, Scale, BookOpen, Hammer, Wrench, Droplet, Zap, Car, Wifi, Hotel, Sparkles, Tv, ShoppingBag, Utensils, Disc, Footprints, HeartPulse, Baby
};

interface Props {
  categories: Category[];
  providers: Provider[];
  language: Language;
  onAddProvider: (categoryId?: string) => void;
  onEditProvider: (provider: Provider) => void;
  onDeleteProvider: (providerId: string) => void;
  onAddSubService: (provider: Provider) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export function AdminContentCenter({ 
  categories, 
  providers, 
  language, 
  onAddProvider, 
  onEditProvider, 
  onDeleteProvider, 
  onAddSubService,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}: Props) {
  const [view, setView] = useState<'categories' | 'services'>('services');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            {language === 'ar' ? 'مركز التحكم بالمحتوى' : 'Content Control Center'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {language === 'ar' ? 'إدارة الأقسام والخدمات في مكان واحد' : 'Manage categories and services in one place'}
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setView('services')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${view === 'services' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <Briefcase className="w-5 h-5" />
            {language === 'ar' ? 'الخدمات' : 'Services'}
          </button>
          <button 
            onClick={() => setView('categories')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${view === 'categories' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <LayoutGrid className="w-5 h-5" />
            {language === 'ar' ? 'الأقسام' : 'Categories'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'services' ? (
          <motion.div 
            key="services"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                {language === 'ar' ? 'قائمة الخدمات' : 'Services List'}
              </h2>
              <button 
                onClick={() => onAddProvider()} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                {language === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map(provider => (
                <motion.div 
                  key={provider.id} 
                  whileHover={{ y: -5 }}
                  className="group relative p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                      <img src={provider.image} alt={provider.name[language]} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{provider.name[language]}</h3>
                      <p className="text-slate-500 text-sm line-clamp-1">{provider.specialty[language]}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEditProvider(provider)} 
                        className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        title={language === 'ar' ? 'تعديل' : 'Edit'}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onDeleteProvider(provider.id)} 
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        title={language === 'ar' ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => onAddSubService(provider)} 
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all font-bold text-sm"
                    >
                      <PlusCircle className="w-4 h-4" />
                      {language === 'ar' ? 'خدمة فرعية' : 'Sub-service'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutGrid className="w-6 h-6 text-primary" />
                {language === 'ar' ? 'هيكلية الأقسام' : 'Categories Structure'}
              </h2>
              <button 
                onClick={onAddCategory} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                {language === 'ar' ? 'إضافة قسم جديد' : 'Add New Category'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => {
                const Icon = iconMap[category.iconName];
                return (
                  <motion.div 
                    key={category.id} 
                    whileHover={{ y: -5 }}
                    className={`relative p-8 rounded-[2.5rem] bg-gradient-to-br ${category.color} shadow-xl flex flex-col items-center justify-center gap-4 text-white overflow-hidden group`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    
                    <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                      {Icon && <Icon className="w-10 h-10" />}
                    </div>
                    
                    <div className="text-center">
                      <h3 className="font-black text-xl mb-1">{category.label[language]}</h3>
                      <p className="text-white/70 text-sm font-medium">
                        {providers?.filter(p => p.categoryId === category.id).length || 0} {language === 'ar' ? 'خدمة' : 'Services'}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => onEditCategory(category)} 
                        className="p-3 rounded-2xl bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-all backdrop-blur-md"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onDeleteCategory(category.id)} 
                        className="p-3 rounded-2xl bg-red-500/40 hover:bg-red-500 text-white transition-all backdrop-blur-md"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onAddProvider(category.id)} 
                        className="p-3 rounded-2xl bg-emerald-500/40 hover:bg-emerald-500 text-white transition-all backdrop-blur-md"
                        title={language === 'ar' ? 'إضافة خدمة لهذا القسم' : 'Add service to this category'}
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
