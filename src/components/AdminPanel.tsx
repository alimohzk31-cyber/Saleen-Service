import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Theme } from '../App';
import { ArrowLeft, ArrowRight, LayoutDashboard, UserPlus, Clock, Users, Activity, Briefcase, MapPin, Upload, PlusCircle, CheckCircle2, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Provider, AppSettings } from '../types';
import { Location } from '../utils/geo';
import { categories } from '../data/mock';
import { AdminUserList } from './AdminUserList';
import { AdminContentCenter } from './AdminContentCenter';
import { MediaLibrary } from './MediaLibrary';
import { MainApp } from './MainApp';
import { categories as initialCategories } from '../data/mock';

interface Props {
  onBack: () => void;
  language: Language;
  allProviders: Provider[];
  setAllProviders: React.Dispatch<React.SetStateAction<Provider[]>>;
  appSettings: AppSettings | null;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings | null>>;
  setLanguage: (lang: Language) => void;
  isMockMode?: boolean;
  location: Location | null;
  locationError: string | null;
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

interface Category {
  id: string;
  iconName: string;
  label: { ar: string; en: string };
  color: string;
  subcategories: any[];
}

export function AdminPanel({ 
  onBack, 
  language, 
  allProviders, 
  setAllProviders, 
  appSettings, 
  setAppSettings,
  setLanguage,
  isMockMode,
  location,
  locationError
}: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recent' | 'users' | 'settings' | 'content' | 'media' | 'live_browse'>(() => {
    return (localStorage.getItem('adminActiveTab') as any) || 'dashboard';
  });
  const [categories, setCategories] = useState(initialCategories);
  const [editingProviderId, setEditingProviderId] = useState<string | null>(() => {
    return localStorage.getItem('adminEditingProviderId');
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(() => {
    return localStorage.getItem('adminShowProviderForm') === 'true';
  });
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
    if (editingProviderId) {
      localStorage.setItem('adminEditingProviderId', editingProviderId);
    } else {
      localStorage.removeItem('adminEditingProviderId');
    }
    localStorage.setItem('adminShowProviderForm', String(showProviderForm));
  }, [activeTab, editingProviderId, showProviderForm]);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    iconName: 'Sparkles',
    labelAr: '',
    labelEn: '',
    color: 'from-purple-500 to-pink-500'
  });
  
  // Form State
  const [formData, setFormData] = useState({
    nameAr: '', nameEn: '',
    placeNameAr: '', placeNameEn: '',
    specialtyAr: '', specialtyEn: '',
    categoryId: categories[0].id,
    subcategoryId: 'all',
    certAr: '', certEn: '',
    expAr: '', expEn: '',
    rating: 5,
    phone: '',
    lat: 0, lng: 0,
    nearestLandmarkAr: '', nearestLandmarkEn: '',
    images: [] as string[],
    video: '',
    logo: '',
    type: 'fixed' as 'fixed' | 'mobile',
    bioAr: '', bioEn: '',
    workingHoursAr: '', workingHoursEn: '',
    approximatePricesAr: '', approximatePricesEn: '',
    isEmergency24h: false
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [settingsForm, setSettingsForm] = useState<AppSettings>({
    googleMapsApiKey: appSettings?.googleMapsApiKey || '',
    enableMaps: appSettings?.enableMaps ?? false,
    showSettingsIcon: appSettings?.showSettingsIcon ?? true,
    showInfoIcon: appSettings?.showInfoIcon ?? true,
    showEmergencyIcon: appSettings?.showEmergencyIcon ?? true,
    showAdminIcon: appSettings?.showAdminIcon ?? true,
    emergencyNumber: appSettings?.emergencyNumber || '911',
    welcomeTitle: appSettings?.welcomeTitle || { ar: 'Saleen Service', en: 'Saleen Service' },
    welcomeSubtitle: appSettings?.welcomeSubtitle || { ar: 'كل الخدمات بمكان واحد', en: 'All services in one place' },
    walletInfo: appSettings?.walletInfo || {
      zainCash: '+964 770 000 0000',
      masterCard: '0000-0000-0000-0000',
      supportPhone: '07736034126',
      showWallet: true
    }
  });
  const [isSettingsSubmitting, setIsSettingsSubmitting] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [stats, setStats] = useState({ users: 0, services: 0, orders: 0, activeOrders: 0, visitors: 0 });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.users !== undefined || data.services !== undefined) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    if (activeTab === 'dashboard') fetchStats();
  }, [activeTab]);

  React.useEffect(() => {
    if (appSettings) {
      setSettingsForm(appSettings);
    }
  }, [appSettings]);

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert(language === 'ar' ? 'حجم الشعار كبير جداً. الحد الأقصى 5 ميجابايت.' : 'Logo size is too large. Maximum size is 5MB.');
        e.target.value = '';
        return;
      }
      const compressedLogo = await compressImage(file, 400);
      setFormData(prev => ({ ...prev, logo: compressedLogo }));
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(language === 'ar' ? 'المتصفح لا يدعم تحديد الموقع' : 'Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        alert(language === 'ar' ? '✅ تم تحديد الموقع بنجاح' : '✅ Location set successfully');
      },
      (err) => {
        console.error("Error getting location:", err);
        let msg = language === 'ar' ? 'تعذر الحصول على الموقع' : 'Could not get location';
        if (err.code === err.PERMISSION_DENIED) {
          msg = language === 'ar' ? 'تم رفض إذن الوصول للموقع' : 'Location access denied';
        }
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleResetVisitors = async () => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من تصفير عداد الزوار؟' : 'Are you sure you want to reset the visitors counter?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/visits/clear', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setStats(prev => ({ ...prev, visitors: 0 }));
        alert(language === 'ar' ? '✅ تم تصفير العداد بنجاح' : '✅ Counter reset successfully');
      }
    } catch (error) {
      console.error('Error resetting visitors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newProvider = {
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
        nearestLandmark: { ar: formData.nearestLandmarkAr, en: formData.nearestLandmarkEn || formData.nearestLandmarkAr },
        experience: { ar: formData.expAr, en: formData.expEn || formData.expAr },
        certificates: [{ ar: formData.certAr, en: formData.certEn || formData.certAr }],
        image: formData.images[0] || 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&q=80&w=400&h=400',
        images: (formData.images || []).length > 0 ? formData.images : ['https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&q=80&w=800&h=400'],
        video: formData.video,
        logo: formData.logo,
        bio: { ar: formData.bioAr, en: formData.bioEn },
        workingHours: { ar: formData.workingHoursAr, en: formData.workingHoursEn },
        approximatePrices: { ar: formData.approximatePricesAr, en: formData.approximatePricesEn },
        isEmergency24h: formData.isEmergency24h,
        createdAt: Date.now()
      };

      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const requestBody = JSON.stringify({
        title: formData.nameAr,
        description: formData.placeNameAr,
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
        bio: { ar: formData.bioAr, en: formData.bioEn },
        workingHours: { ar: formData.workingHoursAr, en: formData.workingHoursEn },
        approximatePrices: { ar: formData.approximatePricesAr, en: formData.approximatePricesEn },
        isEmergency24h: formData.isEmergency24h
      });
      console.log('Saving service with requestBody:', requestBody);

      if (editingProviderId) {
        const response = await fetch(`/api/services/${editingProviderId}`, {
          method: 'PUT',
          headers,
          body: requestBody
        });
        
        if (response.ok) {
          setAllProviders(prev => prev.map(p => p.id === editingProviderId ? { ...newProvider, id: editingProviderId } : p));
        } else {
          console.error('Failed to update service in backend:', await response.text());
          setAllProviders(prev => prev.map(p => p.id === editingProviderId ? { ...newProvider, id: editingProviderId } : p));
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
          setAllProviders(prev => [...prev, { ...newProvider, id: newId }]);
        } else {
          console.error('Failed to create service in backend:', await response.text());
          const newId = Date.now().toString();
          setAllProviders(prev => [...prev, { ...newProvider, id: newId }]);
        }
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowProviderForm(false);
        setEditingProviderId(null);
        setFormData({
          nameAr: '', nameEn: '', placeNameAr: '', placeNameEn: '', specialtyAr: '', specialtyEn: '',
          categoryId: categories[0].id, subcategoryId: 'all', certAr: '', certEn: '', expAr: '', expEn: '',
          rating: 5, phone: '', lat: 0, lng: 0, 
          nearestLandmarkAr: '', nearestLandmarkEn: '',
          images: [], video: '', logo: '', type: 'fixed',
          bioAr: '', bioEn: '', workingHoursAr: '', workingHoursEn: '',
          approximatePricesAr: '', approximatePricesEn: '', isEmergency24h: false
        });
        setActiveTab('recent');
      }, 2000);
    } catch (error) {
      console.error("Error adding provider:", error);
      alert(language === 'ar' ? 'حدث خطأ أثناء الإضافة' : 'Error adding provider');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSettingsSubmitting(true);
    try {
      localStorage.setItem('appSettings', JSON.stringify(settingsForm));
      if (setAppSettings) setAppSettings(settingsForm);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(language === 'ar' ? 'حدث خطأ أثناء حفظ الإعدادات' : 'Error saving settings');
    } finally {
      setIsSettingsSubmitting(false);
    }
  };

  const handleDeleteProvider = async (providerId: string) => {
    console.log('Attempting to delete provider:', providerId);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/services/${providerId}`, {
        method: 'DELETE',
        headers
      });
      
      if (response.ok) {
        console.log('Successfully deleted provider:', providerId);
        setAllProviders(prev => prev.filter(p => p.id !== providerId));
      } else {
        const errorText = await response.text();
        console.error('Failed to delete service:', errorText);
        alert(language === 'ar' ? 'فشل حذف الخدمة' : 'Failed to delete service');
      }
    } catch (error) {
      console.error("Error deleting provider:", error);
      alert(language === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting provider');
    }
  };

  const handleAddSubService = (provider: Provider) => {
    setEditingProviderId(null);
    setFormData({
      nameAr: '', nameEn: '',
      placeNameAr: '', placeNameEn: '',
      specialtyAr: '', specialtyEn: '',
      categoryId: provider.categoryId,
      subcategoryId: provider.subcategoryId || 'all',
      certAr: '', certEn: '',
      expAr: '', expEn: '',
      rating: 5,
      phone: '',
      lat: 0, lng: 0,
      nearestLandmarkAr: '', nearestLandmarkEn: '',
      images: [],
      video: '',
      logo: '',
      type: 'fixed',
      bioAr: '', bioEn: '',
      workingHoursAr: '', workingHoursEn: '',
      approximatePricesAr: '', approximatePricesEn: '',
      isEmergency24h: false
    });
    setShowProviderForm(true);
  };

  const handleEditProvider = (provider: Provider) => {
    setEditingProviderId(provider.id);
    setFormData({
      nameAr: provider.name.ar, nameEn: provider.name.en,
      placeNameAr: provider.locationName.ar, placeNameEn: provider.locationName.en,
      specialtyAr: provider.specialty.ar, specialtyEn: provider.specialty.en,
      categoryId: provider.categoryId,
      subcategoryId: provider.subcategoryId || 'all',
      certAr: provider.certificates[0]?.ar || '', certEn: provider.certificates[0]?.en || '',
      expAr: provider.experience.ar, expEn: provider.experience.en,
      rating: provider.rating,
      phone: provider.phone,
      lat: provider.lat, lng: provider.lng,
      nearestLandmarkAr: provider.nearestLandmark?.ar || '', nearestLandmarkEn: provider.nearestLandmark?.en || '',
      images: provider.images,
      video: provider.video || '',
      logo: provider.logo || '',
      type: provider.type,
      bioAr: provider.bio?.ar || '', bioEn: provider.bio?.en || '',
      workingHoursAr: provider.workingHours?.ar || '', workingHoursEn: provider.workingHours?.en || '',
      approximatePricesAr: provider.approximatePrices?.ar || '', approximatePricesEn: provider.approximatePrices?.en || '',
      isEmergency24h: provider.isEmergency24h || false
    });
    setShowProviderForm(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
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
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
      <div className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
          </h2>
        </div>

        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <LayoutDashboard className="w-5 h-5" />
            {language === 'ar' ? 'الإحصائيات' : 'Dashboard'}
          </button>
          <button onClick={() => setActiveTab('recent')} className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'recent' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Clock className="w-5 h-5" />
            {language === 'ar' ? 'الإضافات الأخيرة' : 'Recent Additions'}
          </button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Users className="w-5 h-5" />
            {language === 'ar' ? 'المستخدمون' : 'Users'}
          </button>
          <button onClick={() => setActiveTab('content')} className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Activity className="w-5 h-5" />
            {language === 'ar' ? 'مركز التحكم بالمحتوى' : 'Content Center'}
          </button>
          <button onClick={() => setActiveTab('media')} className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'media' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <ImageIcon className="w-5 h-5" />
            {language === 'ar' ? 'مكتبة الوسائط' : 'Media Library'}
          </button>
          <button onClick={() => setActiveTab('live_browse')} className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'live_browse' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Activity className="w-5 h-5" />
            {language === 'ar' ? 'تصفح مباشر (تحكم)' : 'Live Browse (Control)'}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Settings className="w-5 h-5" />
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {isMockMode && (
          <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center gap-4 text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <p className="font-bold">{language === 'ar' ? 'تنبيه: قاعدة البيانات غير متصلة' : 'Warning: Database Not Connected'}</p>
              <p className="text-sm opacity-80">{language === 'ar' ? 'التطبيق يعمل حالياً في وضع المحاكاة (Mock Mode). لن يتم حفظ أي تغييرات دائمة.' : 'App is running in Mock Mode. No permanent changes will be saved.'}</p>
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h1 className="text-3xl font-bold mb-8">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{language === 'ar' ? 'عدد المستخدمين' : 'Users'}</h3>
                  <p className="text-4xl font-black">{stats.users}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-4">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{language === 'ar' ? 'الطلبات النشطة' : 'Active Requests'}</h3>
                  <p className="text-4xl font-black">{stats.activeOrders}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{language === 'ar' ? 'الخدمات' : 'Services'}</h3>
                  <p className="text-4xl font-black">{stats.services}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</h3>
                  <p className="text-4xl font-black">{stats.orders}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 relative group">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{language === 'ar' ? 'عدد الزوار' : 'Visitors'}</h3>
                  <p className="text-4xl font-black">{stats.visitors}</p>
                  <button 
                    onClick={handleResetVisitors}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                    title={language === 'ar' ? 'تصفير العداد' : 'Reset Counter'}
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}



          {/* Recent Additions Tab */}
          {activeTab === 'recent' && (
            <motion.div key="recent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h1 className="text-3xl font-bold mb-8">{language === 'ar' ? 'الإضافات الأخيرة' : 'Recent Additions'}</h1>
              <div className="flex flex-col gap-4">
                {allProviders.slice(0, 10).map(provider => (
                  <div key={provider.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800">
                    <img src={provider.image} alt={provider.name[language]} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{provider.name[language]}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{provider.specialty[language]}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-bold ${provider.type === 'mobile' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {provider.type === 'mobile' ? (language === 'ar' ? 'متنقل' : 'Mobile') : (language === 'ar' ? 'ثابت' : 'Fixed')}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminUserList />
            </motion.div>
          )}

          {/* Content Center Tab */}
          {activeTab === 'content' && (
            <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminContentCenter 
                categories={categories}
                providers={allProviders}
                language={language}
                onAddProvider={(catId) => { 
                  setEditingProviderId(null);
                  if (catId) setFormData(prev => ({ ...prev, categoryId: catId }));
                  setShowProviderForm(true);
                }}
                onEditProvider={handleEditProvider}
                onDeleteProvider={handleDeleteProvider}
                onAddSubService={handleAddSubService}
                onAddCategory={() => {
                  setEditingCategoryId(null);
                  setCategoryFormData({
                    id: `cat-${Date.now()}`,
                    iconName: 'Sparkles',
                    labelAr: '',
                    labelEn: '',
                    color: 'from-purple-500 to-pink-500'
                  });
                  setShowCategoryForm(true);
                }}
                onEditCategory={(cat) => {
                  setEditingCategoryId(cat.id);
                  setCategoryFormData({
                    id: cat.id,
                    iconName: cat.iconName,
                    labelAr: cat.label.ar,
                    labelEn: cat.label.en,
                    color: cat.color
                  });
                  setShowCategoryForm(true);
                }}
                onDeleteCategory={(catId) => {
                  console.log('Attempting to delete category:', catId);
                  setCategories(prev => prev.filter(c => c.id !== catId));
                }}
              />

              {/* Category Form Modal */}
              <AnimatePresence>
                {showCategoryForm && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
                    >
                      <h2 className="text-2xl font-bold mb-6">
                        {editingCategoryId ? (language === 'ar' ? 'تعديل القسم' : 'Edit Category') : (language === 'ar' ? 'إضافة قسم جديد' : 'Add New Category')}
                      </h2>
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          placeholder={language === 'ar' ? 'الاسم بالعربية' : 'Name in Arabic'} 
                          value={categoryFormData.labelAr}
                          onChange={e => setCategoryFormData({ ...categoryFormData, labelAr: e.target.value })}
                          className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input 
                          type="text" 
                          placeholder={language === 'ar' ? 'الاسم بالإنجليزية' : 'Name in English'} 
                          value={categoryFormData.labelEn}
                          onChange={e => setCategoryFormData({ ...categoryFormData, labelEn: e.target.value })}
                          className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <select 
                            value={categoryFormData.iconName}
                            onChange={e => setCategoryFormData({ ...categoryFormData, iconName: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="Sparkles">Sparkles</option>
                            <option value="Stethoscope">Stethoscope</option>
                            <option value="Scale">Scale</option>
                            <option value="Hammer">Hammer</option>
                            <option value="Wrench">Wrench</option>
                            <option value="Car">Car</option>
                            <option value="ShoppingBag">ShoppingBag</option>
                            <option value="Utensils">Utensils</option>
                          </select>
                          <select 
                            value={categoryFormData.color}
                            onChange={e => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="from-purple-500 to-pink-500">Purple/Pink</option>
                            <option value="from-blue-500 to-cyan-500">Blue/Cyan</option>
                            <option value="from-emerald-500 to-teal-500">Emerald/Teal</option>
                            <option value="from-orange-500 to-red-500">Orange/Red</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-8">
                        <button 
                          onClick={() => setShowCategoryForm(false)}
                          className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold"
                        >
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button 
                          onClick={() => {
                            const newCat: Category = {
                              id: categoryFormData.id,
                              iconName: categoryFormData.iconName,
                              label: { ar: categoryFormData.labelAr, en: categoryFormData.labelEn || categoryFormData.labelAr },
                              color: categoryFormData.color,
                              subcategories: []
                            };
                            if (editingCategoryId) {
                              setCategories(prev => prev.map(c => c.id === editingCategoryId ? newCat : c));
                            } else {
                              setCategories(prev => [...prev, newCat]);
                            }
                            setShowCategoryForm(false);
                          }}
                          className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold"
                        >
                          {language === 'ar' ? 'حفظ' : 'Save'}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Provider Form Modal */}
              <AnimatePresence>
                {showProviderForm && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800 my-8"
                    >
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">
                          {editingProviderId ? (language === 'ar' ? 'تعديل مقدم الخدمة' : 'Edit Provider') : (language === 'ar' ? 'إضافة مقدم خدمة' : 'Add Provider')}
                        </h2>
                        {showSuccess && (
                          <span className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/10 px-4 py-2 rounded-xl">
                            <CheckCircle2 className="w-5 h-5" />
                            {language === 'ar' ? 'تمت العملية بنجاح!' : 'Success!'}
                          </span>
                        )}
                        <button onClick={() => setShowProviderForm(false)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-all">
                          <ArrowLeft className="w-6 h-6" />
                        </button>
                      </div>

                      <form 
                        id="admin-service-form"
                        className="flex flex-col gap-8"
                      >
                        {/* Progress Tabs */}
                        <div className="flex justify-between gap-2 mb-4 overflow-x-auto hide-scrollbar">
                          {['الأساسي', 'المهنية', 'الموقع', 'الوسائط'].map((label, i) => (
                            <button key={i} type="button" onClick={() => setActiveStep(i)} className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeStep === i ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* Step Content */}
                        {activeStep === 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required type="text" placeholder={language === 'ar' ? 'الاسم الثلاثي' : 'Full Name'} value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                            <input required type="text" placeholder={language === 'ar' ? 'اسم المكان / العنوان' : 'Place Name'} value={formData.placeNameAr} onChange={e => setFormData({...formData, placeNameAr: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                            <input required type="text" placeholder={language === 'ar' ? 'التخصص الدقيق' : 'Specialty'} value={formData.specialtyAr} onChange={e => setFormData({...formData, specialtyAr: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                            <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value, subcategoryId: 'all'})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none">
                              {categories.map(c => <option key={c.id} value={c.id}>{c.label[language]}</option>)}
                            </select>
                            {(() => {
                              const selectedCategory = categories.find(c => c.id === formData.categoryId);
                              if (selectedCategory?.subcategories && selectedCategory.subcategories.length > 0) {
                                return (
                                  <select value={formData.subcategoryId} onChange={e => setFormData({...formData, subcategoryId: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none md:col-span-2">
                                    <option value="all">{language === 'ar' ? 'الكل / عام' : 'All / General'}</option>
                                    {selectedCategory.subcategories.map(sub => (
                                      <option key={sub.id} value={sub.id}>{sub.label[language]}</option>
                                    ))}
                                  </select>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        )}

                        {activeStep === 1 && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input required type="text" placeholder={language === 'ar' ? 'الشهادة' : 'Certificate'} value={formData.certAr} onChange={e => setFormData({...formData, certAr: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                            <input required type="text" placeholder={language === 'ar' ? 'الخبرة (مثال: 5 سنوات)' : 'Experience'} value={formData.expAr} onChange={e => setFormData({...formData, expAr: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                            <input required type="number" min="1" max="5" step="0.1" placeholder={language === 'ar' ? 'التقييم (1-5)' : 'Rating (1-5)'} value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                          </div>
                        )}

                        {activeStep === 2 && (
                          <div className="flex flex-col gap-4">
                            <input required type="tel" placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                            
                            <button type="button" onClick={handleGetLocation} className="w-full py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2 font-bold">
                              <MapPin className="w-5 h-5" />
                              {language === 'ar' ? 'تحديد الموقع 📍' : 'Get Location 📍'}
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                              <input required type="number" step="any" placeholder="Latitude" value={formData.lat} onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                              <input required type="number" step="any" placeholder="Longitude" value={formData.lng} onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input type="text" placeholder={language === 'ar' ? 'أقرب نقطة دالة (بالعربية)' : 'Nearest Landmark (Arabic)'} value={formData.nearestLandmarkAr} onChange={e => setFormData({...formData, nearestLandmarkAr: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                              <input type="text" placeholder={language === 'ar' ? 'أقرب نقطة دالة (بالإنجليزية)' : 'Nearest Landmark (English)'} value={formData.nearestLandmarkEn} onChange={e => setFormData({...formData, nearestLandmarkEn: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                            </div>
                          </div>
                        )}

                        {activeStep === 3 && (
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                              {/* Logo Preview */}
                              {formData.logo && <img src={formData.logo} alt="Logo" className="w-20 h-20 rounded-xl object-cover" />}
                              <label className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 cursor-pointer hover:border-purple-500 transition-colors">
                                <Upload className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-500 font-medium">{language === 'ar' ? 'رفع شعار (Logo)' : 'Upload Logo'}</span>
                                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                              </label>

                              {/* Images Preview */}
                              <div className="flex gap-2 flex-wrap">
                                {formData.images.map((img, i) => <img key={i} src={img} alt="Preview" className="w-20 h-20 rounded-xl object-cover" />)}
                              </div>
                              <label className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 cursor-pointer hover:border-purple-500 transition-colors">
                                <Upload className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-500 font-medium">{language === 'ar' ? 'رفع صور متعددة' : 'Upload Multiple Images'}</span>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                              </label>

                              {/* Video Upload */}
                              {formData.video && <video src={formData.video} className="w-full h-40 rounded-xl object-cover" controls />}
                              <label className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 cursor-pointer hover:border-purple-500 transition-colors">
                                <Upload className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-500 font-medium">{language === 'ar' ? 'رفع فيديو' : 'Upload Video'}</span>
                                <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                              </label>
                              <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center gap-2 rounded-xl p-4 cursor-pointer border-2 transition-all ${formData.type === 'mobile' ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-bold' : 'border-slate-200 dark:border-slate-700'}`}>
                                  <input type="radio" name="type" value="mobile" checked={formData.type === 'mobile'} onChange={() => setFormData({...formData, type: 'mobile'})} className="hidden" />
                                  {language === 'ar' ? 'متنقل 🚗' : 'Mobile 🚗'}
                                </label>
                                <label className={`flex-1 flex items-center justify-center gap-2 rounded-xl p-4 cursor-pointer border-2 transition-all ${formData.type === 'fixed' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold' : 'border-slate-200 dark:border-slate-700'}`}>
                                  <input type="radio" name="type" value="fixed" checked={formData.type === 'fixed'} onChange={() => setFormData({...formData, type: 'fixed'})} className="hidden" />
                                  {language === 'ar' ? 'ثابت 🏢' : 'Fixed 🏢'}
                                </label>
                              </div>
                            </div>
                          </div>
                        )}



                        {/* Navigation */}
                        <div className="flex gap-4">
                          {activeStep > 0 && (
                            <button type="button" onClick={() => setActiveStep(activeStep - 1)} className="flex-1 py-4 rounded-2xl bg-slate-200 dark:bg-slate-800 font-bold">
                              {language === 'ar' ? 'السابق' : 'Previous'}
                            </button>
                          )}
                          {activeStep < 3 ? (
                            <button type="button" onClick={() => setActiveStep(activeStep + 1)} className="flex-1 py-4 rounded-2xl bg-purple-600 text-white font-bold">
                              {language === 'ar' ? 'التالي' : 'Next'}
                            </button>
                          ) : (
                            <button type="button" onClick={(e) => {
                              const form = document.getElementById('admin-service-form') as HTMLFormElement;
                              if (form && form.reportValidity()) {
                                handleSubmit(e);
                              }
                            }} disabled={isSubmitting} className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg disabled:opacity-50">
                              {isSubmitting ? '...' : (language === 'ar' ? 'حفظ البيانات' : 'Save Data')}
                            </button>
                          )}
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Media Library Tab */}
          {activeTab === 'media' && (
            <motion.div key="media" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <MediaLibrary providers={allProviders} language={language} />
            </motion.div>
          )}

          {/* Live Browse Tab */}
          {activeTab === 'live_browse' && (
            <motion.div key="live_browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 h-[calc(100vh-200px)] overflow-y-auto">
                <MainApp 
                  onBack={() => setActiveTab('dashboard')}
                  language={language}
                  setLanguage={setLanguage}
                  allProviders={allProviders}
                  setAllProviders={setAllProviders}
                  currentUser={{ uid: 'admin', role: 'admin', displayName: 'Admin' }}
                  setCurrentUser={() => {}}
                  appSettings={appSettings}
                  isAdmin={true}
                  location={location}
                  locationError={locationError}
                />
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}</h1>
                {settingsSuccess && (
                  <span className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/10 px-4 py-2 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                    {language === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved Successfully!'}
                  </span>
                )}
              </div>

              <form 
                id="admin-settings-form"
                className="bg-card-bg dark:bg-card-bg-dark p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-8 max-w-2xl"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-bg-app dark:bg-bg-app-dark rounded-xl mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-text-app dark:text-text-app-dark">{language === 'ar' ? 'تفعيل خرائط جوجل' : 'Enable Google Maps'}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{language === 'ar' ? 'تفعيل الخريطة التفاعلية في نموذج الانضمام' : 'Enable interactive map in the join form'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settingsForm.enableMaps} onChange={(e) => setSettingsForm({ ...settingsForm, enableMaps: e.target.checked })} />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{language === 'ar' ? 'مفتاح Google Maps API' : 'Google Maps API Key'}</h3>
                    <input 
                      type="text" 
                      placeholder="AIzaSy..." 
                      value={settingsForm.googleMapsApiKey} 
                      onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsApiKey: e.target.value })} 
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'ar' 
                        ? 'يرجى إعداد المفتاح لتفعيل الخريطة. إذا تركته فارغاً أو عطلت الخيار أعلاه، سيتم عرض الإحداثيات فقط.' 
                        : 'Please set up the key to enable the map. If left empty or disabled, only coordinates will be displayed.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-700 pt-8">
                  <h3 className="font-bold text-xl mb-2">{language === 'ar' ? 'التحكم في الأيقونات العلوية' : 'Top Icons Control'}</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-bg-app dark:bg-bg-app-dark rounded-xl">
                    <div>
                      <h3 className="font-bold text-lg text-text-app dark:text-text-app-dark">{language === 'ar' ? 'أيقونة الإعدادات' : 'Settings Icon'}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{language === 'ar' ? 'إظهار أو إخفاء أيقونة الإعدادات (اللغة والمظهر)' : 'Show or hide the settings icon (Language & Theme)'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settingsForm.showSettingsIcon} onChange={(e) => setSettingsForm({ ...settingsForm, showSettingsIcon: e.target.checked })} />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-app dark:bg-bg-app-dark rounded-xl">
                    <div>
                      <h3 className="font-bold text-lg text-text-app dark:text-text-app-dark">{language === 'ar' ? 'أيقونة النبذة (المعلومات)' : 'Info Icon'}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{language === 'ar' ? 'إظهار أو إخفاء أيقونة المعلومات عن التطبيق' : 'Show or hide the info icon about the app'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settingsForm.showInfoIcon} onChange={(e) => setSettingsForm({ ...settingsForm, showInfoIcon: e.target.checked })} />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-app dark:bg-bg-app-dark rounded-xl">
                    <div>
                      <h3 className="font-bold text-lg text-text-app dark:text-text-app-dark">{language === 'ar' ? 'أيقونة الطوارئ' : 'Emergency Icon'}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{language === 'ar' ? 'إظهار أو إخفاء أيقونة الاتصال بالطوارئ' : 'Show or hide the emergency call icon'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settingsForm.showEmergencyIcon} onChange={(e) => setSettingsForm({ ...settingsForm, showEmergencyIcon: e.target.checked })} />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-red-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-app dark:bg-bg-app-dark rounded-xl">
                    <div>
                      <h3 className="font-bold text-lg text-text-app dark:text-text-app-dark">{language === 'ar' ? 'أيقونة الإدارة' : 'Admin Icon'}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{language === 'ar' ? 'إظهار أو إخفاء أيقونة الدخول للوحة الإدارة' : 'Show or hide the admin login icon'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settingsForm.showAdminIcon} onChange={(e) => setSettingsForm({ ...settingsForm, showAdminIcon: e.target.checked })} />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-700 pt-8">
                  <h3 className="font-bold text-xl mb-2">{language === 'ar' ? 'نصوص الواجهة الترحيبية' : 'Welcome Screen Texts'}</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold opacity-70">{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</label>
                        <input 
                          type="text" 
                          value={settingsForm.welcomeTitle?.ar} 
                          onChange={(e) => setSettingsForm({ ...settingsForm, welcomeTitle: { ...settingsForm.welcomeTitle!, ar: e.target.value } })} 
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold opacity-70">{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</label>
                        <input 
                          type="text" 
                          value={settingsForm.welcomeTitle?.en} 
                          onChange={(e) => setSettingsForm({ ...settingsForm, welcomeTitle: { ...settingsForm.welcomeTitle!, en: e.target.value } })} 
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold opacity-70">{language === 'ar' ? 'الوصف (عربي)' : 'Subtitle (Arabic)'}</label>
                        <input 
                          type="text" 
                          value={settingsForm.welcomeSubtitle?.ar} 
                          onChange={(e) => setSettingsForm({ ...settingsForm, welcomeSubtitle: { ...settingsForm.welcomeSubtitle!, ar: e.target.value } })} 
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold opacity-70">{language === 'ar' ? 'الوصف (إنجليزي)' : 'Subtitle (English)'}</label>
                        <input 
                          type="text" 
                          value={settingsForm.welcomeSubtitle?.en} 
                          onChange={(e) => setSettingsForm({ ...settingsForm, welcomeSubtitle: { ...settingsForm.welcomeSubtitle!, en: e.target.value } })} 
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-purple-500 outline-none" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold opacity-70">{language === 'ar' ? 'رقم الطوارئ' : 'Emergency Number'}</label>
                      <input 
                        type="text" 
                        value={settingsForm.emergencyNumber} 
                        onChange={(e) => setSettingsForm({ ...settingsForm, emergencyNumber: e.target.value })} 
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-red-500 outline-none font-mono" 
                      />
                    </div>
                  </div>
                </div>

                {/* Wallet Settings */}
                <div className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-700 pt-8">
                  <div className="flex items-center justify-between p-4 bg-bg-app dark:bg-bg-app-dark rounded-xl mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-text-app dark:text-text-app-dark">{language === 'ar' ? 'تفعيل المحفظة (الدعم)' : 'Enable Wallet (Support)'}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{language === 'ar' ? 'إظهار أيقونة الدعم المالي في القائمة العلوية' : 'Show financial support icon in the top bar'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settingsForm.walletInfo?.showWallet} onChange={(e) => setSettingsForm({ ...settingsForm, walletInfo: { ...settingsForm.walletInfo!, showWallet: e.target.checked } })} />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-yellow-500"></div>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{language === 'ar' ? 'رقم زين كاش' : 'Zain Cash Number'}</h3>
                      <input 
                        type="text" 
                        value={settingsForm.walletInfo?.zainCash} 
                        onChange={(e) => setSettingsForm({ ...settingsForm, walletInfo: { ...settingsForm.walletInfo!, zainCash: e.target.value } })} 
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 outline-none font-mono text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{language === 'ar' ? 'رقم الماستر كارد' : 'MasterCard Number'}</h3>
                      <input 
                        type="text" 
                        value={settingsForm.walletInfo?.masterCard} 
                        onChange={(e) => setSettingsForm({ ...settingsForm, walletInfo: { ...settingsForm.walletInfo!, masterCard: e.target.value } })} 
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 outline-none font-mono text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{language === 'ar' ? 'رقم الدعم المباشر' : 'Direct Support Number'}</h3>
                      <input 
                        type="text" 
                        value={settingsForm.walletInfo?.supportPhone} 
                        onChange={(e) => setSettingsForm({ ...settingsForm, walletInfo: { ...settingsForm.walletInfo!, supportPhone: e.target.value } })} 
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm" 
                      />
                    </div>
                  </div>
                </div>

                <button type="button" onClick={(e) => {
                  const form = document.getElementById('admin-settings-form') as HTMLFormElement;
                  if (form && form.reportValidity()) {
                    handleSaveSettings(e);
                  }
                }} disabled={isSettingsSubmitting} className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg disabled:opacity-50 mt-4">
                  {isSettingsSubmitting ? '...' : (language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings')}
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  </div>
);
}
