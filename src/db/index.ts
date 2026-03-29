import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

console.log('DEBUG: DATABASE_URL is:', databaseUrl);

let isDatabaseConnected = !!databaseUrl;

export const setDatabaseConnected = (status: boolean) => {
  isDatabaseConnected = status;
  if (!status) {
    console.warn('Database connection failed. Falling back to Mock Database Mode.');
  }
};

if (!databaseUrl) {
  console.warn('WARNING: DATABASE_URL environment variable is not set. Using Mock Database Mode to prevent errors.');
}

const pool = databaseUrl ? new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 2000, // Reduced to 2 seconds to fail very fast
  idleTimeoutMillis: 10000,
  max: 10,
  keepAlive: true,
  statement_timeout: 3000, // 3 seconds
  query_timeout: 3000, // 3 seconds
  application_name: 'saleen-app'
}) : null;

console.log('DEBUG: Pool initialized:', !!pool);

if (pool) {
  pool.on('connect', () => {
    console.log('DEBUG: A new client has connected to the database pool.');
  });
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    isDatabaseConnected = false;
  });
}

// Mock Data Store for Demo Mode
import fs from 'fs';
import path from 'path';

const MOCK_DB_PATH = path.join(process.cwd(), 'mock-db.json');

let mockStore: { [key: string]: any[] } = {
  users: [],
  services: [],
  categories: []
};

try {
  if (fs.existsSync(MOCK_DB_PATH)) {
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf-8');
    mockStore = JSON.parse(data);
  }
} catch (e) {
  console.error('Failed to load mock DB:', e);
}

const saveMockDb = () => {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(mockStore, null, 2));
  } catch (e) {
    console.error('Failed to save mock DB:', e);
  }
};

export const query = async (text: string, params?: any[]) => {
  if (!isDatabaseConnected || !pool) {
    console.log('MOCK QUERY:', text, params);
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('select 1')) return { rows: [{ 1: 1 }] };

    if (lowerText.includes('select exists')) {
      // If mockStore has data, pretend tables exist so we don't re-insert initial data
      if (mockStore.services.length > 0 || mockStore.categories.length > 0) {
        return { rows: [{ exists: true }] };
      }
      return { rows: [] };
    }

    if (lowerText.includes('select count(*)')) {
      if (lowerText.includes('from users')) return { rows: [{ count: mockStore.users.length }] };
      if (lowerText.includes('from services')) return { rows: [{ count: mockStore.services.length }] };
      if (lowerText.includes('from categories')) return { rows: [{ count: mockStore.categories.length }] };
      return { rows: [{ count: 0 }] };
    }

    if (lowerText.includes('insert into services')) {
      const newService = {
        id: mockStore.services.length + 1,
        title: params?.[0],
        description: params?.[1],
        price: params?.[2],
        image_url: params?.[3],
        video_url: params?.[4],
        category_id: params?.[5],
        subcategory_id: params?.[6],
        user_id: params?.[7],
        phone: params?.[8],
        lat: params?.[9],
        lng: params?.[10],
        service_type: params?.[11],
        experience: params?.[12],
        certificates: params?.[13],
        bio: params?.[14],
        provider_name: 'Mock Provider',
        created_at: new Date().toISOString()
      };
      mockStore.services.push(newService);
      saveMockDb();
      console.log('MOCK: Added new service:', newService.id);
      return { rows: [newService] };
    }

    if (lowerText.includes('update services set')) {
      const id = parseInt(params?.[14]);
      const index = mockStore.services.findIndex(s => s.id === id);
      if (index !== -1) {
        mockStore.services[index] = {
          ...mockStore.services[index],
          title: params?.[0],
          description: params?.[1],
          price: params?.[2],
          image_url: params?.[3],
          video_url: params?.[4],
          category_id: params?.[5],
          subcategory_id: params?.[6],
          phone: params?.[7],
          lat: params?.[8],
          lng: params?.[9],
          service_type: params?.[10],
          experience: params?.[11],
          certificates: params?.[12],
          bio: params?.[13]
        };
        saveMockDb();
        console.log('MOCK: Updated service:', id);
        return { rows: [mockStore.services[index]] };
      }
      return { rows: [] };
    }

    if (lowerText.includes('delete from services')) {
      const id = parseInt(params?.[0]);
      mockStore.services = mockStore.services.filter(s => s.id !== id);
      saveMockDb();
      console.log('MOCK: Deleted service:', id);
      return { rows: [] };
    }

    if (lowerText.includes('from services')) {
      return { rows: mockStore.services };
    }

    if (lowerText.includes('insert into users')) {
      const newUser = {
        id: mockStore.users.length + 1,
        name: params?.[0],
        phone: params?.[1],
        email: params?.[2],
        password: params?.[3],
        google_id: params?.[4],
        role: params?.[5] || 'user',
        status: 'active',
        is_verified: false,
        created_at: new Date().toISOString()
      };
      mockStore.users.push(newUser);
      saveMockDb();
      return { rows: [newUser] };
    }

    if (lowerText.includes('from users')) {
      if (lowerText.includes('where phone = $1')) {
        const user = mockStore.users.find(u => u.phone === params?.[0]);
        return { rows: user ? [user] : [] };
      }
      if (lowerText.includes('where id = $1')) {
        const user = mockStore.users.find(u => u.id === params?.[0]);
        return { rows: user ? [user] : [] };
      }
      return { rows: mockStore.users };
    }

    if (lowerText.includes('insert into categories')) {
      const newCategory = {
        id: params?.[0],
        name_ar: params?.[1],
        name_en: params?.[2],
        icon: params?.[3],
        parent_id: params?.[4],
        created_at: new Date().toISOString()
      };
      mockStore.categories.push(newCategory);
      saveMockDb();
      return { rows: [newCategory] };
    }

    if (lowerText.includes('from categories')) {
      return { rows: mockStore.categories };
    }

    return { rows: [] };
  }
  
  try {
    if (!pool) throw new Error('Pool not initialized');
    
    const startTime = Date.now();
    const queryPromise = pool.query(text, params);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query execution timeout (3s)')), 3000)
    );

    const result = await Promise.race([queryPromise, timeoutPromise]) as any;
    const duration = Date.now() - startTime;
    
    if (duration > 2000) {
      console.warn(`Slow query detected (${duration}ms):`, text.substring(0, 100));
    }
    
    return result;
  } catch (err: any) {
    console.error('Database query error:', err.message);
    
    // Check if it's a connection or timeout error
    const isConnectionError = err.message.toLowerCase().includes('terminated') || 
                             err.message.toLowerCase().includes('timeout') || 
                             err.message.toLowerCase().includes('connection') ||
                             err.message.toLowerCase().includes('pool') ||
                             err.message.toLowerCase().includes('econnrefused') ||
                             err.message.toLowerCase().includes('ehostunreach') ||
                             err.message.toLowerCase().includes('socket hang up');

    if (isConnectionError) {
      console.warn('Database connection issue detected:', err.message);
      console.warn('Switching to Mock Database Mode to prevent app freeze.');
      isDatabaseConnected = false;
      
      // Do not attempt to reconnect automatically to avoid repeated timeout errors
      // The user must restart the server or fix the connection string

      return queryInMockMode(text, params);
    }
    throw err;
  }
};

const queryInMockMode = (text: string, params?: any[]) => {
  console.log('MOCK QUERY EXECUTION:', text);
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('select 1')) return { rows: [{ 1: 1 }] };

  if (lowerText.includes('select count(*)')) {
    if (lowerText.includes('from users')) return { rows: [{ count: mockStore.users.length }] };
    if (lowerText.includes('from services')) return { rows: [{ count: mockStore.services.length }] };
    if (lowerText.includes('from categories')) return { rows: [{ count: mockStore.categories.length }] };
    return { rows: [{ count: 0 }] };
  }

  if (lowerText.includes('insert into services')) {
    const newService = {
      id: mockStore.services.length + 1,
      title: params?.[0],
      description: params?.[1],
      price: params?.[2],
      image_url: params?.[3],
      video_url: params?.[4],
      category_id: params?.[5],
      subcategory_id: params?.[6],
      user_id: params?.[7],
      phone: params?.[8],
      lat: params?.[9],
      lng: params?.[10],
      service_type: params?.[11],
      experience: params?.[12],
      certificates: params?.[13],
      bio: params?.[14],
      provider_name: 'Mock Provider',
      created_at: new Date().toISOString()
    };
    mockStore.services.push(newService);
    return { rows: [newService] };
  }

  if (lowerText.includes('update services set')) {
    const id = parseInt(params?.[14]);
    const index = mockStore.services.findIndex(s => s.id === id);
    if (index !== -1) {
      mockStore.services[index] = {
        ...mockStore.services[index],
        title: params?.[0],
        description: params?.[1],
        price: params?.[2],
        image_url: params?.[3],
        video_url: params?.[4],
        category_id: params?.[5],
        subcategory_id: params?.[6],
        phone: params?.[7],
        lat: params?.[8],
        lng: params?.[9],
        service_type: params?.[10],
        experience: params?.[11],
        certificates: params?.[12],
        bio: params?.[13]
      };
      return { rows: [mockStore.services[index]] };
    }
    return { rows: [] };
  }

  if (lowerText.includes('delete from services')) {
    const id = parseInt(params?.[0]);
    mockStore.services = mockStore.services.filter(s => s.id !== id);
    return { rows: [] };
  }

  if (lowerText.includes('from services')) {
    return { rows: mockStore.services };
  }

  if (lowerText.includes('from users')) {
    if (lowerText.includes('where phone = $1')) {
      const user = mockStore.users.find(u => u.phone === params?.[0]);
      return { rows: user ? [user] : [] };
    }
    if (lowerText.includes('where id = $1')) {
      const user = mockStore.users.find(u => u.id === params?.[0]);
      return { rows: user ? [user] : [] };
    }
    return { rows: mockStore.users };
  }

  if (lowerText.includes('from categories')) {
    return { rows: mockStore.categories };
  }

  return { rows: [] };
};

export default pool;
