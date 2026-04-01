import { Category, Provider } from '../types';

export const categories: Category[] = [
  {
    id: 'mosques_husseiniyas',
    iconName: 'MoonStar',
    label: { ar: 'جوامع وحسينيات', en: 'Mosques & Husseiniyas' },
    color: 'from-emerald-600 to-teal-800',
    subcategories: [
      { id: 'mosques', label: { ar: 'جوامع', en: 'Mosques' } },
      { id: 'husseiniyas', label: { ar: 'حسينيات', en: 'Husseiniyas' } }
    ]
  },
  {
    id: 'official_departments',
    iconName: 'Building',
    label: { ar: 'الدوائر الرسمية', en: 'Official Departments' },
    color: 'from-slate-500 to-slate-700',
    subcategories: [
      { id: 'gov_deps', label: { ar: 'حكومي', en: 'Government' } },
      { id: 'priv_deps', label: { ar: 'أهلي', en: 'Private' } }
    ]
  },
  {
    id: 'banks',
    iconName: 'Banknote',
    label: { ar: 'المصارف', en: 'Banks' },
    color: 'from-yellow-500 to-amber-600',
    subcategories: [
      { id: 'gov_banks', label: { ar: 'مصارف حكومية', en: 'Government Banks' } },
      { id: 'priv_banks', label: { ar: 'مصارف أهلية', en: 'Private Banks' } }
    ]
  },
  {
    id: 'universities',
    iconName: 'GraduationCap',
    label: { ar: 'الجامعات', en: 'Universities' },
    color: 'from-indigo-500 to-purple-600',
    subcategories: [
      { id: 'gov_universities', label: { ar: 'جامعات حكومية', en: 'Government Universities' } },
      { id: 'priv_universities', label: { ar: 'جامعات أهلية', en: 'Private Universities' } }
    ]
  },
  {
    id: 'schools',
    iconName: 'GraduationCap',
    label: { ar: 'المدارس', en: 'Schools' },
    color: 'from-blue-500 to-indigo-500',
    subcategories: [
      { id: 'public_primary', label: { ar: 'حكومي - ابتدائي', en: 'Public - Primary' } },
      { id: 'public_intermediate', label: { ar: 'حكومي - متوسط', en: 'Public - Intermediate' } },
      { id: 'public_secondary', label: { ar: 'حكومي - إعدادي', en: 'Public - Secondary' } },
      { id: 'private_primary', label: { ar: 'أهلي - ابتدائي', en: 'Private - Primary' } },
      { id: 'private_intermediate', label: { ar: 'أهلي - متوسط', en: 'Private - Intermediate' } },
      { id: 'private_secondary', label: { ar: 'أهلي - إعدادي', en: 'Private - Secondary' } },
      { id: 'kindergarten', label: { ar: 'رياض الأطفال', en: 'Kindergarten' } }
    ]
  },
  {
    id: 'hospitals',
    iconName: 'Hospital',
    label: { ar: 'المستشفيات', en: 'Hospitals' },
    color: 'from-red-500 to-pink-500',
    subcategories: [
      { id: 'public', label: { ar: 'مستشفيات حكومية', en: 'Public Hospitals' } },
      { id: 'private', label: { ar: 'مستشفيات أهلية', en: 'Private Hospitals' } }
    ]
  },
  {
    id: 'civil_defense',
    iconName: 'ShieldAlert',
    label: { ar: 'الدفاع المدني', en: 'Civil Defense' },
    color: 'from-orange-500 to-yellow-500',
    subcategories: [
    { id: 'fire', label: { ar: 'إطفاء', en: 'Firefighting' } },
      { id: 'rescue', label: { ar: 'إنقاذ', en: 'Rescue' } },
    ]
  },
  {
    id: 'police',
    iconName: 'Shield',
    label: { ar: 'مراكز الشرطة', en: 'Police Stations' },
    color: 'from-slate-600 to-slate-800',
    subcategories: [
    { id: 'station', label: { ar: 'مركز شرطة', en: 'Police Station' } },
      { id: 'traffic', label: { ar: 'مرور', en: 'Traffic' } },
    ]
  },
  {
    id: 'gas_stations',
    iconName: 'Fuel',
    label: { ar: 'محطات الوقود', en: 'Gas Stations' },
    color: 'from-green-500 to-emerald-500',
    subcategories: [
    { id: 'gas', label: { ar: 'بنزين', en: 'Gasoline' } },
      { id: 'diesel', label: { ar: 'ديزل', en: 'Diesel' } },
    ]
  },
  {
    id: 'football_fields',
    iconName: 'Trophy',
    label: { ar: 'ملاعب كرة القدم', en: 'Football Fields' },
    color: 'from-emerald-600 to-green-700',
    subcategories: [
    { id: 'indoor', label: { ar: 'ملاعب مغلقة', en: 'Indoor' } },
      { id: 'outdoor', label: { ar: 'ملاعب مفتوحة', en: 'Outdoor' } },
    ]
  },
  {
    id: 'construction_plumbing',
    iconName: 'HardHat',
    label: { ar: 'الإنشائيات والصحيات', en: 'Construction & Plumbing' },
    color: 'from-amber-500 to-orange-700',
    subcategories: [
    { id: 'contracting', label: { ar: 'مقاولات إنشائية', en: 'Construction Contracting' } },
      { id: 'plumbing', label: { ar: 'أعمال صحية', en: 'Plumbing Works' } },
      { id: 'painting', label: { ar: 'دهانات وتجهيزات داخلية', en: 'Painting & Interior' } },
      { id: 'electrical', label: { ar: 'كهرباء وصيانة كهربائية', en: 'Electrical Maintenance' } },
      { id: 'hvac', label: { ar: 'صيانة التكييف والتبريد', en: 'HVAC Maintenance' } },
      { id: 'insulation', label: { ar: 'عزل مائي وحراري', en: 'Water & Heat Insulation' } },
      { id: 'ceramic', label: { ar: 'تركيب سيراميك وأرضيات', en: 'Ceramic & Flooring' } },
      { id: 'blacksmith', label: { ar: 'حدادة وأعمال ألمنيوم', en: 'Blacksmithing & Aluminum' } },
    ]
  },
  {
    id: 'doctors',
    iconName: 'Stethoscope',
    label: { ar: 'طبيب', en: 'Doctor' },
    color: 'from-blue-400 to-blue-600',
    subcategories: [
    { id: 'general', label: { ar: 'طب عام', en: 'General Medicine' } },
      { id: 'internal', label: { ar: 'باطنية', en: 'Internal Medicine' } },
      { id: 'derma', label: { ar: 'جلدية', en: 'Dermatology' } },
      { id: 'radiology', label: { ar: 'أشعة', en: 'Radiology' } },
      { id: 'ct-scan', label: { ar: 'مفراس', en: 'CT Scan' } },
      { id: 'mri', label: { ar: 'رنين', en: 'MRI' } },
      { id: 'neurology', label: { ar: 'أعصاب', en: 'Neurology' } },
      { id: 'cardiology', label: { ar: 'قلب', en: 'Cardiology' } },
      { id: 'pediatrics', label: { ar: 'أطفال', en: 'Pediatrics' } },
      { id: 'obgyn', label: { ar: 'نسائية وتوليد', en: 'OB/GYN' } },
      { id: 'orthopedics', label: { ar: 'عظام', en: 'Orthopedics' } },
      { id: 'ophthalmology', label: { ar: 'عيون', en: 'Ophthalmology' } },
      { id: 'ent', label: { ar: 'أنف وأذن وحنجرة', en: 'ENT' } },
      { id: 'dental', label: { ar: 'أسنان', en: 'Dental' } },
      { id: 'labs', label: { ar: 'مختبرات', en: 'Laboratories' } },
      { id: 'emergency', label: { ar: 'طوارئ', en: 'Emergency' } },
      { id: 'oncology', label: { ar: 'أورام', en: 'Oncology' } },
      { id: 'physiotherapy', label: { ar: 'علاج طبيعي', en: 'Physiotherapy' } },
      { id: 'psychiatry', label: { ar: 'نفسي', en: 'Psychiatry' } },
    ]
  },
  {
    id: 'pharmacy',
    iconName: 'Pill',
    label: { ar: 'الصيدلة', en: 'Pharmacy' },
    color: 'from-emerald-400 to-emerald-600',
    subcategories: [
    { id: 'pharmacist', label: { ar: 'صيدلي', en: 'Pharmacist' } },
      { id: 'private-pharmacy', label: { ar: 'صيدلية أهلية', en: 'Private Pharmacy' } },
      { id: 'med-supply', label: { ar: 'تجهيز أدوية', en: 'Medicine Supply' } },
      { id: 'consultation', label: { ar: 'استشارات دوائية', en: 'Medical Consultations' } },
    ]
  },
  {
    id: 'welding',
    iconName: 'Flame',
    label: { ar: 'اللحام', en: 'Welding' },
    color: 'from-orange-500 to-orange-700',
    subcategories: [
    { id: 'iron', label: { ar: 'لحام حديد', en: 'Iron Welding' } },
      { id: 'aluminum', label: { ar: 'لحام ألمنيوم', en: 'Aluminum Welding' } },
      { id: 'doors-windows', label: { ar: 'لحام أبواب وشبابيك', en: 'Doors & Windows Welding' } },
      { id: 'blacksmith', label: { ar: 'أعمال حدادة عامة', en: 'General Blacksmithing' } },
    ]
  },
  {
    id: 'agriculture',
    iconName: 'Sprout',
    label: { ar: 'الزراعة', en: 'Agriculture' },
    color: 'from-green-500 to-green-700',
    subcategories: [
    { id: 'planting', label: { ar: 'زراعة نباتات', en: 'Planting' } },
      { id: 'landscaping', label: { ar: 'تنسيق حدائق', en: 'Landscaping' } },
      { id: 'irrigation', label: { ar: 'ريّ وزراعة حديثة', en: 'Modern Irrigation & Farming' } },
      { id: 'nursery', label: { ar: 'مشاتل', en: 'Nurseries' } },
    ]
  },
  {
    id: 'carpentry',
    iconName: 'Hammer',
    label: { ar: 'نجار بيوت', en: 'Carpentry' },
    color: 'from-amber-600 to-amber-800',
    subcategories: [
    { id: 'furniture-making', label: { ar: 'تفصيل أثاث', en: 'Furniture Making' } },
      { id: 'furniture-repair', label: { ar: 'صيانة أثاث', en: 'Furniture Repair' } },
      { id: 'wooden-doors', label: { ar: 'أبواب خشبية', en: 'Wooden Doors' } },
      { id: 'kitchens', label: { ar: 'مطابخ', en: 'Kitchens' } },
    ]
  },
  {
    id: 'mechanics',
    iconName: 'Car',
    label: { ar: 'صيانة سيارات', en: 'Car Maintenance' },
    color: 'from-red-500 to-red-700',
    subcategories: [
    { id: 'mechanic', label: { ar: 'ميكانيك سيارات', en: 'Car Mechanics' } },
      { id: 'electric', label: { ar: 'كهرباء سيارات', en: 'Car Electricity' } },
      { id: 'oil', label: { ar: 'تبديل زيوت', en: 'Oil Change' } },
      { id: 'inspection', label: { ar: 'فحص أعطال', en: 'Fault Inspection' } },
    ]
  },
  {
    id: 'plumbers',
    iconName: 'Droplet',
    label: { ar: 'السباكة', en: 'Plumbing' },
    color: 'from-cyan-500 to-cyan-700',
    subcategories: [
    { id: 'pipes', label: { ar: 'تمديدات مياه', en: 'Water Pipes' } },
      { id: 'leaks', label: { ar: 'تصليح تسريبات', en: 'Leak Repair' } },
      { id: 'pumps', label: { ar: 'تركيب مضخات', en: 'Pump Installation' } },
      { id: 'sewage', label: { ar: 'صيانة مجاري', en: 'Sewage Maintenance' } },
    ]
  },
  {
    id: 'electricity',
    iconName: 'Zap',
    label: { ar: 'الكهرباء', en: 'Electricity' },
    color: 'from-yellow-400 to-yellow-600',
    subcategories: [
    { id: 'wiring', label: { ar: 'تمديدات كهربائية', en: 'Electrical Wiring' } },
      { id: 'repair', label: { ar: 'صيانة أعطال', en: 'Fault Repair' } },
      { id: 'lighting', label: { ar: 'تركيب إنارة', en: 'Lighting Installation' } },
      { id: 'generators', label: { ar: 'مولدات', en: 'Generators' } },
    ]
  },
  {
    id: 'hvac',
    iconName: 'Snowflake',
    label: { ar: 'التبريد والتكييف', en: 'HVAC' },
    color: 'from-sky-400 to-sky-600',
    subcategories: [
    { id: 'ac-repair', label: { ar: 'صيانة مكيفات', en: 'AC Repair' } },
      { id: 'ac-install', label: { ar: 'تركيب مكيفات', en: 'AC Installation' } },
      { id: 'fridge-repair', label: { ar: 'تصليح ثلاجات', en: 'Fridge Repair' } },
      { id: 'freon', label: { ar: 'فريون', en: 'Freon' } },
    ]
  },
  {
    id: 'construction',
    iconName: 'PaintRoller',
    label: { ar: 'البناء والديكور', en: 'Construction & Decor' },
    color: 'from-stone-500 to-stone-700',
    subcategories: [
    { id: 'painting', label: { ar: 'صبغ منازل', en: 'House Painting' } },
      { id: 'decor', label: { ar: 'ديكور داخلي', en: 'Interior Decor' } },
      { id: 'ceramic', label: { ar: 'تركيب سيراميك', en: 'Ceramic Installation' } },
      { id: 'gypsum', label: { ar: 'أعمال جبس', en: 'Gypsum Works' } },
    ]
  },
  {
    id: 'engineering',
    iconName: 'Building2',
    label: { ar: 'قسم الهندسة', en: 'Engineering' },
    color: 'from-blue-600 to-indigo-800',
    subcategories: [
    { id: 'civil', label: { ar: 'الهندسة المدنية', en: 'Civil Engineering' } },
      { id: 'architectural', label: { ar: 'الهندسة المعمارية', en: 'Architectural Engineering' } },
      { id: 'electrical', label: { ar: 'الهندسة الكهربائية', en: 'Electrical Engineering' } },
      { id: 'mechanical', label: { ar: 'الهندسة الميكانيكية', en: 'Mechanical Engineering' } },
      { id: 'software', label: { ar: 'هندسة البرمجيات', en: 'Software Engineering' } },
      { id: 'telecom', label: { ar: 'هندسة الاتصالات', en: 'Telecommunications' } },
      { id: 'industrial', label: { ar: 'الهندسة الصناعية', en: 'Industrial Engineering' } },
      { id: 'chemical', label: { ar: 'الهندسة الكيميائية', en: 'Chemical Engineering' } },
      { id: 'environmental', label: { ar: 'الهندسة البيئية', en: 'Environmental Engineering' } },
      { id: 'oil-gas', label: { ar: 'هندسة النفط والغاز', en: 'Oil and Gas Engineering' } },
      { id: 'aerospace', label: { ar: 'هندسة الطيران', en: 'Aerospace Engineering' } }
    ]
  },
  {
    id: 'mobiles',
    iconName: 'Smartphone',
    label: { ar: 'الموبايلات', en: 'Mobiles' },
    color: 'from-violet-500 to-fuchsia-600',
    subcategories: [
    { id: 'maintenance', label: { ar: 'صيانة الهواتف', en: 'Phone Maintenance' } },
      { id: 'screen-repair', label: { ar: 'تصليح الشاشات', en: 'Screen Repair' } },
      { id: 'battery', label: { ar: 'تغيير البطارية', en: 'Battery Replacement' } },
      { id: 'software', label: { ar: 'برمجة الهواتف', en: 'Phone Programming' } },
      { id: 'unlocking', label: { ar: 'فك قفل الأجهزة', en: 'Device Unlocking' } },
      { id: 'updates', label: { ar: 'تحديث النظام', en: 'System Update' } },
      { id: 'buy-sell', label: { ar: 'بيع وشراء', en: 'Buy & Sell' } },
      { id: 'accessories', label: { ar: 'إكسسوارات', en: 'Accessories' } },
      { id: 'protection', label: { ar: 'حماية الأجهزة', en: 'Device Protection' } },
      { id: 'data-transfer', label: { ar: 'نقل البيانات', en: 'Data Transfer' } }
    ]
  },
  {
    id: 'bikes',
    iconName: 'Bike',
    label: { ar: 'الدراجات', en: 'Bikes' },
    color: 'from-orange-500 to-red-600',
    subcategories: [
    { id: 'maintenance', label: { ar: 'صيانة الدراجات', en: 'Bike Maintenance' } },
      { id: 'tires', label: { ar: 'تغيير الإطارات', en: 'Tire Replacement' } },
      { id: 'buy-sell', label: { ar: 'بيع وشراء', en: 'Buy & Sell' } },
      { id: 'rental', label: { ar: 'تأجير الدراجات', en: 'Bike Rental' } },
      { id: 'spare-parts', label: { ar: 'قطع غيار', en: 'Spare Parts' } },
      { id: 'wash', label: { ar: 'غسيل وتلميع', en: 'Wash & Polish' } },
      { id: 'battery', label: { ar: 'شحن بطاريات', en: 'Battery Charging' } },
      { id: 'modification', label: { ar: 'تعديل وتطوير', en: 'Modification & Tuning' } }
    ]
  },
  {
    id: 'clothing',
    iconName: 'Shirt',
    label: { ar: 'الملابس', en: 'Clothing' },
    color: 'from-pink-500 to-rose-600',
    subcategories: [
    { id: 'men', label: { ar: 'ملابس رجالي', en: 'Men\'s Clothing' } },
      { id: 'women', label: { ar: 'ملابس نسائي', en: 'Women\'s Clothing' } },
      { id: 'kids', label: { ar: 'ملابس أطفال', en: 'Kids\' Clothing' } }
    ]
  },
  {
    id: 'barber',
    iconName: 'Scissors',
    label: { ar: 'الحلاقة', en: 'Barber & Salon' },
    color: 'from-purple-500 to-indigo-600',
    subcategories: [
    { id: 'men', label: { ar: 'حلاقة رجالي', en: 'Men\'s Barber' } },
      { id: 'women', label: { ar: 'حلاقة نسائي', en: 'Women\'s Salon' } }
    ]
  },
  {
    id: 'food',
    iconName: 'ShoppingBag',
    label: { ar: 'المواد الغذائية والخدمات اليومية', en: 'Food & Daily Services' },
    color: 'from-indigo-500 to-indigo-700',
    subcategories: [
    { id: 'baker', label: { ar: 'خباز', en: 'Baker' } },
      { id: 'groceries', label: { ar: 'مواد غذائية', en: 'Groceries' } },
      { id: 'supermarket', label: { ar: 'بقالة', en: 'Supermarket' } },
      { id: 'delivery', label: { ar: 'تجهيز طلبات', en: 'Order Preparation' } },
    ]
  },
  {
    id: 'medical_equipment',
    iconName: 'Microscope',
    label: { ar: 'أجهزة ومعدات طبية', en: 'Medical Equipment & Devices' },
    color: 'from-blue-500 to-indigo-700',
    subcategories: [
    { id: 'dental', label: { ar: 'أجهزة الأسنان', en: 'Dental Equipment' } },
      { id: 'surgical', label: { ar: 'الأجهزة الجراحية', en: 'Surgical Equipment' } },
      { id: 'psychiatric', label: { ar: 'الأجهزة النفسية', en: 'Psychiatric Equipment' } },
      { id: 'laser', label: { ar: 'أجهزة الليزر', en: 'Laser Equipment' } },
    ]
  },
  {
    id: 'hotels',
    iconName: 'Hotel',
    label: { ar: 'فنادق', en: 'Hotels' },
    color: 'from-blue-600 to-indigo-900',
    subcategories: [
    { id: 'luxury', label: { ar: 'فنادق فاخرة', en: 'Luxury Hotels' } },
      { id: 'budget', label: { ar: 'فنادق اقتصادية', en: 'Budget Hotels' } },
      { id: 'resorts', label: { ar: 'منتجعات', en: 'Resorts' } },
      { id: 'apartments', label: { ar: 'شقق فندقية', en: 'Hotel Apartments' } },
    ]
  },
  {
    id: 'restaurants',
    iconName: 'Utensils',
    label: { ar: 'مطاعم', en: 'Restaurants' },
    color: 'from-orange-400 to-red-600',
    subcategories: [
    { id: 'oriental', label: { ar: 'شرقي', en: 'Oriental' } },
      { id: 'western', label: { ar: 'غربي', en: 'Western' } },
      { id: 'fastfood', label: { ar: 'وجبات سريعة', en: 'Fast Food' } },
      { id: 'seafood', label: { ar: 'مأكولات بحرية', en: 'Seafood' } },
    ]
  },
  {
    id: 'goldsmiths',
    iconName: 'Sparkles',
    label: { ar: 'صياغة الذهب', en: 'Gold Goldsmithing' },
    color: 'from-amber-400 to-amber-700',
    subcategories: [
    { id: 'emirati', label: { ar: 'ذهب إماراتي', en: 'Emirati Gold' } },
      { id: 'iraqi', label: { ar: 'ذهب عراقي', en: 'Iraqi Gold' } },
      { id: 'brazilian', label: { ar: 'ذهب برازيلي', en: 'Brazilian Gold' } },
    ]
  },
  {
    id: 'bakeries',
    iconName: 'Croissant',
    label: { ar: 'الأفران، المخابز والحلويات', en: 'Bakeries, Ovens & Sweets' },
    color: 'from-amber-400 to-orange-600',
    subcategories: [
      { id: 'samoon', label: { ar: 'أفران الصمون', en: 'Samoon Ovens' } },
      { id: 'bread', label: { ar: 'أفران الخبز', en: 'Bread Ovens' } },
      { id: 'pastries', label: { ar: 'المعجنات', en: 'Pastries' } },
      { id: 'arabic', label: { ar: 'حلويات عربية', en: 'Arabic Sweets' } },
      { id: 'cakes', label: { ar: 'كيك وحلويات غربية', en: 'Cakes & Western Sweets' } },
      { id: 'chocolate', label: { ar: 'شوكولاتة', en: 'Chocolate' } },
    ]
  },
  {
    id: 'cars',
    iconName: 'Car',
    label: { ar: 'بيع وشراء السيارات', en: 'Buy & Sell Cars' },
    color: 'from-slate-700 to-slate-900',
    subcategories: [
    { id: 'american', label: { ar: 'أمريكي', en: 'American' } },
      { id: 'thai', label: { ar: 'تايلاندي', en: 'Thai' } },
      { id: 'chinese', label: { ar: 'صيني', en: 'Chinese' } },
      { id: 'korean', label: { ar: 'كوري', en: 'Korean' } },
      { id: 'iranian', label: { ar: 'إيراني', en: 'Iranian' } },
      { id: 'gulf', label: { ar: 'خليجي', en: 'Gulf' } },
    ]
  }
];

import { Car } from '../types';

export const mockCars: Car[] = [
  {
    id: 'c1',
    origin: 'american',
    brand: { ar: 'فورد', en: 'Ford' },
    model: { ar: 'موستانج', en: 'Mustang' },
    year: 2022,
    price: 35000,
    condition: { ar: 'جديدة', en: 'New' },
    type: 'sedan',
    image: 'https://images.unsplash.com/photo-1584345604480-8347cc996c5f?auto=format&fit=crop&q=80&w=800&h=400',
    images: ['https://images.unsplash.com/photo-1584345604480-8347cc996c5f?auto=format&fit=crop&q=80&w=800&h=400'],
    sellerName: 'أحمد علي',
    sellerPhone: '07701234567',
    sellerWhatsApp: '07701234567',
    location: { ar: 'بغداد - المنصور', en: 'Baghdad - Mansour' },
    description: { ar: 'سيارة فورد موستانج موديل 2022، بحالة ممتازة جداً، لون أحمر.', en: 'Ford Mustang 2022, excellent condition, red color.' },
    createdAt: Date.now()
  },
  {
    id: 'c2',
    origin: 'korean',
    brand: { ar: 'هيونداي', en: 'Hyundai' },
    model: { ar: 'توسان', en: 'Tucson' },
    year: 2021,
    price: 24000,
    condition: { ar: 'مستعملة', en: 'Used' },
    type: 'suv',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800&h=400',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800&h=400'],
    sellerName: 'محمد جاسم',
    sellerPhone: '07801234567',
    sellerWhatsApp: '07801234567',
    location: { ar: 'البصرة - العشار', en: 'Basra - Ashar' },
    description: { ar: 'هيونداي توسان 2021، ماشية 30 ألف كم، نظيفة جداً.', en: 'Hyundai Tucson 2021, 30k km, very clean.' },
    createdAt: Date.now()
  },
  {
    id: 'c3',
    origin: 'chinese',
    brand: { ar: 'شانجان', en: 'Changan' },
    model: { ar: 'CS75', en: 'CS75' },
    year: 2023,
    price: 21000,
    condition: { ar: 'جديدة', en: 'New' },
    type: 'suv',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800&h=400',
    images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800&h=400'],
    sellerName: 'علي حسين',
    sellerPhone: '07901234567',
    sellerWhatsApp: '07901234567',
    location: { ar: 'أربيل - عينكاوة', en: 'Erbil - Ainkawa' },
    description: { ar: 'شانجان CS75 موديل 2023، زيرو، مواصفات كاملة.', en: 'Changan CS75 2023, zero km, full options.' },
    createdAt: Date.now()
  }
];

export const providers: Provider[] = [
  {
    id: 'p1',
    categoryId: 'mechanics',
    subcategoryId: 'all',
    name: { ar: 'محل صيانة النجم', en: 'Al-Najm Maintenance' },
    specialty: { ar: 'صيانة سيارات حديثة', en: 'Modern Car Maintenance' },
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'شارع الصناعة - بغداد', en: 'Industrial Street - Baghdad' },
    nearestLandmark: { ar: 'مقابل محطة وقود الرافدين', en: 'Opposite Al-Rafidain Gas Station' },
    lat: 33.3152,
    lng: 44.3661,
    type: 'fixed',
    phone: '07712345678',
    rating: 4.8,
    experience: { ar: '15 سنة خبرة', en: '15 years experience' },
    certificates: [{ ar: 'شهادة خبرة دولية', en: 'International Experience Certificate' }]
  },
  {
    id: 'p2',
    categoryId: 'plumbers',
    subcategoryId: 'all',
    name: { ar: 'سباكة الرافدين', en: 'Al-Rafidain Plumbing' },
    specialty: { ar: 'تأسيسات صحية وصيانة', en: 'Sanitary Installations & Maintenance' },
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'المنصور - بغداد', en: 'Al-Mansour - Baghdad' },
    nearestLandmark: { ar: 'قرب مطعم زرزور', en: 'Near Zarzour Restaurant' },
    lat: 33.3122,
    lng: 44.3561,
    type: 'fixed',
    phone: '07812345678',
    rating: 4.9,
    experience: { ar: '10 سنوات خبرة', en: '10 years experience' },
    certificates: [{ ar: 'شهادة مهنية', en: 'Professional Certificate' }]
  },
  {
    id: 'p3',
    categoryId: 'construction_plumbing',
    subcategoryId: 'contracting',
    name: { ar: 'شركة الرافدين للمقاولات', en: 'Al-Rafidain Contracting' },
    specialty: { ar: 'بناء وترميم منازل', en: 'House Construction & Renovation' },
    image: 'https://images.unsplash.com/photo-1541914590026-fdc641c83e90?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1541914590026-fdc641c83e90?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'الكرادة - بغداد', en: 'Karrada - Baghdad' },
    lat: 33.3000,
    lng: 44.4000,
    type: 'fixed',
    phone: '07912345678',
    rating: 4.7,
    experience: { ar: '20 سنة في السوق', en: '20 years in market' },
    certificates: [{ ar: 'إجازة ممارسة مهنة', en: 'Professional License' }],
    bio: { ar: 'نحن متخصصون في كافة أعمال البناء والترميم بأحدث الطرق الهندسية.', en: 'We specialize in all construction and renovation works using the latest engineering methods.' }
  },
  {
    id: 'p4',
    categoryId: 'construction_plumbing',
    subcategoryId: 'plumbing',
    name: { ar: 'أبو أحمد للصحيات', en: 'Abu Ahmed Plumbing' },
    specialty: { ar: 'تصليح وتأسيس شبكات مياه', en: 'Water Network Repair & Installation' },
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'حي الجامعة - بغداد', en: 'Hai Al-Jamia - Baghdad' },
    lat: 33.3200,
    lng: 44.3400,
    type: 'mobile',
    phone: '07700000000',
    rating: 4.9,
    experience: { ar: 'خبير في كشف التسريبات', en: 'Expert in leak detection' },
    certificates: [],
    bio: { ar: 'خدمة سريعة ومضمونة لكافة أعمال الصحيات المنزلية.', en: 'Fast and guaranteed service for all home plumbing works.' }
  },
  {
    id: 'p5',
    categoryId: 'construction_plumbing',
    subcategoryId: 'electrical',
    name: { ar: 'الكهربائي الماهر', en: 'The Skilled Electrician' },
    specialty: { ar: 'صيانة وتأسيس كهرباء منازل', en: 'Home Electrical Maintenance & Installation' },
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'المنصور - بغداد', en: 'Al-Mansour - Baghdad' },
    lat: 33.3122,
    lng: 44.3561,
    type: 'mobile',
    phone: '07722222222',
    rating: 4.8,
    experience: { ar: '12 سنة خبرة', en: '12 years experience' },
    certificates: [],
    bio: { ar: 'متخصص في كافة أعمال الكهرباء المنزلية والصناعية.', en: 'Specialized in all home and industrial electrical works.' }
  },
  {
    id: 'p6',
    categoryId: 'construction_plumbing',
    subcategoryId: 'painting',
    name: { ar: 'لمسات فنية للدهانات', en: 'Artistic Touches Painting' },
    specialty: { ar: 'أصباغ وديكورات داخلية', en: 'Interior Paints & Decor' },
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'زيونة - بغداد', en: 'Zayouna - Baghdad' },
    lat: 33.3300,
    lng: 44.4300,
    type: 'fixed',
    phone: '07833333333',
    rating: 4.6,
    experience: { ar: '8 سنوات في الديكور', en: '8 years in decor' },
    certificates: [],
    bio: { ar: 'نحول منزلك إلى لوحة فنية بأفضل أنواع الأصباغ.', en: 'We turn your home into a masterpiece with the best types of paints.' }
  },
  {
    id: 'p7',
    categoryId: 'construction_plumbing',
    subcategoryId: 'hvac',
    name: { ar: 'مركز تبريد بغداد', en: 'Baghdad Cooling Center' },
    specialty: { ar: 'صيانة مكيفات وسبلت', en: 'AC & Split Maintenance' },
    image: 'https://images.unsplash.com/photo-1599708145804-aa2c6f94072c?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1599708145804-aa2c6f94072c?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'شارع فلسطين - بغداد', en: 'Palestine Street - Baghdad' },
    lat: 33.3400,
    lng: 44.4100,
    type: 'mobile',
    phone: '07744444444',
    rating: 4.9,
    experience: { ar: 'خبير تبريد وتكييف', en: 'Cooling & AC Expert' },
    certificates: [],
    bio: { ar: 'صيانة فورية وشحن فريون بأفضل الأسعار.', en: 'Immediate maintenance and freon charging at best prices.' }
  },
  {
    id: 'p8',
    categoryId: 'medical_equipment',
    subcategoryId: 'dental',
    name: { ar: 'تجهيزات السن الضاحك', en: 'Smiling Tooth Supplies' },
    specialty: { ar: 'كراسي وأدوات طب الأسنان', en: 'Dental Chairs & Tools' },
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'شارع الرشيد - بغداد', en: 'Al-Rasheed Street - Baghdad' },
    lat: 33.3300,
    lng: 44.3900,
    type: 'fixed',
    phone: '07755555555',
    rating: 4.9,
    experience: { ar: 'وكيل معتمد منذ 10 سنوات', en: 'Authorized agent for 10 years' },
    certificates: [{ ar: 'شهادة جودة ISO', en: 'ISO Quality Certificate' }],
    bio: { ar: 'نوفر أحدث كراسي طب الأسنان وأجهزة الأشعة المتطورة.', en: 'We provide the latest dental chairs and advanced X-ray machines.' }
  },
  {
    id: 'p9',
    categoryId: 'medical_equipment',
    subcategoryId: 'laser',
    name: { ar: 'التقنية الحديثة لليزر', en: 'Modern Laser Tech' },
    specialty: { ar: 'أجهزة ليزر تجميلية وطبية', en: 'Cosmetic & Medical Laser Devices' },
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'حي الحارثية - بغداد', en: 'Al-Harthiya - Baghdad' },
    lat: 33.3100,
    lng: 44.3600,
    type: 'fixed',
    phone: '07766666666',
    rating: 4.8,
    experience: { ar: 'متخصصون في أجهزة الليزر', en: 'Specialized in laser devices' },
    certificates: [],
    bio: { ar: 'أحدث أجهزة إزالة الشعر بالليزر وأجهزة جراحة الليزر.', en: 'Latest laser hair removal and medical laser surgery devices.' }
  },
  {
    id: 'p10',
    categoryId: 'hotels',
    subcategoryId: 'luxury',
    name: { ar: 'فندق بابل الدولي', en: 'Babylon International Hotel' },
    specialty: { ar: 'إقامة فاخرة 5 نجوم', en: '5-Star Luxury Stay' },
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'الجادرية - بغداد', en: 'Jadriya - Baghdad' },
    lat: 33.2800,
    lng: 44.3800,
    type: 'fixed',
    phone: '07771111111',
    rating: 4.9,
    experience: { ar: 'أعرق فنادق العاصمة', en: 'One of the capital\'s oldest hotels' },
    certificates: [],
    bio: { ar: 'إطلالة ساحرة على نهر دجلة وخدمات فندقية عالمية.', en: 'Charming view of the Tigris River and world-class hotel services.' }
  },
  {
    id: 'p11',
    categoryId: 'restaurants',
    subcategoryId: 'oriental',
    name: { ar: 'مطعم صمد', en: 'Samad Restaurant' },
    specialty: { ar: 'مأكولات عراقية وشرقية', en: 'Iraqi & Oriental Cuisine' },
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'المنصور - بغداد', en: 'Al-Mansour - Baghdad' },
    lat: 33.3122,
    lng: 44.3561,
    type: 'fixed',
    phone: '07772222222',
    rating: 4.8,
    experience: { ar: 'أفضل مطعم شرقي', en: 'Best Oriental Restaurant' },
    certificates: [],
    bio: { ar: 'نقدم أشهى الأطباق العراقية التقليدية بلمسة عصرية.', en: 'We serve the most delicious traditional Iraqi dishes with a modern touch.' }
  },
  {
    id: 'p12',
    categoryId: 'sweets',
    subcategoryId: 'arabic',
    name: { ar: 'حلويات الحاج جواد الشكرجي', en: 'Al-Shakarji Sweets' },
    specialty: { ar: 'حلويات عراقية تقليدية', en: 'Traditional Iraqi Sweets' },
    image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'الكرادة - بغداد', en: 'Karrada - Baghdad' },
    lat: 33.3000,
    lng: 44.4000,
    type: 'fixed',
    phone: '07773333333',
    rating: 4.9,
    experience: { ar: 'تاريخ يمتد لعقود', en: 'History spanning decades' },
    certificates: [],
    bio: { ar: 'أصل الحلويات العراقية والدهينة والمن والسلوى.', en: 'The origin of Iraqi sweets, Dahina, and Mann wa Salwa.' }
  },
  {
    id: 'school1',
    categoryId: 'schools',
    subcategoryId: 'public_primary',
    name: { ar: 'مدرسة بغداد الابتدائية', en: 'Baghdad Primary School' },
    specialty: { ar: 'تعليم ابتدائي حكومي', en: 'Public Primary Education' },
    image: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'الكرادة - بغداد', en: 'Karrada - Baghdad' },
    lat: 33.3000,
    lng: 44.4000,
    type: 'fixed',
    phone: '07774444444',
    rating: 4.5,
    experience: { ar: 'كادر تعليمي متميز', en: 'Excellent teaching staff' },
    certificates: [],
    workingHours: { ar: '8:00 ص - 1:00 م', en: '8:00 AM - 1:00 PM' },
    teachingStaff: { ar: 'نخبة من المعلمين التربويين', en: 'Elite educational teachers' },
    studentCount: '450',
    bio: { ar: 'مدرسة حكومية نموذجية تهتم بالجانب التربوي والتعليمي.', en: 'A model public school focusing on educational and pedagogical aspects.' }
  },
  {
    id: 'school2',
    categoryId: 'schools',
    subcategoryId: 'private_secondary',
    name: { ar: 'ثانوية النخبة الأهلية', en: 'Al-Nokhba Private Secondary' },
    specialty: { ar: 'تعليم ثانوي أهلي متميز', en: 'Premium Private Secondary' },
    image: 'https://images.unsplash.com/photo-1523050335102-c66a0a83d729?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1523050335102-c66a0a83d729?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'المنصور - بغداد', en: 'Al-Mansour - Baghdad' },
    lat: 33.3122,
    lng: 44.3561,
    type: 'fixed',
    phone: '07775555555',
    rating: 4.9,
    experience: { ar: 'أعلى مستويات التعليم', en: 'Highest levels of education' },
    certificates: [{ ar: 'شهادة الجودة التعليمية', en: 'Educational Quality Certificate' }],
    tuition: '2,500,000 IQD',
    teachingStaff: { ar: 'أساتذة جامعيون وخبراء', en: 'University professors and experts' },
    educationalPrograms: { ar: 'منهاج دولي متطور', en: 'Advanced international curriculum' },
    activities: { ar: 'مختبرات علمية، ملاعب رياضية، رحلات تعليمية', en: 'Science labs, sports fields, educational trips' },
    bio: { ar: 'نسعى لبناء جيل واعي ومثقف من خلال بيئة تعليمية محفزة.', en: 'We strive to build a conscious and educated generation through a stimulating environment.' }
  },
  {
    id: 'kg1',
    categoryId: 'schools',
    subcategoryId: 'kindergarten',
    name: { ar: 'روضة براعم المستقبل', en: 'Future Buds Kindergarten' },
    specialty: { ar: 'رعاية وتعليم أطفال', en: 'Child Care & Education' },
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'حي الجامعة - بغداد', en: 'University District - Baghdad' },
    lat: 33.3200,
    lng: 44.3300,
    type: 'fixed',
    phone: '07776666666',
    rating: 4.7,
    experience: { ar: 'بيئة آمنة وممتعة', en: 'Safe and fun environment' },
    certificates: [],
    tuition: '1,200,000 IQD',
    acceptedAge: { ar: '3 - 5 سنوات', en: '3 - 5 years' },
    workingHours: { ar: '8:00 ص - 2:00 م', en: '8:00 AM - 2:00 PM' },
    activities: { ar: 'ألعاب ذكاء، رسم، موسيقى، لغات', en: 'Intelligence games, drawing, music, languages' },
    bio: { ar: 'نعتني بأطفالكم كأنهم أطفالنا في بيئة تربوية حديثة.', en: 'We care for your children as our own in a modern educational environment.' }
  },
  {
    id: 'hosp1',
    categoryId: 'hospitals',
    subcategoryId: 'public',
    name: { ar: 'مستشفى اليرموك التعليمي', en: 'Al-Yarmouk Teaching Hospital' },
    specialty: { ar: 'مستشفى حكومي عام', en: 'General Public Hospital' },
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'اليرموك - بغداد', en: 'Al-Yarmouk - Baghdad' },
    lat: 33.3000,
    lng: 44.3500,
    type: 'fixed',
    phone: '07778888888',
    rating: 4.2,
    experience: { ar: 'خدمة طبية حكومية مجانية', en: 'Free public medical service' },
    certificates: [],
    workingHours: { ar: '24 ساعة', en: '24 Hours' },
    isEmergency24h: true,
    bedCount: '600',
    departments: [
      { id: 'emergency', label: { ar: 'طوارئ', en: 'Emergency' }, icon: 'Activity' },
      { id: 'surgery', label: { ar: 'جراحة', en: 'Surgery' }, icon: 'Scissors' },
      { id: 'internal', label: { ar: 'باطنية', en: 'Internal' }, icon: 'Stethoscope' },
      { id: 'pediatrics', label: { ar: 'أطفال', en: 'Pediatrics' }, icon: 'Baby' },
      { id: 'obgyn', label: { ar: 'نسائية', en: 'OB/GYN' }, icon: 'Users' }
    ],
    teachingStaff: { ar: 'كادر طبي متخصص ومتدرب', en: 'Specialized and trained medical staff' },
    bio: { ar: 'من أكبر المستشفيات التعليمية في بغداد، يقدم خدماته لكافة المواطنين.', en: 'One of the largest teaching hospitals in Baghdad, serving all citizens.' }
  },
  {
    id: 'hosp2',
    categoryId: 'hospitals',
    subcategoryId: 'private',
    name: { ar: 'مستشفى الكفيل التخصصي', en: 'Al-Kafeel Super Specialty' },
    specialty: { ar: 'رعاية طبية فائقة', en: 'Premium Medical Care' },
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=400',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=400'],
    locationName: { ar: 'كربلاء المقدسة', en: 'Holy Karbala' },
    lat: 32.6167,
    lng: 44.0333,
    type: 'fixed',
    phone: '07779999999',
    rating: 4.9,
    experience: { ar: 'أحدث التقنيات العالمية', en: 'Latest global technologies' },
    certificates: [{ ar: 'شهادة الجودة العالمية ISO', en: 'ISO International Quality Certificate' }],
    workingHours: { ar: '24 ساعة', en: '24 Hours' },
    isEmergency24h: true,
    approximatePrices: { ar: 'أسعار تنافسية حسب الخدمة', en: 'Competitive prices per service' },
    specialServices: { ar: 'غرف VIP، أجهزة حديثة، عمليات نادرة', en: 'VIP Rooms, Modern Equipment, Rare Operations' },
    departments: [
      { id: 'emergency', label: { ar: 'طوارئ', en: 'Emergency' }, icon: 'Activity' },
      { id: 'cardiology', label: { ar: 'قلب', en: 'Cardiology' }, icon: 'Heart' },
      { id: 'neurology', label: { ar: 'أعصاب', en: 'Neurology' }, icon: 'Brain' },
      { id: 'oncology', label: { ar: 'أورام', en: 'Oncology' }, icon: 'Microscope' }
    ],
    bio: { ar: 'صرح طبي عالمي يضم نخبة من الأطباء العراقيين والأجانب.', en: 'A world-class medical monument featuring elite Iraqi and foreign doctors.' }
  }
];
