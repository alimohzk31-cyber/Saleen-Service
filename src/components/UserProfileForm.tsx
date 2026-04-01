import React, { useState } from 'react';
import { UserProfile } from '../types';

export function UserProfileForm({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    name: '', age: '', job: '', phone: '', city: '', notes: ''
  });
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const profile: UserProfile = {
        id: 'guest_user',
        ...formData,
        image: image || undefined,
        createdAt: Date.now()
      };
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingIndex = users.findIndex((u: UserProfile) => u.id === profile.id);
      
      if (existingIndex >= 0) {
        users[existingIndex] = profile;
      } else {
        users.push(profile);
      }
      
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUserProfile', JSON.stringify(profile));
      onComplete();
    } catch (error) {
      console.error(error);
      alert('Error saving profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      id="user-profile-form"
      className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-bold mb-4">إنشاء الحساب</h2>
      <input type="text" placeholder="الاسم الثلاثي" className="w-full p-2 mb-2 border rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" onChange={e => setFormData({...formData, name: e.target.value})} required />
      <input 
        type="number" 
        placeholder="العمر" 
        className="w-full p-2 mb-2 border rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
        value={formData.age}
        onChange={e => {
          let val = e.target.value;
          if (val.length > 2) val = val.slice(0, 2);
          setFormData({...formData, age: val});
        }} 
        onBlur={e => {
          let val = e.target.value;
          if (val) {
            const num = parseInt(val);
            if (num > 99) val = "99";
            if (num < 1) val = "1";
            setFormData({...formData, age: val});
          }
        }}
        required 
      />
      <input type="text" placeholder="المهنة الحالية" className="w-full p-2 mb-2 border rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" onChange={e => setFormData({...formData, job: e.target.value})} required />
      <input type="text" placeholder="رقم الهاتف (اختياري)" className="w-full p-2 mb-2 border rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" onChange={e => setFormData({...formData, phone: e.target.value})} />
      <input type="text" placeholder="المدينة (اختياري)" className="w-full p-2 mb-2 border rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" onChange={e => setFormData({...formData, city: e.target.value})} />
      <textarea placeholder="ملاحظات" className="w-full p-2 mb-2 border rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white" onChange={e => setFormData({...formData, notes: e.target.value})} />
      <button type="button" onClick={(e) => {
        const form = document.getElementById('user-profile-form') as HTMLFormElement;
        if (form && form.reportValidity()) {
          handleSubmit(e);
        }
      }} disabled={isSubmitting} className="w-full p-2 bg-blue-600 text-white rounded">
        {isSubmitting ? 'جاري الحفظ...' : 'إنشاء الحساب'}
      </button>
    </form>
  );
}
