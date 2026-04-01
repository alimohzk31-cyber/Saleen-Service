import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Camera, Plus, Check, AlertCircle } from 'lucide-react';
import { Language } from '../../App';
import { Car } from '../../types';

interface Props {
  onClose: () => void;
  language: Language;
  currentUser: any | null;
}

export function AddCarForm({ onClose, language, currentUser }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: { ar: '', en: '' },
    model: { ar: '', en: '' },
    year: new Date().getFullYear(),
    price: '',
    origin: 'american',
    condition: 'new',
    type: 'sedan',
    location: { ar: '', en: '' },
    description: { ar: '', en: '' },
    sellerName: currentUser?.displayName || '',
    sellerPhone: currentUser?.phone || '',
    image: 'https://images.unsplash.com/photo-1584345604480-8347cc996c5f?auto=format&fit=crop&q=80&w=800&h=400'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const origins = [
    { id: 'american', label: { ar: 'أمريكي', en: 'American' } },
    { id: 'thai', label: { ar: 'تايلاندي', en: 'Thai' } },
    { id: 'chinese', label: { ar: 'صيني', en: 'Chinese' } },
    { id: 'korean', label: { ar: 'كوري', en: 'Korean' } },
    { id: 'iranian', label: { ar: 'إيراني', en: 'Iranian' } },
    { id: 'gulf', label: { ar: 'خليجي', en: 'Gulf' } },
  ];

  const carTypes = [
    { id: 'sedan', label: { ar: 'سيدان', en: 'Sedan' } },
    { id: 'suv', label: { ar: 'SUV', en: 'SUV' } },
    { id: 'truck', label: { ar: 'شاحنة', en: 'Truck' } },
    { id: 'other', label: { ar: 'أخرى', en: 'Other' } },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card-bg dark:bg-card-bg-dark w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-black">
            {language === 'ar' ? 'إضافة سيارة للبيع' : 'Add Car for Sale'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black mb-2">{language === 'ar' ? 'تمت الإضافة بنجاح!' : 'Added Successfully!'}</h3>
              <p className="opacity-60">{language === 'ar' ? 'سيتم مراجعة إعلانك ونشره قريباً.' : 'Your ad will be reviewed and published soon.'}</p>
            </div>
          ) : (
            <form 
              id="add-car-form"
              className="space-y-8"
            >
              {/* Image Upload Placeholder */}
              <div className="relative h-48 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-primary transition-colors">
                <Camera className="w-12 h-12 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
                <span className="font-bold opacity-40 group-hover:opacity-100 transition-all">
                  {language === 'ar' ? 'اضغط لرفع صور السيارة' : 'Click to upload car photos'}
                </span>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-70">{language === 'ar' ? 'الماركة (بالعربي)' : 'Brand (Arabic)'}</label>
                  <input 
                    required
                    type="text" 
                    value={formData.brand.ar}
                    onChange={(e) => setFormData({...formData, brand: {...formData.brand, ar: e.target.value}})}
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-70">{language === 'ar' ? 'الماركة (بالإنجليزي)' : 'Brand (English)'}</label>
                  <input 
                    required
                    type="text" 
                    value={formData.brand.en}
                    onChange={(e) => setFormData({...formData, brand: {...formData.brand, en: e.target.value}})}
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-70">{language === 'ar' ? 'الموديل' : 'Model'}</label>
                  <input 
                    required
                    type="text" 
                    value={formData.model.en}
                    onChange={(e) => setFormData({...formData, model: {ar: e.target.value, en: e.target.value}})}
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-70">{language === 'ar' ? 'سنة الصنع' : 'Year'}</label>
                  <input 
                    required
                    type="number" 
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-70">{language === 'ar' ? 'السعر ($)' : 'Price ($)'}</label>
                  <input 
                    required
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-70">{language === 'ar' ? 'المنشأ' : 'Origin'}</label>
                  <select 
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-primary/20 transition-all appearance-none"
                  >
                    {origins.map(o => (
                      <option key={o.id} value={o.id}>{o.label[language]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-70">{language === 'ar' ? 'نوع السيارة' : 'Car Type'}</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-primary/20 transition-all appearance-none"
                  >
                    {carTypes.map(t => (
                      <option key={t.id} value={t.id}>{t.label[language]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-70">{language === 'ar' ? 'الحالة' : 'Condition'}</label>
                  <select 
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-primary/20 transition-all appearance-none"
                  >
                    <option value="new">{language === 'ar' ? 'جديدة' : 'New'}</option>
                    <option value="used">{language === 'ar' ? 'مستعملة' : 'Used'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 opacity-70">{language === 'ar' ? 'الموقع' : 'Location'}</label>
                <input 
                  required
                  type="text" 
                  value={formData.location.ar}
                  onChange={(e) => setFormData({...formData, location: {ar: e.target.value, en: e.target.value}})}
                  className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-primary/20 transition-all"
                  placeholder={language === 'ar' ? 'مثال: بغداد - المنصور' : 'e.g. Baghdad - Mansour'}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 opacity-70">{language === 'ar' ? 'الوصف' : 'Description'}</label>
                <textarea 
                  required
                  value={formData.description.ar}
                  onChange={(e) => setFormData({...formData, description: {ar: e.target.value, en: e.target.value}})}
                  className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ring-primary/20 transition-all h-32 resize-none"
                  placeholder={language === 'ar' ? 'اكتب تفاصيل السيارة هنا...' : 'Write car details here...'}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    const form = document.getElementById('add-car-form') as HTMLFormElement;
                    if (form && form.reportValidity()) {
                      handleSubmit(e);
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      {language === 'ar' ? 'نشر الإعلان' : 'Publish Ad'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
