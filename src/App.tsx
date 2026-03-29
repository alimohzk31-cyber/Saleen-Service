import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MainApp } from './components/MainApp';
import { AdminPanel } from './components/AdminPanel';
import { AlertTriangle } from 'lucide-react';
import { Provider, AppSettings } from './types';

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'ar';
  });
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'home' | 'admin'>(() => {
    return (localStorage.getItem('currentScreen') as 'welcome' | 'home' | 'admin') || 'welcome';
  });
  
  // Local state for providers (fetched from Supabase/PostgreSQL)
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  
  // Mock current user (always null for guest, or mock admin if needed)
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('localSettings');
    if (saved) return JSON.parse(saved);
    return {};
  });
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Check health and mock status
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const healthResponse = await fetch('/api/health', { signal: controller.signal });
          clearTimeout(timeoutId);
          const healthData = await healthResponse.json();
          setIsMockMode(healthData.isMock);
        } catch (e: any) {
          if (e.name !== 'AbortError') {
            console.error('Health check failed:', e);
          }
        }

        // Fetch services from backend
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const response = await fetch('/api/services', { signal: controller.signal });
          clearTimeout(timeoutId);
          if (response.ok) {
            const result = await response.json();
            const mappedProviders: Provider[] = result.data.map((service: any) => ({
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
            }));
            setAllProviders(mappedProviders);
          }
        } catch (e: any) {
          if (e.name !== 'AbortError') {
            console.error('Failed to fetch services:', e);
          }
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
      <div className="min-h-screen w-full flex items-center justify-center bg-neon-dark text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full transition-colors duration-500 bg-neon-dark text-white">
      {isMockMode && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-[10px] font-bold py-1 px-4 z-[9999] flex items-center justify-center gap-2 shadow-lg">
          <AlertTriangle className="w-3 h-3" />
          <span>MOCK MODE - DATABASE NOT CONNECTED</span>
        </div>
      )}

      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          language={language} 
          setLanguage={setLanguage}
          onEnter={() => setCurrentScreen('home')}
          onAdminLogin={() => {
            setCurrentUser({ uid: 'admin', role: 'admin' });
            setCurrentScreen('admin');
          }}
          appSettings={appSettings}
        />
      )}
      {currentScreen === 'home' && (
        <MainApp 
          onBack={() => setCurrentScreen('welcome')} 
          language={language} 
          setLanguage={setLanguage}
          allProviders={allProviders}
          setAllProviders={setAllProviders}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          appSettings={appSettings}
        />
      )}
      {currentScreen === 'admin' && (
        <AdminPanel 
          onBack={() => {
            setCurrentUser(null);
            setCurrentScreen('welcome');
          }} 
          language={language} 
          allProviders={allProviders}
          setAllProviders={setAllProviders}
          appSettings={appSettings}
          setAppSettings={setAppSettings}
          setLanguage={setLanguage}
          isMockMode={isMockMode}
        />
      )}
    </div>
  );
}
