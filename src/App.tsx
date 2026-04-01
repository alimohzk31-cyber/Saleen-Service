import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MainApp } from './components/MainApp';
import { AdminPanel } from './components/AdminPanel';
import { Provider, AppSettings } from './types';
import { useGeolocation } from './utils/geo';
import { supabase } from './lib/supabaseClient';

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'ar';
  });
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'home' | 'admin'>(() => {
    const savedScreen = localStorage.getItem('currentScreen');
    const lastActivity = localStorage.getItem('lastActivity');
    const now = Date.now();
    const timeout = 30 * 60 * 1000; // 30 minutes in milliseconds

    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity);
      if (!isNaN(lastActivityTime) && now - lastActivityTime > timeout) {
        console.log('Session timed out, redirecting to welcome screen');
        localStorage.setItem('currentScreen', 'welcome');
        return 'welcome';
      }
    }

    console.log('Initializing currentScreen from localStorage:', savedScreen);
    return (savedScreen as 'welcome' | 'home' | 'admin') || 'welcome';
  });

  // Update last activity on every render/interaction
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Update immediately
    updateActivity();

    // Also update on common interactions
    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('touchstart', updateActivity);
    window.addEventListener('keydown', updateActivity);

    return () => {
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, []);

  const handleScreenChange = (screen: 'welcome' | 'home' | 'admin') => {
    console.log('Setting screen to:', screen);
    localStorage.setItem('currentScreen', screen);
    setCurrentScreen(screen);
  };
  
  // Local state for providers (fetched from Supabase)
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  
  // Mock current user (always null for guest, or mock admin if needed)
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('localSettings');
    if (saved) return JSON.parse(saved);
    return {};
  });
  const { location, error: locationError } = useGeolocation();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Fetch services from Supabase
        if (supabase) {
          const { data, error } = await supabase.from('services').select('*');
          if (error) {
            console.error('Failed to fetch services from Supabase:', error);
          } else if (data) {
            const mappedProviders: Provider[] = data.map((service: any) => ({
              id: String(service.id),
              categoryId: String(service.category_id),
              subcategoryId: service.subcategory_id || 'all',
              name: { ar: service.provider_name || service.title, en: service.provider_name || service.title },
              specialty: { ar: service.title, en: service.title },
              image: service.image_url || 'https://picsum.photos/seed/service/400/300',
              images: [service.image_url || 'https://picsum.photos/seed/service/400/300'],
              video: service.video_url || '',
              locationName: { ar: service.description || 'موقع غير محدد', en: service.description || 'Unknown Location' },
              lat: service.lat || 0,
              lng: service.lng || 0,
              type: service.service_type || 'mobile',
              phone: service.phone || '0000000000',
              rating: parseFloat(service.average_rating) || 0,
              experience: { ar: service.experience || '', en: service.experience || '' },
              certificates: Array.isArray(service.certificates) ? service.certificates : [],
              bio: { ar: service.bio || '', en: service.bio || '' },
              createdAt: new Date(service.created_at).getTime(),
              views: service.views || 0,
            }));
            setAllProviders(mappedProviders);
          }
        } else {
          console.warn('Supabase client not initialized.');
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsAuthReady(true);
      }
    };
    
    initApp();
  }, []);

  useEffect(() => {
    console.log('Saving currentScreen to localStorage:', currentScreen);
    localStorage.setItem('currentScreen', currentScreen);
  }, [currentScreen]);

  useEffect(() => {
    localStorage.setItem('localSettings', JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          language={language} 
          setLanguage={setLanguage}
          onEnter={() => handleScreenChange('home')} 
          onAdminLogin={() => handleScreenChange('admin')}
          appSettings={appSettings}
          isMockMode={!supabase}
        />
      )}
      {currentScreen === 'home' && (
        <MainApp 
          onBack={() => handleScreenChange('welcome')}
          language={language} 
          setLanguage={setLanguage}
          allProviders={allProviders}
          setAllProviders={setAllProviders}
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser}
          appSettings={appSettings}
          location={location}
          locationError={locationError}
          isMockMode={!supabase}
        />
      )}
      {currentScreen === 'admin' && (
        <AdminPanel 
          onBack={() => handleScreenChange('home')}
          language={language}
          allProviders={allProviders}
          setAllProviders={setAllProviders}
          appSettings={appSettings}
          setAppSettings={setAppSettings}
          setLanguage={setLanguage}
          isMockMode={!supabase}
          location={location}
          locationError={locationError}
        />
      )}
    </div>
  );
}
