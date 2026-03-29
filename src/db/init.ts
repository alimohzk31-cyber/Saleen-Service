import pool, { setDatabaseConnected } from './index';

export const initDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('Skipping database initialization: DATABASE_URL is not set.');
    return;
  }

  let client;
  let retries = 1;
  let delay = 1000; // 1 second
  const totalRetries = 1;

  while (retries > 0) {
    try {
      console.log(`Attempting to connect to the database (Retries left: ${retries})...`);
      client = await pool.connect();
      console.log('Successfully connected to the database.');
      setDatabaseConnected(true);
      break;
    } catch (err: any) {
      retries--;
      console.error(`Failed to connect to the database (Attempt ${totalRetries - retries}/${totalRetries}):`, err.message);
      if (err.message.includes('self signed certificate')) {
        console.error('HINT: This might be an SSL issue. Ensure your connection string or pool config is correct for Supabase.');
      }
      if (err.message.includes('timeout')) {
        console.error('HINT: Connection timed out. Check if your database is accessible and the URL is correct.');
      }
      
      if (retries === 0) {
        console.error('All database connection attempts failed. Falling back to Mock Database Mode.');
        setDatabaseConnected(false);
        return;
      }
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  if (!client) return;

  try {
    await client.query('BEGIN');

    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        is_verified BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'active',
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migration: Ensure google_id exists in users table
    const userColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    const uColumnNames = userColumns.rows.map(r => r.column_name);
    if (!uColumnNames.includes('google_id')) {
      await client.query('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE');
    }

    // Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        icon VARCHAR(255),
        parent_id VARCHAR(50) REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migration: Ensure parent_id exists in categories table
    const categoryColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'categories'
    `);
    const columnNames = categoryColumns.rows.map(r => r.column_name);
    const idColumn = categoryColumns.rows.find(r => r.column_name === 'id');
    
    if (!columnNames.includes('parent_id')) {
      await client.query('ALTER TABLE categories ADD COLUMN parent_id VARCHAR(50) REFERENCES categories(id)');
    }

    // Migration: Change id from integer to varchar if necessary
    if (idColumn && (idColumn.data_type === 'integer' || idColumn.data_type === 'bigint')) {
      console.log('Migrating categories.id from integer to varchar...');
      // 1. Drop foreign keys referencing categories(id)
      await client.query('ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_id_fkey');
      
      // 2. Change types
      await client.query('ALTER TABLE categories ALTER COLUMN id TYPE VARCHAR(50)');
      await client.query('ALTER TABLE services ALTER COLUMN category_id TYPE VARCHAR(50)');
      
      // 3. Re-add foreign key
      await client.query('ALTER TABLE services ADD CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE');
    }

    if (!columnNames.includes('name_ar')) {
      await client.query('ALTER TABLE categories ADD COLUMN name_ar VARCHAR(255) DEFAULT \'\'');
      // If there was a 'name' column, migrate it
      if (columnNames.includes('name')) {
        await client.query('UPDATE categories SET name_ar = name');
      }
    }

    if (!columnNames.includes('name_en')) {
      await client.query('ALTER TABLE categories ADD COLUMN name_en VARCHAR(255) DEFAULT \'\'');
      // If there was a 'name' column, migrate it
      if (columnNames.includes('name')) {
        await client.query('UPDATE categories SET name_en = name');
      }
    }

    // Optionally drop old 'name' column if it exists and we've migrated
    if (columnNames.includes('name')) {
      await client.query('ALTER TABLE categories DROP COLUMN name');
    }

    // Services Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        image_url TEXT,
        category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
        subcategory_id VARCHAR(50),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        phone VARCHAR(50),
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        service_type VARCHAR(50),
        experience TEXT,
        certificates JSONB,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migration: Ensure all columns exist in services table
    const serviceColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services'
    `);
    const sColumnNames = serviceColumns.rows.map(r => r.column_name);
    const categoryIdColumn = serviceColumns.rows.find(r => r.column_name === 'category_id');

    // Migration: Change category_id from integer to varchar if necessary
    if (categoryIdColumn && (categoryIdColumn.data_type === 'integer' || categoryIdColumn.data_type === 'bigint')) {
      console.log('Migrating services.category_id from integer to varchar...');
      await client.query('ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_id_fkey');
      await client.query('ALTER TABLE services ALTER COLUMN category_id TYPE VARCHAR(50)');
      await client.query('ALTER TABLE services ADD CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE');
    }

    if (!sColumnNames.includes('subcategory_id')) {
      await client.query('ALTER TABLE services ADD COLUMN subcategory_id VARCHAR(50)');
    }
    if (!sColumnNames.includes('phone')) {
      await client.query('ALTER TABLE services ADD COLUMN phone VARCHAR(50)');
    }
    if (!sColumnNames.includes('lat')) {
      await client.query('ALTER TABLE services ADD COLUMN lat DOUBLE PRECISION');
    }
    if (!sColumnNames.includes('lng')) {
      await client.query('ALTER TABLE services ADD COLUMN lng DOUBLE PRECISION');
    }
    if (!sColumnNames.includes('service_type')) {
      await client.query('ALTER TABLE services ADD COLUMN service_type VARCHAR(50)');
    }
    if (!sColumnNames.includes('experience')) {
      await client.query('ALTER TABLE services ADD COLUMN experience TEXT');
    }
    if (!sColumnNames.includes('certificates')) {
      await client.query('ALTER TABLE services ADD COLUMN certificates JSONB');
    }
    if (!sColumnNames.includes('bio')) {
      await client.query('ALTER TABLE services ADD COLUMN bio TEXT');
    }
    if (!sColumnNames.includes('video_url')) {
      await client.query('ALTER TABLE services ADD COLUMN video_url TEXT');
    }

    // Merge sweets into bakeries if they exist
    await client.query("UPDATE services SET category_id = 'bakeries' WHERE category_id = 'sweets'");
    await client.query("DELETE FROM categories WHERE id = 'sweets'");

    // Seed Categories
    const categoriesSeed = [
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
      { id: 'bakeries', ar: 'الأفران، المخابز والحلويات', en: 'Bakeries, Ovens & Sweets', icon: 'Croissant' },
      { id: 'universities', ar: 'الجامعات', en: 'Universities', icon: 'GraduationCap', parent_id: null },
      { id: 'universities_gov', ar: 'جامعات حكومية', en: 'Government Universities', icon: 'Building2', parent_id: 'universities' },
      { id: 'universities_priv', ar: 'جامعات أهلية', en: 'Private Universities', icon: 'Building2', parent_id: 'universities' },
      { id: 'colleges', ar: 'كليات', en: 'Colleges', icon: 'BookOpen', parent_id: 'universities_gov' },
      { id: 'institutes', ar: 'معاهد', en: 'Institutes', icon: 'BookOpen', parent_id: 'universities_gov' },
      { id: 'civil_defense', ar: 'الدفاع المدني', en: 'Civil Defense', icon: 'ShieldAlert' },
      { id: 'police', ar: 'مراكز الشرطة', en: 'Police Stations', icon: 'Shield' },
      { id: 'gas_stations', ar: 'محطات الوقود', en: 'Gas Stations', icon: 'Fuel' },
      { id: 'football_fields', ar: 'ملاعب كرة القدم', en: 'Football Fields', icon: 'Trophy' }
    ];

    for (const cat of categoriesSeed) {
      await client.query(`
        INSERT INTO categories (id, name_ar, name_en, icon)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE SET 
          name_ar = EXCLUDED.name_ar,
          name_en = EXCLUDED.name_en,
          icon = EXCLUDED.icon
      `, [cat.id, cat.ar, cat.en, cat.icon]);
    }

    // Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Reviews Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Gold Types Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gold_types (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Jewelry Products Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS jewelry_products (
        id SERIAL PRIMARY KEY,
        gold_type_id INTEGER REFERENCES gold_types(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        weight DECIMAL(10, 2),
        karat INTEGER,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Merchants Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS merchants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        location TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('Database tables initialized successfully.');
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error('Error initializing database tables:', error);
    setDatabaseConnected(false);
  } finally {
    if (client) client.release();
  }
};
