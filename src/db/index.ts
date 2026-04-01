import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    const maskedUrl = `${url.protocol}//${url.username}:****@${url.host}${url.pathname}${url.search}`;
    console.log('DEBUG: DATABASE_URL is:', maskedUrl);
    console.log('DEBUG: Database Host:', url.hostname);
    console.log('DEBUG: Database Port:', url.port || (url.protocol === 'postgres:' ? '5432' : 'unknown'));
  } catch (e) {
    console.log('DEBUG: DATABASE_URL is set but could not be parsed as a URL.');
  }
} else {
  console.log('DEBUG: DATABASE_URL is not set.');
}

export let isDatabaseConnected = !!databaseUrl;

export const setDatabaseConnected = (status: boolean) => {
  isDatabaseConnected = status;
  if (!status) {
    console.error('CRITICAL: Database connection failed. The application may not function correctly.');
  }
};

if (!databaseUrl) {
  console.warn('WARNING: DATABASE_URL environment variable is not set. Using Mock Database Mode (NON-PERSISTENT).');
}

const pool = databaseUrl ? new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 120000, // Increased to 120 seconds
  idleTimeoutMillis: 60000, // Increased to 60 seconds
  max: 5, // Further reduced max connections to ensure stability on free tiers
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  statement_timeout: 120000, // 120 seconds
  query_timeout: 120000, // 120 seconds
  application_name: 'saleen-app',
  idle_in_transaction_session_timeout: 60000, // 60 seconds
}) : null;

console.log('DEBUG: Pool initialized:', !!pool);

if (pool) {
  pool.on('connect', () => {
    console.log('DEBUG: A new client has connected to the database pool.');
    isDatabaseConnected = true;
  });
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // Don't immediately set isDatabaseConnected = false, let the query retry or fail
  });

  // Graceful shutdown
  const closePool = async () => {
    console.log('DEBUG: Closing database pool...');
    try {
      await pool.end();
      console.log('DEBUG: Database pool closed.');
    } catch (err) {
      console.error('Error closing database pool:', err);
    }
  };

  process.on('SIGTERM', closePool);
  process.on('SIGINT', closePool);
}

// Mock Data Store for Demo Mode
import fs from 'fs';
import path from 'path';

const MOCK_DB_PATH = path.join(process.cwd(), 'mock-db.json');

let mockStore: { [key: string]: any[] } = {
  users: [],
  services: [],
  categories: [],
  visits: []
};

try {
  if (fs.existsSync(MOCK_DB_PATH)) {
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    mockStore = {
      users: parsed.users || [],
      services: parsed.services || [],
      categories: parsed.categories || [],
      visits: parsed.visits || []
    };
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

export const query = async (text: string, params?: any[], retries = 3) => {
  // If we have a DATABASE_URL, we MUST try to use the real database.
  // We only use Mock Mode if DATABASE_URL is explicitly missing or connection is already known to be down.
  if (!databaseUrl || !pool || !isDatabaseConnected) {
    return queryInMockMode(text, params);
  }
  
  let lastError: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const startTime = Date.now();
      const result = await pool.query(text, params);
      const duration = Date.now() - startTime;
      
      if (duration > 2000) {
        console.warn(`Slow query detected (${duration}ms):`, text.substring(0, 100));
      }
      
      isDatabaseConnected = true;
      return result;
    } catch (err: any) {
      lastError = err;
      const isConnectionError = err.message.toLowerCase().includes('terminated') || 
                               err.message.toLowerCase().includes('timeout') || 
                               err.message.toLowerCase().includes('connection') ||
                               err.message.toLowerCase().includes('pool') ||
                               err.message.toLowerCase().includes('econnrefused') ||
                               err.message.toLowerCase().includes('econnreset');

      if (isConnectionError) {
        console.error(`Database query attempt ${attempt}/${retries} failed:`, err.message);
        if (err.code) console.error(`Error Code: ${err.code}`);
        
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 3000; // Exponential backoff: 6s, 12s, 24s, 48s...
          console.log(`Retrying query in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        isDatabaseConnected = false;
        console.error('CRITICAL: Database connection lost after multiple attempts. Falling back to MOCK MODE.');
      } else {
        // For non-connection errors (syntax, etc.), don't retry
        throw err;
      }
    }
  }
  
  console.warn('Falling back to MOCK MODE due to database connection failure.');
  return queryInMockMode(text, params);
};

const queryInMockMode = (text: string, params?: any[]) => {
  console.log('MOCK QUERY EXECUTION:', text);
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('select 1')) return { rows: [{ 1: 1 }] };

  if (lowerText.includes('select count(*)')) {
    if (lowerText.includes('from users')) return { rows: [{ count: mockStore.users.length }] };
    if (lowerText.includes('from services')) return { rows: [{ count: mockStore.services.length }] };
    if (lowerText.includes('from categories')) return { rows: [{ count: mockStore.categories.length }] };
    if (lowerText.includes('from visits')) return { rows: [{ count: mockStore.visits.length }] };
    return { rows: [{ count: 0 }] };
  }

  if (lowerText.includes('insert into visits')) {
    const newVisit = {
      id: mockStore.visits.length + 1,
      visitor_id: params?.[0],
      user_agent: params?.[1],
      ip_address: params?.[2],
      created_at: new Date().toISOString()
    };
    mockStore.visits.push(newVisit);
    saveMockDb();
    return { rows: [newVisit] };
  }

  if (lowerText.includes('from visits')) {
    return { rows: mockStore.visits };
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
      provider_name: params?.[0] || '',
      created_at: new Date().toISOString()
    };
    mockStore.services.push(newService);
    saveMockDb();
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
      return { rows: [mockStore.services[index]] };
    }
    return { rows: [] };
  }

  if (lowerText.includes('delete from services')) {
    const id = parseInt(params?.[0]);
    mockStore.services = mockStore.services.filter(s => s.id !== id);
    saveMockDb();
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
