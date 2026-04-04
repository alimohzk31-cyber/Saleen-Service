import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Language } from '../App';
import { ArrowLeft, ArrowRight, MapPin, Upload, CheckCircle2, Video, Play, Pause, Volume2, X } from 'lucide-react';
import { categories } from '../data/mock';
import { Provider } from '../types';
import { supabase } from '../lib/supabaseClient';

interface Props {
  onClose: () => void;
  onSuccess?: (provider: Provider) => void;
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

export function AddServiceForm({ onClose, onSuccess, language, currentUser, providerToEdit, setAllProviders, initialCategoryId, initialSubcategoryId }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from('categories').select('id, name_ar, name_en');
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        console.log("Fetched categories from Supabase:", data);
        setDbCategories(data || []);
      }
    };
    fetchCategories();
  }, []);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.volume = parseFloat(e.target.value);
    }
  };
  
  const [formData, setFormData] = useState(() => {
    // Always start with empty form data when opening the form
    return {
      nameAr: '', nameEn: '',
      placeNameAr: '', placeNameEn: '',
      specialtyAr: '', specialtyEn: '',
      categoryId: initialCategoryId || (dbCategories.length > 0 ? dbCategories[0].id : ''),
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
      age: '',
      bioAr: '', bioEn: '',
    };
  });



  useEffect(() => {
    if (!providerToEdit) {
      // Exclude large binary data from localStorage to prevent quota exceeded errors
      const { video, images, logo, ...persistentData } = formData;
      localStorage.setItem('addServiceFormData', JSON.stringify(persistentData));
    }
  }, [formData, providerToEdit]);

  useEffect(() => {
    // Clean up object URL when component unmounts or video changes
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

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
        images: providerToEdit.images || [],
        video: providerToEdit.video || '',
        logo: providerToEdit.logo || '',
        type: providerToEdit.type,
        age: '',
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
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...compressedImages] }));
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
    
    // Use Object URL for preview instead of DataURL to avoid localStorage issues and performance lag
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

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

  const performSave = async () => {
    setIsSubmitting(true);
    console.log("Starting save process...");
    
    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }

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
        image: (formData.images || [])[0] || 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&q=80&w=400&h=400',
        images: (formData.images || []).length > 0 ? formData.images : ['https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&q=80&w=800&h=400'],
        video: formData.video,
        logo: formData.logo,
        createdAt: providerToEdit ? providerToEdit.createdAt : Date.now(),
        userId: currentUser?.uid || 'guest_user'
      };

      const supabaseData = {
        provider_name: providerData.name.ar,
        title: providerData.specialty.ar,
        category_id: formData.categoryId,
        subcategory_id: formData.subcategoryId,
        image_url: providerData.image,
        phone: formData.phone,
        lat: formData.lat,
        lng: formData.lng,
        service_type: formData.type,
        experience: providerData.experience?.ar || '',
        certificates: JSON.stringify(providerData.certificates),
        bio: providerData.bio?.ar || '',
        user_id: currentUser?.uid || null,
        description: providerData.locationName.ar,
        average_rating: formData.rating,
        rating_count: 0
      };

      console.log("Attempting to save to Supabase...", supabaseData);
      
      if (providerToEdit) {
        const { error } = await supabase
          .from('services')
          .update(supabaseData)
          .eq('id', providerToEdit.id);
        
        if (error) throw error;
        
        if (setAllProviders) {
          setAllProviders(prev => prev.map(p => p.id === providerToEdit.id ? { ...providerData, id: providerToEdit.id } as Provider : p));
        }
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert([supabaseData])
          .select();
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Save successful!", data);
        
        if (setAllProviders && data) {
          setAllProviders(prev => [...prev, { ...providerData, id: String(data[0].id) } as Provider]);
        }
      }

      setShowSuccess(true);
      localStorage.removeItem('addServiceFormData');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({ ...providerData, id: providerToEdit ? providerToEdit.id : (Date.now().toString()) } as Provider);
        } else {
          onClose();
        }
      }, 2000);
    } catch (error) {
      console.error("Error saving provider:", error);
      const err = error as any;
      console.log("Full Supabase error object:", JSON.stringify(err, null, 2));
      const errorMessage = err.message || JSON.stringify(err);
      const errorDetails = err.details || '';
      setErrorMessage(language === 'ar' ? `حدث خطأ أثناء الحفظ: ${errorMessage} ${errorDetails}` : `Error saving provider: ${errorMessage} ${errorDetails}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    performSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 text-white rounded-2xl w-full max-w-[500px] shadow-2xl flex flex-col relative overflow-hidden"
        style={{ maxHeight: '85vh' }}
      >
        {/* Sticky Header */}
        <div className="p-5 border-b border-white/10 sticky top-0 bg-slate-900 z-10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {activeStep > 0 && (
              <button 
                onClick={() => setActiveStep(activeStep - 1)} 
                className="text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h2 className="text-[20px] font-bold text-center text-white">{language === 'ar' ? 'نموذج الانضمام' : 'Join Form'}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Tabs */}
        <div className="flex justify-between gap-2 p-4 border-b border-white/10 overflow-x-auto hide-scrollbar">
          {['الأساسي', 'المهنية', 'الموقع', 'الوسائط'].map((label, i) => (
            <button key={i} type="button" onClick={() => setActiveStep(i)} className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeStep === i ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 p-4 border-b border-white/10">
          {activeStep > 0 && (
            <button type="button" onClick={() => setActiveStep(activeStep - 1)} className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold">
              {language === 'ar' ? 'السابق' : 'Previous'}
            </button>
          )}
          {activeStep < 3 ? (
            <button type="button" onClick={() => setActiveStep(activeStep + 1)} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold">
              {language === 'ar' ? 'التالي' : 'Next'}
            </button>
          ) : (
            <button 
              type="button" 
              onClick={(e) => {
                const form = document.getElementById('add-service-form') as HTMLFormElement;
                if (form && form.reportValidity()) {
                  handleSubmit(e);
                }
              }}
              disabled={isSubmitting} 
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold shadow-lg disabled:opacity-50 hover:opacity-90 transition-all text-lg flex items-center justify-center gap-2"
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
          )}
        </div>

        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
          {showSuccess ? (
          <div className="text-center py-12 text-emerald-500 font-bold flex flex-col items-center gap-4">
            <CheckCircle2 className="w-16 h-16" />
            {language === 'ar' ? 'تمت الإضافة بنجاح!' : 'Added Successfully!'}
          </div>
        ) : (
          <form 
            id="add-service-form"
            className="flex flex-col gap-3"
          >
            {errorMessage && (
              <div className="p-3 bg-red-500/20 text-red-300 rounded-lg text-sm font-bold">
                {errorMessage}
              </div>
            )}
            {activeStep === 0 && (
              <>
                {(!initialCategoryId || !initialSubcategoryId) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'القسم الرئيسي' : 'Main Category'}</label>
                      <select 
                        value={formData.categoryId} 
                        onChange={e => setFormData({...formData, categoryId: e.target.value, subcategoryId: 'all'})}
                        className="w-full bg-slate-800 border-none rounded-lg p-3 text-white"
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
                        className="w-full bg-slate-800 border-none rounded-lg p-3 text-white"
                      >
                        {categories.find(c => c.id === formData.categoryId)?.subcategories.map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.label[language]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                  <input required type="text" placeholder={language === 'ar' ? 'الاسم الكامل (عربي)' : 'Full Name (Arabic)'} value={formData.nameAr || ''} onChange={e => setFormData({...formData, nameAr: e.target.value})} className="w-full bg-slate-800 border-none rounded-lg p-3 text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'العمر' : 'Age'}</label>
                  <input 
                    type="number" 
                    placeholder={language === 'ar' ? 'العمر' : 'Age'} 
                    min="1"
                    max="99"
                    value={formData.age || ''} 
                    onChange={e => {
                      let val = e.target.value;
                      if (val.length > 2) val = val.slice(0, 2);
                      setFormData({...formData, age: val});
                    }} 
                    className="w-full bg-slate-800 border-none rounded-lg p-3 text-white" 
                  />
                </div>
              </>
            )}

            {activeStep === 1 && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'التخصص أو الوظيفة' : 'Specialty or Job'}</label>
                  <input required type="text" placeholder={language === 'ar' ? 'التخصص (عربي)' : 'Specialty (Arabic)'} value={formData.specialtyAr || ''} onChange={e => setFormData({...formData, specialtyAr: e.target.value})} className="w-full bg-slate-800 border-none rounded-lg p-3 text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}</label>
                  <input required type="text" placeholder={language === 'ar' ? 'مثال: 5 سنوات' : 'e.g. 5 years'} value={formData.expAr || ''} onChange={e => setFormData({...formData, expAr: e.target.value})} className="w-full bg-slate-800 border-none rounded-lg p-3 text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold opacity-70 px-2">{language === 'ar' ? 'نبذة عن الخدمات المقدمة' : 'Services Description / Bio'}</label>
                  <textarea 
                    required 
                    rows={3}
                    placeholder={language === 'ar' ? 'اكتب نبذة مختصرة عن الخدمات التي تقدمها...' : 'Write a brief description of your services...'} 
                    value={formData.bioAr || ''} 
                    onChange={e => setFormData({...formData, bioAr: e.target.value})} 
                    className="w-full bg-slate-800 border-none rounded-lg p-3 resize-none text-white" 
                  />
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                <button type="button" onClick={handleGetLocation} className="w-full py-3 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 flex items-center justify-center gap-2 font-bold transition-colors">
                  <MapPin className="w-5 h-5" />
                  {language === 'ar' ? 'تحديد الموقع على الخريطة (الإحداثيات) 📍' : 'Set Location on Map (Coordinates) 📍'}
                </button>
                
                {(formData.lat !== 0 || formData.lng !== 0) && (
                  <div className="p-3 rounded-lg bg-slate-800 text-sm font-mono text-slate-300">
                    {language === 'ar' ? 'الإحداثيات:' : 'Coordinates:'} {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
                  </div>
                )}
              </>
            )}

            {activeStep === 3 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col items-center justify-center gap-2 w-full bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400" />
                    <span className="text-slate-400 font-medium text-center text-xs">{language === 'ar' ? 'رفع صورة' : 'Upload Image'}</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  <label className="flex flex-col items-center justify-center gap-2 w-full bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors">
                    <Video className="w-6 h-6 text-slate-400" />
                    <span className="text-slate-400 font-medium text-center text-xs">{language === 'ar' ? 'رفع فيديو' : 'Upload Video'}</span>
                    <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  </label>
                </div>

                {/* Image Previews */}
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {formData.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="Preview" className="w-full h-20 object-cover rounded-lg" />
                    ))}
                  </div>
                )}

                {/* Video Preview */}
                {videoPreviewUrl && (
                  <div className="mt-2 relative rounded-lg overflow-hidden bg-black">
                    <video ref={videoRef} src={videoPreviewUrl} className="w-full h-40 object-cover" />
                    <button type="button" onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/40">
                      {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
                    </button>
                  </div>
                )}
              </>
            )}
            
          </form>
        )}
        </div>
      </motion.div>
    </div>
  );
}
