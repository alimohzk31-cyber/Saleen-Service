import React, { useState } from 'react';
import { UserProfile } from '../types';

export function UserProfileForm({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    name: '', birth: '', job: '', phone: '', city: '', notes: ''
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
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">إنشاء الحساب</h2>
      <input type="text" placeholder="الاسم الثلاثي" className="w-full p-2 mb-2 border rounded" onChange={e => setFormData({...formData, name: e.target.value})} required />
      <input type="text" placeholder="تاريخ الميلاد" className="w-full p-2 mb-2 border rounded" onChange={e => setFormData({...formData, birth: e.target.value})} required />
      <input type="text" placeholder="المهنة الحالية" className="w-full p-2 mb-2 border rounded" onChange={e => setFormData({...formData, job: e.target.value})} required />
      <input type="text" placeholder="رقم الهاتف" className="w-full p-2 mb-2 border rounded" onChange={e => setFormData({...formData, phone: e.target.value})} required />
      <input type="text" placeholder="المدينة" className="w-full p-2 mb-2 border rounded" onChange={e => setFormData({...formData, city: e.target.value})} required />
      <textarea placeholder="ملاحظات" className="w-full p-2 mb-2 border rounded" onChange={e => setFormData({...formData, notes: e.target.value})} />
      <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-blue-600 text-white rounded">
        {isSubmitting ? 'جاري الحفظ...' : 'إنشاء الحساب'}
      </button>
    </form>
  );
}
