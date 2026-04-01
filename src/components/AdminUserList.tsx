import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { Shield, ShieldAlert, ShieldCheck, UserX, UserCheck, Search, Filter } from 'lucide-react';

export function AdminUserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'blocked'>('all');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId: number, status: 'active' | 'blocked') => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleToggleVerify = async (userId: number, is_verified: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/users/${userId}/verify`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_verified })
      });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling verification:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const name = user.name || '';
    const email = user.email || '';
    const phone = user.phone || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phone.includes(searchTerm);
    
    if (filter === 'verified') return matchesSearch && user.is_verified;
    if (filter === 'blocked') return matchesSearch && user.status === 'blocked';
    return matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">إدارة الحسابات</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="بحث عن مستخدم..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'verified' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}
            >
              الموثقون
            </button>
            <button 
              onClick={() => setFilter('blocked')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'blocked' ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}
            >
              المحظورون
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br ${user.status === 'blocked' ? 'from-slate-400 to-slate-600' : 'from-purple-500 to-pink-500'}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  {user.is_verified && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                  {user.role === 'admin' && <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 text-xs font-bold">AD</span>}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 space-y-0.5">
                  {user.email && <p>{user.email}</p>}
                  {user.phone && <p>{user.phone}</p>}
                  <p className="text-xs opacity-60">انضم في: {new Date(user.created_at).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleToggleVerify(user.id, !user.is_verified)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${user.is_verified ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400'}`}
                title={user.is_verified ? 'إلغاء التوثيق' : 'توثيق الحساب'}
              >
                <Shield className="w-4 h-4" />
                {user.is_verified ? 'موثق' : 'توثيق'}
              </button>

              {user.role !== 'admin' && (
                <button 
                  onClick={() => handleUpdateStatus(user.id, user.status === 'active' ? 'blocked' : 'active')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${user.status === 'blocked' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                >
                  {user.status === 'blocked' ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      تفعيل
                    </>
                  ) : (
                    <>
                      <UserX className="w-4 h-4" />
                      حظر
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500">لا يوجد مستخدمون يطابقون البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
