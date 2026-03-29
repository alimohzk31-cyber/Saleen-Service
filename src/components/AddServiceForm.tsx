import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Language } from '../App';
import { ArrowLeft, ArrowRight, MapPin, Upload, CheckCircle2, Video } from 'lucide-react';
import { categories } from '../data/mock';
import { Provider } from '../types';

interface Props {
  onClose: () => void;
  language: Language;
  currentUser: any;
  providerToEdit?: Provider;
  setAllProviders?: React.Dispatch<React.SetStateAction<Provider[]>>;
  initialCategoryId?: string;
  initialSubcategoryId?: string;
}

const compressImage = (file: File, maxWidth = 800): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export function AddServiceForm({ onClose, language, currentUser, providerToEdit, setAllProviders, initialCategoryId, initialSubcategoryId }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nameAr: '', nameEn: '',
    placeNameAr: '', placeNameEn: '',
    specialtyAr: '', specialtyEn: '',
    categoryId: initialCategoryId || categories[0].id,
    subcategoryId: initialSubcategoryId || 'all',
    certAr: '', certEn: '',
    expAr: '', expEn: '',
    rating: 5,
    phone: '',
    lat: 0, lng: 0,
    images: [] as string[],
    video: '',
    logo: '',
    type: 'fixed' as 'fixed' | 'mobile',
    birthDate: '',
    bioAr: '', bioEn: '',
  });

  useEffect(() => {
    if (providerToEdit) {
      setFormData({
        nameAr: providerToEdit.name.ar, nameEn: providerToEdit.name.en,
        placeNameAr: providerToEdit.locationName.ar, placeNameEn: providerToEdit.locationName.en,
        specialtyAr: providerToEdit.specialty.ar, specialtyEn: providerToEdit.specialty.en,
        categoryId: providerToEdit.categoryId,
        subcategoryId: providerToEdit.subcategoryId || 'all',
        certAr: providerToEdit.certificates[0]?.ar || '', certEn: providerToEdit.certificates[0]?.en || '',
        expAr: providerToEdit.experience.ar, expEn: providerToEdit.experience.en,
        rating: providerToEdit.rating,
        phone: providerToEdit.phone,
        lat: providerToEdit.lat, lng: providerToEdit.lng,
        images: providerToEdit.images,
        video: providerToEdit.video || '',
        logo: providerToEdit.logo || '',
        type: providerToEdit.type,
        birthDate: '',
        bioAr: providerToEdit.bio?.ar || '', bioEn: providerToEdit.bio?.en || '',
      });
    }
  }, [providerToEdit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    
    // Limit image size to 5MB each
    const validFiles = files.filter(f => {
      if (f.size > 5 * 1024 * 1024) {
        alert(language === 'ar' ? `حجم الصورة ${f.name} كبير جداً. الحد الأقصى 5 ميجابايت.` : `Image ${f.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    const compressedImages = await Promise.all(validFiles.map(f => compressImage(f)));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...compressedImages] }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Limit video size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'ar' ? 'حجم الفيديو كبير جداً. الحد الأقصى 10 ميجابايت.' : 'Video size is too large. Maximum size is 10MB.');
      e.target.value = ''; // Reset input
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, video: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(language === 'ar' ? 'المتصفح لا يدعم تحديد الموقع' : 'Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
      },
      (err) => {
        console.error("Error getting location:", err);
        alert(language === 'ar' ? 'تعذر الحصول على الموقع' : 'Could not get location');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.lat === 0 || formData.lng === 0) {
      alert(language === 'ar' ? 'يرجى تحديد الموقع على الخريطة أولاً' : 'Please set location on map first');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const providerData = {
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        name: { ar: formData.nameAr, en: formData.nameEn || formData.nameAr },
        specialty: { ar: formData.specialtyAr, en: formData.specialtyEn || formData.specialtyAr },
        locationName: { ar: formData.placeNameAr, en: formData.placeNameEn || formData.placeNameAr },
        lat: formData.lat,
        lng: formData.lng,
        type: formData.type,
        phone: formData.phone,
        rating: formData.rating,
        experience: { ar: formData.expAr, en: formData.expEn || formData.expAr },
        certificates: [{ ar: formData.certAr, en: formData.certEn || formData.certAr }],
        bio: { ar: formData.bioAr, en: formData.bioEn || formData.bioAr },
        image: formData.images[0] || 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&q=80&w=400&h=400',
        images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&q=80&w=800&h=400'],
        video: formData.video,
        logo: formData.logo,
        createdAt: providerToEdit ? providerToEdit.createdAt : Date.now(),
        userId: currentUser?.uid || 'guest_user'
      };

      // Call backend API to create service
      const token = localStorage.getItem('token');
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const requestBody = JSON.stringify({
          title: formData.nameAr,
          description: formData.bioAr,
          price: 0,
          category_id: formData.categoryId,
          subcategory_id: formData.subcategoryId,
          image_url: formData.images[0] || '',
          video_url: formData.video || '',
          phone: formData.phone,
          lat: formData.lat,
          lng: formData.lng,
          service_type: formData.type,
          experience: formData.expAr,
          certificates: [{ ar: formData.certAr, en: formData.certEn || formData.certAr }],
          bio: formData.bioAr
        });

        if (providerToEdit) {
          const response = await fetch(`/api/services/${providerToEdit.id}`, {
            method: 'PUT',
            headers,
            body: requestBody
          });
          
          if (!response.ok) {
            console.error('Failed to update service in backend:', await response.text());
          }
          if (setAllProviders) {
            setAllProviders(prev => prev.map(p => p.id === providerToEdit.id ? { ...providerData, id: providerToEdit.id } as Provider : p));
          }
        } else {
          const response = await fetch('/api/services', {
            method: 'POST',
            headers,
            body: requestBody
          });
          
          if (response.ok) {
            const result = await response.json();
            const newId = String(result.id);
            if (setAllProviders) {
              setAllProviders(prev => [...prev, { ...providerData, id: newId } as Provider]);
            }
          } else {
            console.error('Failed to create service in backend:', await response.text());
            if (setAllProviders) {
              const newId = Date.now().toString();
              setAllProviders(prev => [...prev, { ...providerData, id: newId } as Provider]);
            }
          }
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        if (setAllProviders) {
          if (providerToEdit) {
            setAllProviders(prev => prev.map(p => p.id === providerToEdit.id ? { ...providerData, id: providerToEdit.id } as Provider : p));
          } else {
            const newId = Date.now().toString();
            setAllProviders(prev => [...prev, { ...providerData, id: newId } as Provider]);
          }
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error saving provider:", error);
      alert(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving provider');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{language === 'ar' ? 'نموذج الانضمام' : 'Join Form'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">✕</button>
        </div>

        {showSuccess ? (
          <div className="text-center py-12 text-emerald-500 font-bold flex flex-col items-center gap-4">
            <CheckCircle2 className="w-16 h-16" />
            {language === 'ar' ? 'تمت الإضافة بنجاح!' : 'Added Successfully!'}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {(!initialCategoryId || !initialSubcategoryId) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'القسم الرئيسي' : 'Main Category'}</label>
                  <select 
                    value={formData.categoryId} 
                    onChange={e => setFormData({...formData, categoryId: e.target.value, subcategoryId: 'all'})}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label[language]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'القسم الفرعي' : 'Subcategory'}</label>
                  <select 
                    value={formData.subcategoryId} 
                    onChange={e => setFormData({...formData, subcategoryId: e.target.value})}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-white"
                  >
                    {categories.find(c => c.id === formData.categoryId)?.subcategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.label[language]}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                <input required type="text" placeholder={language === 'ar' ? 'الاسم الكامل (عربي)' : 'Full Name (Arabic)'} value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}</label>
                <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'التخصص أو الوظيفة' : 'Specialty or Job'}</label>
                <input required type="text" placeholder={language === 'ar' ? 'التخصص (عربي)' : 'Specialty (Arabic)'} value={formData.specialtyAr} onChange={e => setFormData({...formData, specialtyAr: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}</label>
                <input required type="text" placeholder={language === 'ar' ? 'مثال: 5 سنوات' : 'e.g. 5 years'} value={formData.expAr} onChange={e => setFormData({...formData, expAr: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'العنوان الجغرافي' : 'Address'}</label>
                <input required type="text" placeholder={language === 'ar' ? 'اسم المكان / العنوان' : 'Place Name / Address'} value={formData.placeNameAr} onChange={e => setFormData({...formData, placeNameAr: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                <input required type="tel" placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'نوع الخدمة' : 'Service Type'}</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value as 'fixed' | 'mobile'})}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 text-text-app dark:text-text-app-dark"
              >
                <option value="fixed">{language === 'ar' ? 'ثابت (محل/عيادة)' : 'Fixed (Shop/Clinic)'}</option>
                <option value="mobile">{language === 'ar' ? 'متنقل (خدمة منزلية)' : 'Mobile (Home Service)'}</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'نبذة عن الخدمات المقدمة' : 'Services Description / Bio'}</label>
              <textarea 
                required 
                rows={3}
                placeholder={language === 'ar' ? 'اكتب نبذة مختصرة عن الخدمات التي تقدمها...' : 'Write a brief description of your services...'} 
                value={formData.bioAr} 
                onChange={e => setFormData({...formData, bioAr: e.target.value})} 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 resize-none text-slate-900 dark:text-white" 
              />
            </div>
            
            <button type="button" onClick={handleGetLocation} className="w-full py-4 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 flex items-center justify-center gap-2 font-bold transition-colors">
              <MapPin className="w-5 h-5" />
              {language === 'ar' ? 'تحديد الموقع على الخريطة (الإحداثيات) 📍' : 'Set Location on Map (Coordinates) 📍'}
            </button>
            
            {(formData.lat !== 0 || formData.lng !== 0) && (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-mono text-slate-600 dark:text-slate-300">
                {language === 'ar' ? 'الإحداثيات:' : 'Coordinates:'} {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Upload className="w-8 h-8 text-slate-500" />
                <span className="text-slate-500 font-medium text-center">{language === 'ar' ? 'رفع صورة شخصية أو للمكان' : 'Upload Profile/Place Image'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              <label className="flex flex-col items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Video className="w-8 h-8 text-slate-500" />
                <span className="text-slate-500 font-medium text-center">{language === 'ar' ? 'رفع مقطع فيديو توضيحي' : 'Upload Promo Video'}</span>
                <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
              </label>
            </div>

            {/* Previews */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {formData.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Preview" className="w-full h-24 object-cover rounded-lg" />
                ))}
              </div>
            )}
            {formData.video && (
              <div className="mt-2">
                <video src={formData.video} controls className="w-full h-48 rounded-lg" />
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold shadow-lg disabled:opacity-50 hover:opacity-90 transition-all text-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
                </>
              ) : (
                language === 'ar' ? 'حفظ البيانات والانضمام' : 'Save & Join'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
