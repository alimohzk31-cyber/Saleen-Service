import { Request, Response } from 'express';
import { query } from '../db';
import { AuthRequest } from '../middleware/auth';

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id, name_ar, name_en, icon } = req.body;
    
    // Only admins should create categories (assuming role check is done here or in middleware)
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const newCategory = await query(
      'INSERT INTO categories (id, name_ar, name_en, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name_ar, name_en, icon]
    );

    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY name_en ASC');
    res.json(categories.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const seedCategories = async (req: Request, res: Response) => {
  try {
    // Basic mock categories to seed
    const mockCategories = [
      { id: 'construction_plumbing', ar: 'الإنشائيات والصحيات', en: 'Construction & Plumbing', icon: 'HardHat' },
      { id: 'doctors', ar: 'طبيب', en: 'Doctor', icon: 'Stethoscope' },
      { id: 'pharmacy', ar: 'الصيدلة', en: 'Pharmacy', icon: 'Pill' },
      { id: 'welding', ar: 'اللحام', en: 'Welding', icon: 'Flame' },
      { id: 'agriculture', ar: 'الزراعة', en: 'Agriculture', icon: 'Sprout' },
      { id: 'carpentry', ar: 'نجار بيوت', en: 'Carpentry', icon: 'Hammer' },
      { id: 'mechanics', ar: 'صيانة سيارات', en: 'Car Maintenance', icon: 'Car' },
      { id: 'plumbers', ar: 'السباكة', en: 'Plumbing', icon: 'Droplet' },
      { id: 'electricity', ar: 'الكهرباء', en: 'Electricity', icon: 'Zap' },
      { id: 'hvac', ar: 'التبريد والتكييف', en: 'HVAC', icon: 'Snowflake' },
      { id: 'construction', ar: 'البناء والديكور', en: 'Construction & Decor', icon: 'PaintRoller' },
      { id: 'engineering', ar: 'قسم الهندسة', en: 'Engineering', icon: 'Building2' },
      { id: 'mobiles', ar: 'الموبايلات', en: 'Mobiles', icon: 'Smartphone' },
      { id: 'bikes', ar: 'الدراجات', en: 'Bikes', icon: 'Bike' },
      { id: 'clothing', ar: 'الملابس', en: 'Clothing', icon: 'Shirt' },
      { id: 'barber', ar: 'الحلاقة', en: 'Barber & Salon', icon: 'Scissors' },
      { id: 'food', ar: 'المواد الغذائية والخدمات اليومية', en: 'Food & Daily Services', icon: 'ShoppingBag' },
      { id: 'medical_equipment', ar: 'أجهزة ومعدات طبية', en: 'Medical Equipment & Devices', icon: 'Microscope' },
      { id: 'hotels', ar: 'فنادق', en: 'Hotels', icon: 'Hotel' },
      { id: 'restaurants', ar: 'مطاعم', en: 'Restaurants', icon: 'Utensils' },
      { id: 'sweets', ar: 'حلويات ومعجنات', en: 'Sweets & Pastries', icon: 'Cake' }
    ];

    for (const cat of mockCategories) {
      const existing = await query('SELECT id FROM categories WHERE id = $1', [cat.id]);
      if (existing.rows.length === 0) {
        await query(
          'INSERT INTO categories (id, name_ar, name_en, icon) VALUES ($1, $2, $3, $4)',
          [cat.id, cat.ar, cat.en, cat.icon]
        );
      }
    }

    res.json({ message: 'Categories seeded successfully' });
  } catch (error) {
    console.error('Error seeding categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
