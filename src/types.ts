export interface Category {
  id: string;
  iconName: string;
  label: { ar: string; en: string };
  color: string;
  subcategories: { id: string; label: { ar: string; en: string } }[];
}

export interface Provider {
  id: string;
  categoryId: string;
  subcategoryId: string;
  name: { ar: string; en: string };
  specialty: { ar: string; en: string };
  image: string;
  images: string[];
  video?: string;
  logo?: string;
  locationName: { ar: string; en: string };
  lat: number;
  lng: number;
  type: 'mobile' | 'fixed';
  phone: string;
  nearestLandmark?: { ar: string; en: string };
  rating: number;
  experience: { ar: string; en: string };
  certificates: { ar: string; en: string }[];
  bio?: { ar: string; en: string };
  tuition?: string;
  teachingStaff?: { ar: string; en: string };
  workingHours?: { ar: string; en: string };
  studentCount?: string;
  acceptedAge?: { ar: string; en: string };
  educationalPrograms?: { ar: string; en: string };
  activities?: { ar: string; en: string };
  departments?: { id: string; label: { ar: string; en: string }; icon: string }[];
  bedCount?: string;
  specialServices?: { ar: string; en: string };
  approximatePrices?: { ar: string; en: string };
  isEmergency24h?: boolean;
  createdAt?: number;
}

export interface Car {
  id: string;
  origin: 'american' | 'thai' | 'chinese' | 'korean' | 'iranian' | 'gulf';
  brand: { ar: string; en: string };
  model: { ar: string; en: string };
  year: number;
  price: number;
  condition: { ar: string; en: string };
  type: 'sedan' | 'suv' | 'truck' | 'other';
  image: string;
  images: string[];
  sellerName: string;
  sellerPhone: string;
  sellerWhatsApp?: string;
  location: { ar: string; en: string };
  description: { ar: string; en: string };
  createdAt: number;
}

export interface AppSettings {
  googleMapsApiKey?: string;
  enableMaps?: boolean;
  showSettingsIcon?: boolean;
  showInfoIcon?: boolean;
  walletInfo?: {
    zainCash: string;
    masterCard: string;
    showWallet: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  birth: string;
  job: string;
  otherJobs: string;
  bio: string;
  phone: string;
  city: string;
  image?: string;
  createdAt: number;
}
