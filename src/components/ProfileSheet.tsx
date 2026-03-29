import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera } from 'lucide-react';
import { Language } from '../App';

interface Props {
  user: any;
  onClose: () => void;
  language: Language;
  setCurrentUser: React.Dispatch<React.SetStateAction<any | null>>;
}

export function ProfileSheet({ user, onClose, language, setCurrentUser }: Props) {
  const [name, setName] = useState(user.displayName || '');
  const [birth, setBirth] = useState('');
  const [job, setJob] = useState('');
  const [otherJobs, setOtherJobs] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [image, setImage] = useState<string | null>(user.photoURL);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const profileData = localStorage.getItem('currentUserProfile');
      if (profileData) {
        const data = JSON.parse(profileData);
        setName(data.name || user.displayName || '');
        setBirth(data.birth || '');
        setJob(data.job || '');
        setOtherJobs(data.otherJobs || '');
        setBio(data.bio || '');
        setPhone(data.phone || '');
        setCity(data.city || '');
        setImage(data.image || user.photoURL || null);
      }
    };
    fetchProfile();
  }, [user.uid, user.displayName, user.photoURL]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const profileData = {
        name,
        birth,
        job,
        otherJobs,
        bio,
        phone,
        city,
        image,
        email: user.email,
        updatedAt: Date.now()
      };
      localStorage.setItem('currentUserProfile', JSON.stringify(profileData));
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full max-w-md bg-card-bg dark:bg-card-bg-dark rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700"
      >
        <div className="flex justify-between items-center mb-6 text-text-app dark:text-text-app-dark">
          <h2 className="text-xl font-bold">{language === 'ar' ? 'تعديل الحساب' : 'Edit Profile'}</h2>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img src={image || ''} alt="Profile" className="w-24 h-24 rounded-full mb-4 border-4 border-primary object-cover" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-4 right-0 bg-primary p-2 rounded-full text-white"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>
          <h3 className="font-bold text-lg text-text-app dark:text-text-app-dark">{name}</h3>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={language === 'ar' ? 'الاسم الثلاثي' : 'Full Name'} className="w-full p-4 rounded-xl bg-bg-app dark:bg-bg-app-dark text-text-app dark:text-text-app-dark border border-slate-200 dark:border-slate-700" />
          <input type="date" value={birth} onChange={e => setBirth(e.target.value)} className="w-full p-4 rounded-xl bg-bg-app dark:bg-bg-app-dark text-text-app dark:text-text-app-dark border border-slate-200 dark:border-slate-700" />
          <input type="text" value={job} onChange={e => setJob(e.target.value)} placeholder={language === 'ar' ? 'المهنة الحالية' : 'Current Job'} className="w-full p-4 rounded-xl bg-bg-app dark:bg-bg-app-dark text-text-app dark:text-text-app-dark border border-slate-200 dark:border-slate-700" />
          <input type="text" value={otherJobs} onChange={e => setOtherJobs(e.target.value)} placeholder={language === 'ar' ? 'أعمال أخرى' : 'Other Jobs'} className="w-full p-4 rounded-xl bg-bg-app dark:bg-bg-app-dark text-text-app dark:text-text-app-dark border border-slate-200 dark:border-slate-700" />
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} className="w-full p-4 rounded-xl bg-bg-app dark:bg-bg-app-dark text-text-app dark:text-text-app-dark border border-slate-200 dark:border-slate-700" />
          <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder={language === 'ar' ? 'المدينة' : 'City'} className="w-full p-4 rounded-xl bg-bg-app dark:bg-bg-app-dark text-text-app dark:text-text-app-dark border border-slate-200 dark:border-slate-700" />
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={language === 'ar' ? 'نبذة شخصية' : 'Bio'} className="w-full p-4 rounded-xl bg-bg-app dark:bg-bg-app-dark text-text-app dark:text-text-app-dark border border-slate-200 dark:border-slate-700" rows={3} />
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={saveProfile} disabled={loading} className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark">
            {loading ? '...' : (language === 'ar' ? 'حفظ' : 'Save')}
          </button>
          <button onClick={() => { 
            localStorage.removeItem('token');
            setCurrentUser(null);
            alert(language === 'ar' ? 'تم تسجيل الخروج' : 'Logged out'); 
            onClose(); 
          }} className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20">
            {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
