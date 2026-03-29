import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, Loader2, ChevronLeft, CheckCircle2, MessageSquare } from 'lucide-react';
import { Language } from '../App';
import { supabase } from '../lib/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: 'light' | 'dark';
  onSuccess: (user: any) => void;
}

type AuthStep = 'selection' | 'phone' | 'phone_otp' | 'email_register' | 'email_login' | 'email_verify' | 'success';

export function AuthModal({ isOpen, onClose, language, theme, onSuccess }: Props) {
  const [step, setStep] = useState<AuthStep>('selection');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const resetAuth = () => {
    setStep('phone');
    setError(null);
    setLoading(false);
    setOtp('');
    setFormData({ name: '', phone: '', email: '', password: '' });
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not initialized');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formData.phone,
      });
      if (error) throw error;
      setStep('phone_otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not initialized');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formData.phone,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
      onSuccess(data.user);
      setStep('success');
      setTimeout(() => {
        onClose();
        resetAuth();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  const t = {
    ar: {
      login: 'تسجيل الدخول',
      phone: 'رقم الهاتف',
      fullName: 'الاسم الكامل',
      continue: 'متابعة',
      verify: 'تحقق',
      otpSent: 'تم إرسال رمز التحقق إلى رقمك',
      enterOtp: 'أدخل الرمز المكون من 6 أرقام',
      back: 'رجوع',
      success: 'تم تسجيل الدخول بنجاح',
      resend: 'إعادة إرسال الرمز'
    },
    en: {
      login: 'Login',
      phone: 'Phone Number',
      fullName: 'Full Name',
      continue: 'Continue',
      verify: 'Verify',
      otpSent: 'OTP sent to your number',
      enterOtp: 'Enter 6-digit code',
      back: 'Back',
      success: 'Logged in successfully',
      resend: 'Resend Code'
    }
  }[language];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              {step !== 'phone' && step !== 'success' && (
                <button 
                  onClick={() => setStep('phone')}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
                >
                  <ChevronLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                </button>
              )}
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {step === 'success' ? t.success : t.login}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.form 
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePhoneSubmit}
                className="space-y-4"
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" required placeholder={t.fullName}
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" required placeholder={t.phone}
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit" disabled={loading}
                  className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {t.continue}
                </button>
              </motion.form>
            )}

            {step === 'phone_otp' && (
              <motion.form 
                key="otp"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleOTPSubmit}
                className="space-y-6 text-center"
              >
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 inline-block mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t.otpSent}</h3>
                <p className="text-sm text-slate-400">{t.enterOtp}</p>
                <input 
                  type="text" required maxLength={6} autoFocus
                  value={otp} onChange={e => setOtp(e.target.value)}
                  className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-center text-3xl font-black tracking-[1em] focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
                <button 
                  type="submit" disabled={loading || otp.length < 6}
                  className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {t.verify}
                </button>
                <button type="button" className="text-primary text-sm font-bold hover:underline">{t.resend}</button>
              </motion.form>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t.success}</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
