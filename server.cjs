var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express7 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_dotenv4 = __toESM(require("dotenv"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/db/index.ts
var import_pg = require("pg");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
import_dotenv.default.config();
var databaseUrl = process.env.DATABASE_URL;
console.log("DEBUG: DATABASE_URL is:", databaseUrl);
var isDatabaseConnected = !!databaseUrl;
var setDatabaseConnected = (status) => {
  isDatabaseConnected = status;
  if (!status) {
    console.warn("Database connection failed. Falling back to Mock Database Mode.");
  }
};
if (!databaseUrl) {
  console.warn("WARNING: DATABASE_URL environment variable is not set. Using Mock Database Mode to prevent errors.");
}
var pool = databaseUrl ? new import_pg.Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 2e3,
  // Reduced to 2 seconds to fail very fast
  idleTimeoutMillis: 1e4,
  max: 10,
  keepAlive: true,
  statement_timeout: 3e3,
  // 3 seconds
  query_timeout: 3e3,
  // 3 seconds
  application_name: "saleen-app"
}) : null;
console.log("DEBUG: Pool initialized:", !!pool);
if (pool) {
  pool.on("connect", () => {
    console.log("DEBUG: A new client has connected to the database pool.");
  });
  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    isDatabaseConnected = false;
  });
}
var MOCK_DB_PATH = import_path.default.join(process.cwd(), "mock-db.json");
var mockStore = {
  users: [],
  services: [],
  categories: []
};
try {
  if (import_fs.default.existsSync(MOCK_DB_PATH)) {
    const data = import_fs.default.readFileSync(MOCK_DB_PATH, "utf-8");
    mockStore = JSON.parse(data);
  }
} catch (e) {
  console.error("Failed to load mock DB:", e);
}
var saveMockDb = () => {
  try {
    import_fs.default.writeFileSync(MOCK_DB_PATH, JSON.stringify(mockStore, null, 2));
  } catch (e) {
    console.error("Failed to save mock DB:", e);
  }
};
var query = async (text, params) => {
  if (!isDatabaseConnected || !pool) {
    console.log("MOCK QUERY:", text, params);
    const lowerText = text.toLowerCase();
    if (lowerText.includes("select 1")) return { rows: [{ 1: 1 }] };
    if (lowerText.includes("select exists")) {
      if (mockStore.services.length > 0 || mockStore.categories.length > 0) {
        return { rows: [{ exists: true }] };
      }
      return { rows: [] };
    }
    if (lowerText.includes("select count(*)")) {
      if (lowerText.includes("from users")) return { rows: [{ count: mockStore.users.length }] };
      if (lowerText.includes("from services")) return { rows: [{ count: mockStore.services.length }] };
      if (lowerText.includes("from categories")) return { rows: [{ count: mockStore.categories.length }] };
      return { rows: [{ count: 0 }] };
    }
    if (lowerText.includes("insert into services")) {
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
        provider_name: "Mock Provider",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      mockStore.services.push(newService);
      saveMockDb();
      console.log("MOCK: Added new service:", newService.id);
      return { rows: [newService] };
    }
    if (lowerText.includes("update services set")) {
      const id = parseInt(params?.[14]);
      const index = mockStore.services.findIndex((s) => s.id === id);
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
        console.log("MOCK: Updated service:", id);
        return { rows: [mockStore.services[index]] };
      }
      return { rows: [] };
    }
    if (lowerText.includes("delete from services")) {
      const id = parseInt(params?.[0]);
      mockStore.services = mockStore.services.filter((s) => s.id !== id);
      saveMockDb();
      console.log("MOCK: Deleted service:", id);
      return { rows: [] };
    }
    if (lowerText.includes("from services")) {
      return { rows: mockStore.services };
    }
    if (lowerText.includes("insert into users")) {
      const newUser = {
        id: mockStore.users.length + 1,
        name: params?.[0],
        phone: params?.[1],
        email: params?.[2],
        password: params?.[3],
        google_id: params?.[4],
        role: params?.[5] || "user",
        status: "active",
        is_verified: false,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      mockStore.users.push(newUser);
      saveMockDb();
      return { rows: [newUser] };
    }
    if (lowerText.includes("from users")) {
      if (lowerText.includes("where phone = $1")) {
        const user = mockStore.users.find((u) => u.phone === params?.[0]);
        return { rows: user ? [user] : [] };
      }
      if (lowerText.includes("where id = $1")) {
        const user = mockStore.users.find((u) => u.id === params?.[0]);
        return { rows: user ? [user] : [] };
      }
      return { rows: mockStore.users };
    }
    if (lowerText.includes("insert into categories")) {
      const newCategory = {
        id: params?.[0],
        name_ar: params?.[1],
        name_en: params?.[2],
        icon: params?.[3],
        parent_id: params?.[4],
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      mockStore.categories.push(newCategory);
      saveMockDb();
      return { rows: [newCategory] };
    }
    if (lowerText.includes("from categories")) {
      return { rows: mockStore.categories };
    }
    return { rows: [] };
  }
  try {
    if (!pool) throw new Error("Pool not initialized");
    const startTime = Date.now();
    const queryPromise = pool.query(text, params);
    const timeoutPromise = new Promise(
      (_, reject) => setTimeout(() => reject(new Error("Query execution timeout (3s)")), 3e3)
    );
    const result = await Promise.race([queryPromise, timeoutPromise]);
    const duration = Date.now() - startTime;
    if (duration > 2e3) {
      console.warn(`Slow query detected (${duration}ms):`, text.substring(0, 100));
    }
    return result;
  } catch (err) {
    console.error("Database query error:", err.message);
    const isConnectionError = err.message.toLowerCase().includes("terminated") || err.message.toLowerCase().includes("timeout") || err.message.toLowerCase().includes("connection") || err.message.toLowerCase().includes("pool") || err.message.toLowerCase().includes("econnrefused") || err.message.toLowerCase().includes("ehostunreach") || err.message.toLowerCase().includes("socket hang up");
    if (isConnectionError) {
      console.warn("Database connection issue detected:", err.message);
      console.warn("Switching to Mock Database Mode to prevent app freeze.");
      isDatabaseConnected = false;
      return queryInMockMode(text, params);
    }
    throw err;
  }
};
var queryInMockMode = (text, params) => {
  console.log("MOCK QUERY EXECUTION:", text);
  const lowerText = text.toLowerCase();
  if (lowerText.includes("select 1")) return { rows: [{ 1: 1 }] };
  if (lowerText.includes("select count(*)")) {
    if (lowerText.includes("from users")) return { rows: [{ count: mockStore.users.length }] };
    if (lowerText.includes("from services")) return { rows: [{ count: mockStore.services.length }] };
    if (lowerText.includes("from categories")) return { rows: [{ count: mockStore.categories.length }] };
    return { rows: [{ count: 0 }] };
  }
  if (lowerText.includes("insert into services")) {
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
      provider_name: "Mock Provider",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    mockStore.services.push(newService);
    return { rows: [newService] };
  }
  if (lowerText.includes("update services set")) {
    const id = parseInt(params?.[14]);
    const index = mockStore.services.findIndex((s) => s.id === id);
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
  if (lowerText.includes("delete from services")) {
    const id = parseInt(params?.[0]);
    mockStore.services = mockStore.services.filter((s) => s.id !== id);
    return { rows: [] };
  }
  if (lowerText.includes("from services")) {
    return { rows: mockStore.services };
  }
  if (lowerText.includes("from users")) {
    if (lowerText.includes("where phone = $1")) {
      const user = mockStore.users.find((u) => u.phone === params?.[0]);
      return { rows: user ? [user] : [] };
    }
    if (lowerText.includes("where id = $1")) {
      const user = mockStore.users.find((u) => u.id === params?.[0]);
      return { rows: user ? [user] : [] };
    }
    return { rows: mockStore.users };
  }
  if (lowerText.includes("from categories")) {
    return { rows: mockStore.categories };
  }
  return { rows: [] };
};
var db_default = pool;

// src/db/init.ts
var initDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("Skipping database initialization: DATABASE_URL is not set.");
    return;
  }
  let client;
  let retries = 1;
  let delay = 1e3;
  const totalRetries = 1;
  while (retries > 0) {
    try {
      console.log(`Attempting to connect to the database (Retries left: ${retries})...`);
      client = await db_default.connect();
      console.log("Successfully connected to the database.");
      setDatabaseConnected(true);
      break;
    } catch (err) {
      retries--;
      console.error(`Failed to connect to the database (Attempt ${totalRetries - retries}/${totalRetries}):`, err.message);
      if (err.message.includes("self signed certificate")) {
        console.error("HINT: This might be an SSL issue. Ensure your connection string or pool config is correct for Supabase.");
      }
      if (err.message.includes("timeout")) {
        console.error("HINT: Connection timed out. Check if your database is accessible and the URL is correct.");
      }
      if (retries === 0) {
        console.error("All database connection attempts failed. Falling back to Mock Database Mode.");
        setDatabaseConnected(false);
        return;
      }
      console.log(`Retrying in ${delay / 1e3} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  if (!client) return;
  try {
    await client.query("BEGIN");
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
    const userColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    const uColumnNames = userColumns.rows.map((r) => r.column_name);
    if (!uColumnNames.includes("google_id")) {
      await client.query("ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE");
    }
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
    const categoryColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'categories'
    `);
    const columnNames = categoryColumns.rows.map((r) => r.column_name);
    const idColumn = categoryColumns.rows.find((r) => r.column_name === "id");
    if (!columnNames.includes("parent_id")) {
      await client.query("ALTER TABLE categories ADD COLUMN parent_id VARCHAR(50) REFERENCES categories(id)");
    }
    if (idColumn && (idColumn.data_type === "integer" || idColumn.data_type === "bigint")) {
      console.log("Migrating categories.id from integer to varchar...");
      await client.query("ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_id_fkey");
      await client.query("ALTER TABLE categories ALTER COLUMN id TYPE VARCHAR(50)");
      await client.query("ALTER TABLE services ALTER COLUMN category_id TYPE VARCHAR(50)");
      await client.query("ALTER TABLE services ADD CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE");
    }
    if (!columnNames.includes("name_ar")) {
      await client.query("ALTER TABLE categories ADD COLUMN name_ar VARCHAR(255) DEFAULT ''");
      if (columnNames.includes("name")) {
        await client.query("UPDATE categories SET name_ar = name");
      }
    }
    if (!columnNames.includes("name_en")) {
      await client.query("ALTER TABLE categories ADD COLUMN name_en VARCHAR(255) DEFAULT ''");
      if (columnNames.includes("name")) {
        await client.query("UPDATE categories SET name_en = name");
      }
    }
    if (columnNames.includes("name")) {
      await client.query("ALTER TABLE categories DROP COLUMN name");
    }
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
    const serviceColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services'
    `);
    const sColumnNames = serviceColumns.rows.map((r) => r.column_name);
    const categoryIdColumn = serviceColumns.rows.find((r) => r.column_name === "category_id");
    if (categoryIdColumn && (categoryIdColumn.data_type === "integer" || categoryIdColumn.data_type === "bigint")) {
      console.log("Migrating services.category_id from integer to varchar...");
      await client.query("ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_id_fkey");
      await client.query("ALTER TABLE services ALTER COLUMN category_id TYPE VARCHAR(50)");
      await client.query("ALTER TABLE services ADD CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE");
    }
    if (!sColumnNames.includes("subcategory_id")) {
      await client.query("ALTER TABLE services ADD COLUMN subcategory_id VARCHAR(50)");
    }
    if (!sColumnNames.includes("phone")) {
      await client.query("ALTER TABLE services ADD COLUMN phone VARCHAR(50)");
    }
    if (!sColumnNames.includes("lat")) {
      await client.query("ALTER TABLE services ADD COLUMN lat DOUBLE PRECISION");
    }
    if (!sColumnNames.includes("lng")) {
      await client.query("ALTER TABLE services ADD COLUMN lng DOUBLE PRECISION");
    }
    if (!sColumnNames.includes("service_type")) {
      await client.query("ALTER TABLE services ADD COLUMN service_type VARCHAR(50)");
    }
    if (!sColumnNames.includes("experience")) {
      await client.query("ALTER TABLE services ADD COLUMN experience TEXT");
    }
    if (!sColumnNames.includes("certificates")) {
      await client.query("ALTER TABLE services ADD COLUMN certificates JSONB");
    }
    if (!sColumnNames.includes("bio")) {
      await client.query("ALTER TABLE services ADD COLUMN bio TEXT");
    }
    if (!sColumnNames.includes("video_url")) {
      await client.query("ALTER TABLE services ADD COLUMN video_url TEXT");
    }
    await client.query("UPDATE services SET category_id = 'bakeries' WHERE category_id = 'sweets'");
    await client.query("DELETE FROM categories WHERE id = 'sweets'");
    const categoriesSeed = [
      { id: "construction_plumbing", ar: "\u0627\u0644\u0625\u0646\u0634\u0627\u0626\u064A\u0627\u062A \u0648\u0627\u0644\u0635\u062D\u064A\u0627\u062A", en: "Construction & Plumbing", icon: "HardHat" },
      { id: "doctors", ar: "\u0637\u0628\u064A\u0628", en: "Doctor", icon: "Stethoscope" },
      { id: "pharmacy", ar: "\u0627\u0644\u0635\u064A\u062F\u0644\u0629", en: "Pharmacy", icon: "Pill" },
      { id: "welding", ar: "\u0627\u0644\u0644\u062D\u0627\u0645", en: "Welding", icon: "Flame" },
      { id: "agriculture", ar: "\u0627\u0644\u0632\u0631\u0627\u0639\u0629", en: "Agriculture", icon: "Sprout" },
      { id: "carpentry", ar: "\u0646\u062C\u0627\u0631 \u0628\u064A\u0648\u062A", en: "Carpentry", icon: "Hammer" },
      { id: "mechanics", ar: "\u0635\u064A\u0627\u0646\u0629 \u0633\u064A\u0627\u0631\u0627\u062A", en: "Car Maintenance", icon: "Car" },
      { id: "plumbers", ar: "\u0627\u0644\u0633\u0628\u0627\u0643\u0629", en: "Plumbing", icon: "Droplet" },
      { id: "electricity", ar: "\u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0621", en: "Electricity", icon: "Zap" },
      { id: "hvac", ar: "\u0627\u0644\u062A\u0628\u0631\u064A\u062F \u0648\u0627\u0644\u062A\u0643\u064A\u064A\u0641", en: "HVAC", icon: "Snowflake" },
      { id: "construction", ar: "\u0627\u0644\u0628\u0646\u0627\u0621 \u0648\u0627\u0644\u062F\u064A\u0643\u0648\u0631", en: "Construction & Decor", icon: "PaintRoller" },
      { id: "engineering", ar: "\u0642\u0633\u0645 \u0627\u0644\u0647\u0646\u062F\u0633\u0629", en: "Engineering", icon: "Building2" },
      { id: "mobiles", ar: "\u0627\u0644\u0645\u0648\u0628\u0627\u064A\u0644\u0627\u062A", en: "Mobiles", icon: "Smartphone" },
      { id: "bikes", ar: "\u0627\u0644\u062F\u0631\u0627\u062C\u0627\u062A", en: "Bikes", icon: "Bike" },
      { id: "clothing", ar: "\u0627\u0644\u0645\u0644\u0627\u0628\u0633", en: "Clothing", icon: "Shirt" },
      { id: "barber", ar: "\u0627\u0644\u062D\u0644\u0627\u0642\u0629", en: "Barber & Salon", icon: "Scissors" },
      { id: "food", ar: "\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u063A\u0630\u0627\u0626\u064A\u0629 \u0648\u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u064A\u0648\u0645\u064A\u0629", en: "Food & Daily Services", icon: "ShoppingBag" },
      { id: "medical_equipment", ar: "\u0623\u062C\u0647\u0632\u0629 \u0648\u0645\u0639\u062F\u0627\u062A \u0637\u0628\u064A\u0629", en: "Medical Equipment & Devices", icon: "Microscope" },
      { id: "hotels", ar: "\u0641\u0646\u0627\u062F\u0642", en: "Hotels", icon: "Hotel" },
      { id: "restaurants", ar: "\u0645\u0637\u0627\u0639\u0645", en: "Restaurants", icon: "Utensils" },
      { id: "bakeries", ar: "\u0627\u0644\u0623\u0641\u0631\u0627\u0646\u060C \u0627\u0644\u0645\u062E\u0627\u0628\u0632 \u0648\u0627\u0644\u062D\u0644\u0648\u064A\u0627\u062A", en: "Bakeries, Ovens & Sweets", icon: "Croissant" },
      { id: "universities", ar: "\u0627\u0644\u062C\u0627\u0645\u0639\u0627\u062A", en: "Universities", icon: "GraduationCap", parent_id: null },
      { id: "universities_gov", ar: "\u062C\u0627\u0645\u0639\u0627\u062A \u062D\u0643\u0648\u0645\u064A\u0629", en: "Government Universities", icon: "Building2", parent_id: "universities" },
      { id: "universities_priv", ar: "\u062C\u0627\u0645\u0639\u0627\u062A \u0623\u0647\u0644\u064A\u0629", en: "Private Universities", icon: "Building2", parent_id: "universities" },
      { id: "colleges", ar: "\u0643\u0644\u064A\u0627\u062A", en: "Colleges", icon: "BookOpen", parent_id: "universities_gov" },
      { id: "institutes", ar: "\u0645\u0639\u0627\u0647\u062F", en: "Institutes", icon: "BookOpen", parent_id: "universities_gov" },
      { id: "civil_defense", ar: "\u0627\u0644\u062F\u0641\u0627\u0639 \u0627\u0644\u0645\u062F\u0646\u064A", en: "Civil Defense", icon: "ShieldAlert" },
      { id: "police", ar: "\u0645\u0631\u0627\u0643\u0632 \u0627\u0644\u0634\u0631\u0637\u0629", en: "Police Stations", icon: "Shield" },
      { id: "gas_stations", ar: "\u0645\u062D\u0637\u0627\u062A \u0627\u0644\u0648\u0642\u0648\u062F", en: "Gas Stations", icon: "Fuel" },
      { id: "football_fields", ar: "\u0645\u0644\u0627\u0639\u0628 \u0643\u0631\u0629 \u0627\u0644\u0642\u062F\u0645", en: "Football Fields", icon: "Trophy" }
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
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
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
    await client.query(`
      CREATE TABLE IF NOT EXISTS gold_types (
        id SERIAL PRIMARY KEY,
        name_ar VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
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
    await client.query("COMMIT");
    console.log("Database tables initialized successfully.");
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("Error initializing database tables:", error);
    setDatabaseConnected(false);
  } finally {
    if (client) client.release();
  }
};

// src/routes/authRoutes.ts
var import_express = require("express");

// src/controllers/authController.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_dotenv2 = __toESM(require("dotenv"), 1);
import_dotenv2.default.config();
var register = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;
    const userExists = await query("SELECT * FROM users WHERE phone = $1 OR email = $2", [phone, email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User with this phone or email already exists." });
    }
    const salt = await import_bcrypt.default.genSalt(10);
    const hashedPassword = await import_bcrypt.default.hash(password, salt);
    const newUser = await query(
      "INSERT INTO users (name, phone, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, phone, email, role",
      [name, phone, email, hashedPassword, role || "user"]
    );
    res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    let userResult;
    if (email) {
      userResult = await query("SELECT * FROM users WHERE email = $1", [email]);
    } else if (phone) {
      userResult = await query("SELECT * FROM users WHERE phone = $1", [phone]);
    } else {
      return res.status(400).json({ error: "Email or phone is required." });
    }
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    const user = userResult.rows[0];
    if (user.status === "blocked") {
      return res.status(403).json({ error: "Your account has been blocked." });
    }
    if (!user.password) {
      return res.status(400).json({ error: "Please use the correct login method for this account." });
    }
    const validPassword = await import_bcrypt.default.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.warn("WARNING: JWT_SECRET is not set. Using an insecure fallback secret for development.");
    }
    const token = import_jsonwebtoken.default.sign(
      { id: user.id, role: user.role },
      jwtSecret || "fallback_secret",
      { expiresIn: "7d" }
    );
    res.json({
      message: "Logged in successfully",
      token,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, status: user.status, is_verified: user.is_verified }
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var loginPhone = async (req, res) => {
  try {
    const { phone, name, otp } = req.body;
    if (otp !== "123456" && otp !== "654321") {
    }
    let userResult = await query("SELECT * FROM users WHERE phone = $1", [phone]);
    let user;
    if (userResult.rows.length === 0) {
      const newUser = await query(
        "INSERT INTO users (name, phone, is_verified) VALUES ($1, $2, $3) RETURNING *",
        [name || "User", phone, true]
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
      if (user.status === "blocked") {
        return res.status(403).json({ error: "Your account has been blocked." });
      }
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.warn("WARNING: JWT_SECRET is not set. Using an insecure fallback secret for development.");
    }
    const token = import_jsonwebtoken.default.sign(
      { id: user.id, role: user.role },
      jwtSecret || "fallback_secret",
      { expiresIn: "7d" }
    );
    res.json({
      message: "Logged in successfully",
      token,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, status: user.status, is_verified: user.is_verified }
    });
  } catch (error) {
    console.error("Error phone login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var loginGoogle = async (req, res) => {
  try {
    const { token: googleToken } = req.body;
    const mockGoogleUser = {
      id: "google-123",
      email: "user@gmail.com",
      name: "Google User"
    };
    let userResult = await query("SELECT * FROM users WHERE google_id = $1 OR email = $2", [mockGoogleUser.id, mockGoogleUser.email]);
    let user;
    if (userResult.rows.length === 0) {
      const newUser = await query(
        "INSERT INTO users (name, email, google_id, is_verified) VALUES ($1, $2, $3, $4) RETURNING *",
        [mockGoogleUser.name, mockGoogleUser.email, mockGoogleUser.id, true]
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
      if (user.status === "blocked") {
        return res.status(403).json({ error: "Your account has been blocked." });
      }
      if (!user.google_id) {
        await query("UPDATE users SET google_id = $1, is_verified = TRUE WHERE id = $2", [mockGoogleUser.id, user.id]);
      }
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.warn("WARNING: JWT_SECRET is not set. Using an insecure fallback secret for development.");
    }
    const token = import_jsonwebtoken.default.sign(
      { id: user.id, role: user.role },
      jwtSecret || "fallback_secret",
      { expiresIn: "7d" }
    );
    res.json({
      message: "Logged in successfully",
      token,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, status: user.status, is_verified: user.is_verified }
    });
  } catch (error) {
    console.error("Error google login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var adminLogin = async (req, res) => {
  try {
    const { code } = req.body;
    const adminCode = process.env.ADMIN_CODE || "199444";
    if (code !== adminCode) {
      return res.status(400).json({ error: "Invalid admin code." });
    }
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
    const token = import_jsonwebtoken.default.sign(
      { id: 0, role: "admin" },
      jwtSecret,
      { expiresIn: "7d" }
    );
    res.json({
      message: "Admin logged in successfully",
      token,
      user: { id: 0, name: "Admin", role: "admin" }
    });
  } catch (error) {
    console.error("Error admin login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const userResult = await query("SELECT id, name, phone, email, role FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: userResult.rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// src/middleware/auth.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var import_dotenv3 = __toESM(require("dotenv"), 1);
import_dotenv3.default.config();
var authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("authenticateToken called for:", req.url, "token:", token);
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, process.env.JWT_SECRET || "fallback_secret");
    console.log("Token verified, user:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ error: "Invalid token." });
  }
};
var optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return next();
  }
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, process.env.JWT_SECRET || "fallback_secret");
    req.user = decoded;
    next();
  } catch (error) {
    next();
  }
};
var isAdmin = (req, res, next) => {
  console.log("isAdmin called, user role:", req.user?.role);
  if (req.user?.role !== "admin") {
    console.log("Access denied. Admin only.");
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  next();
};

// src/routes/authRoutes.ts
var router = (0, import_express.Router)();
router.post("/admin-login", adminLogin);
router.post("/register", register);
router.post("/login", login);
router.post("/login-phone", loginPhone);
router.post("/google", loginGoogle);
router.get("/me", authenticateToken, getMe);
var authRoutes_default = router;

// src/routes/serviceRoutes.ts
var import_express2 = require("express");

// src/controllers/serviceController.ts
var createService = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category_id,
      subcategory_id,
      image_url,
      video_url,
      phone,
      lat,
      lng,
      service_type,
      experience,
      certificates,
      bio
    } = req.body;
    const user_id = req.user?.id || null;
    const newService = await query(
      `INSERT INTO services (
        title, description, price, image_url, video_url, category_id, subcategory_id, 
        user_id, phone, lat, lng, service_type, experience, 
        certificates, bio
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [
        title,
        description,
        price,
        image_url,
        video_url,
        category_id,
        subcategory_id,
        user_id,
        phone,
        lat,
        lng,
        service_type,
        experience,
        JSON.stringify(certificates || []),
        bio
      ]
    );
    res.status(201).json(newService.rows[0]);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var getServices = async (req, res) => {
  try {
    const { page = 1, limit = 100, search = "", category_id, subcategory_id, sort = "newest" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let queryText = `
      SELECT s.*, u.name as provider_name, c.name_en as category_name_en, c.name_ar as category_name_ar,
      COALESCE(AVG(r.rating), 0) as average_rating,
      COUNT(r.id) as review_count
      FROM services s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN reviews r ON s.id = r.service_id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;
    if (search) {
      queryText += ` AND (s.title ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    if (category_id) {
      queryText += ` AND s.category_id = $${paramIndex}`;
      queryParams.push(category_id);
      paramIndex++;
    }
    if (subcategory_id && subcategory_id !== "all") {
      queryText += ` AND s.subcategory_id = $${paramIndex}`;
      queryParams.push(subcategory_id);
      paramIndex++;
    }
    queryText += ` GROUP BY s.id, u.name, c.name_en, c.name_ar`;
    if (sort === "highest_rated") {
      queryText += ` ORDER BY average_rating DESC`;
    } else {
      queryText += ` ORDER BY s.created_at DESC`;
    }
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);
    const services = await query(queryText, queryParams);
    let countQueryText = `SELECT COUNT(*) FROM services s WHERE 1=1`;
    const countParams = [];
    let countParamIndex = 1;
    if (search) {
      countQueryText += ` AND (s.title ILIKE $${countParamIndex} OR s.description ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    if (category_id) {
      countQueryText += ` AND s.category_id = $${countParamIndex}`;
      countParams.push(category_id);
      countParamIndex++;
    }
    if (subcategory_id && subcategory_id !== "all") {
      countQueryText += ` AND s.subcategory_id = $${countParamIndex}`;
      countParams.push(subcategory_id);
      countParamIndex++;
    }
    const totalCountResult = await query(countQueryText, countParams);
    const totalCount = parseInt(totalCountResult.rows[0].count);
    res.json({
      data: services.rows,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM services WHERE id = $1", [id]);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      category_id,
      subcategory_id,
      image_url,
      video_url,
      phone,
      lat,
      lng,
      service_type,
      experience,
      certificates,
      bio
    } = req.body;
    const updatedService = await query(
      `UPDATE services SET 
        title = $1, description = $2, price = $3, image_url = $4, video_url = $5, 
        category_id = $6, subcategory_id = $7, phone = $8, lat = $9, lng = $10, 
        service_type = $11, experience = $12, certificates = $13, bio = $14
      WHERE id = $15 RETURNING *`,
      [
        title,
        description,
        price,
        image_url,
        video_url,
        category_id,
        subcategory_id,
        phone,
        lat,
        lng,
        service_type,
        experience,
        JSON.stringify(certificates || []),
        bio,
        id
      ]
    );
    if (updatedService.rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(updatedService.rows[0]);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// src/routes/serviceRoutes.ts
var router2 = (0, import_express2.Router)();
router2.post("/", optionalAuth, createService);
router2.get("/", getServices);
router2.put("/:id", authenticateToken, isAdmin, updateService);
router2.delete("/:id", authenticateToken, isAdmin, deleteService);
var serviceRoutes_default = router2;

// src/routes/orderRoutes.ts
var import_express3 = require("express");

// src/controllers/orderController.ts
var createOrder = async (req, res) => {
  try {
    const { service_id } = req.body;
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ error: "Unauthorized" });
    const newOrder = await query(
      "INSERT INTO orders (user_id, service_id) VALUES ($1, $2) RETURNING *",
      [user_id, service_id]
    );
    res.status(201).json(newOrder.rows[0]);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var getUserOrders = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ error: "Unauthorized" });
    const orders = await query(
      `SELECT o.*, s.title as service_title, s.price as service_price, u.name as provider_name
       FROM orders o
       JOIN services s ON o.service_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [user_id]
    );
    res.json(orders.rows);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// src/routes/orderRoutes.ts
var router3 = (0, import_express3.Router)();
router3.post("/", authenticateToken, createOrder);
router3.get("/user", authenticateToken, getUserOrders);
var orderRoutes_default = router3;

// src/routes/reviewRoutes.ts
var import_express4 = require("express");

// src/controllers/reviewController.ts
var createReview = async (req, res) => {
  try {
    const { service_id, rating, comment } = req.body;
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ error: "Unauthorized" });
    const orderExists = await query(
      "SELECT * FROM orders WHERE user_id = $1 AND service_id = $2 AND status = $3",
      [user_id, service_id, "completed"]
    );
    if (orderExists.rows.length === 0) {
      return res.status(403).json({ error: "You can only review services you have completed orders for." });
    }
    const newReview = await query(
      "INSERT INTO reviews (user_id, service_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, service_id, rating, comment]
    );
    res.status(201).json(newReview.rows[0]);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var getServiceReviews = async (req, res) => {
  try {
    const { service_id } = req.params;
    const reviews = await query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.service_id = $1
       ORDER BY r.created_at DESC`,
      [service_id]
    );
    res.json(reviews.rows);
  } catch (error) {
    console.error("Error fetching service reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// src/routes/reviewRoutes.ts
var router4 = (0, import_express4.Router)();
router4.post("/", authenticateToken, createReview);
router4.get("/service/:service_id", getServiceReviews);
var reviewRoutes_default = router4;

// src/routes/categoryRoutes.ts
var import_express5 = require("express");

// src/controllers/categoryController.ts
var createCategory = async (req, res) => {
  try {
    const { id, name_ar, name_en, icon } = req.body;
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    const newCategory = await query(
      "INSERT INTO categories (id, name_ar, name_en, icon) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, name_ar, name_en, icon]
    );
    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var getCategories = async (req, res) => {
  try {
    const categories = await query("SELECT * FROM categories ORDER BY name_en ASC");
    res.json(categories.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var seedCategories = async (req, res) => {
  try {
    const mockCategories = [
      { id: "construction_plumbing", ar: "\u0627\u0644\u0625\u0646\u0634\u0627\u0626\u064A\u0627\u062A \u0648\u0627\u0644\u0635\u062D\u064A\u0627\u062A", en: "Construction & Plumbing", icon: "HardHat" },
      { id: "doctors", ar: "\u0637\u0628\u064A\u0628", en: "Doctor", icon: "Stethoscope" },
      { id: "pharmacy", ar: "\u0627\u0644\u0635\u064A\u062F\u0644\u0629", en: "Pharmacy", icon: "Pill" },
      { id: "welding", ar: "\u0627\u0644\u0644\u062D\u0627\u0645", en: "Welding", icon: "Flame" },
      { id: "agriculture", ar: "\u0627\u0644\u0632\u0631\u0627\u0639\u0629", en: "Agriculture", icon: "Sprout" },
      { id: "carpentry", ar: "\u0646\u062C\u0627\u0631 \u0628\u064A\u0648\u062A", en: "Carpentry", icon: "Hammer" },
      { id: "mechanics", ar: "\u0635\u064A\u0627\u0646\u0629 \u0633\u064A\u0627\u0631\u0627\u062A", en: "Car Maintenance", icon: "Car" },
      { id: "plumbers", ar: "\u0627\u0644\u0633\u0628\u0627\u0643\u0629", en: "Plumbing", icon: "Droplet" },
      { id: "electricity", ar: "\u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0621", en: "Electricity", icon: "Zap" },
      { id: "hvac", ar: "\u0627\u0644\u062A\u0628\u0631\u064A\u062F \u0648\u0627\u0644\u062A\u0643\u064A\u064A\u0641", en: "HVAC", icon: "Snowflake" },
      { id: "construction", ar: "\u0627\u0644\u0628\u0646\u0627\u0621 \u0648\u0627\u0644\u062F\u064A\u0643\u0648\u0631", en: "Construction & Decor", icon: "PaintRoller" },
      { id: "engineering", ar: "\u0642\u0633\u0645 \u0627\u0644\u0647\u0646\u062F\u0633\u0629", en: "Engineering", icon: "Building2" },
      { id: "mobiles", ar: "\u0627\u0644\u0645\u0648\u0628\u0627\u064A\u0644\u0627\u062A", en: "Mobiles", icon: "Smartphone" },
      { id: "bikes", ar: "\u0627\u0644\u062F\u0631\u0627\u062C\u0627\u062A", en: "Bikes", icon: "Bike" },
      { id: "clothing", ar: "\u0627\u0644\u0645\u0644\u0627\u0628\u0633", en: "Clothing", icon: "Shirt" },
      { id: "barber", ar: "\u0627\u0644\u062D\u0644\u0627\u0642\u0629", en: "Barber & Salon", icon: "Scissors" },
      { id: "food", ar: "\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u063A\u0630\u0627\u0626\u064A\u0629 \u0648\u0627\u0644\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u064A\u0648\u0645\u064A\u0629", en: "Food & Daily Services", icon: "ShoppingBag" },
      { id: "medical_equipment", ar: "\u0623\u062C\u0647\u0632\u0629 \u0648\u0645\u0639\u062F\u0627\u062A \u0637\u0628\u064A\u0629", en: "Medical Equipment & Devices", icon: "Microscope" },
      { id: "hotels", ar: "\u0641\u0646\u0627\u062F\u0642", en: "Hotels", icon: "Hotel" },
      { id: "restaurants", ar: "\u0645\u0637\u0627\u0639\u0645", en: "Restaurants", icon: "Utensils" },
      { id: "sweets", ar: "\u062D\u0644\u0648\u064A\u0627\u062A \u0648\u0645\u0639\u062C\u0646\u0627\u062A", en: "Sweets & Pastries", icon: "Cake" }
    ];
    for (const cat of mockCategories) {
      const existing = await query("SELECT id FROM categories WHERE id = $1", [cat.id]);
      if (existing.rows.length === 0) {
        await query(
          "INSERT INTO categories (id, name_ar, name_en, icon) VALUES ($1, $2, $3, $4)",
          [cat.id, cat.ar, cat.en, cat.icon]
        );
      }
    }
    res.json({ message: "Categories seeded successfully" });
  } catch (error) {
    console.error("Error seeding categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// src/routes/categoryRoutes.ts
var router5 = (0, import_express5.Router)();
router5.post("/seed", seedCategories);
router5.post("/", authenticateToken, createCategory);
router5.get("/", getCategories);
var categoryRoutes_default = router5;

// src/routes/userRoutes.ts
var import_express6 = require("express");

// src/controllers/userController.ts
var getAllUsers = async (req, res) => {
  try {
    const result = await query("SELECT id, name, phone, email, role, status, is_verified, created_at FROM users ORDER BY created_at DESC");
    res.json({ users: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }
    await query("UPDATE users SET status = $1 WHERE id = $2", [status, id]);
    res.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var toggleUserVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;
    await query("UPDATE users SET is_verified = $1 WHERE id = $2", [is_verified, id]);
    res.json({ message: "User verification toggled successfully" });
  } catch (error) {
    console.error("Error toggling user verification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
var getStats = async (req, res) => {
  try {
    const userCount = await query("SELECT COUNT(*) FROM users");
    const serviceCount = await query("SELECT COUNT(*) FROM services");
    const orderCount = await query("SELECT COUNT(*) FROM orders");
    const activeOrders = await query("SELECT COUNT(*) FROM orders WHERE status = 'pending'");
    res.json({
      users: parseInt(userCount.rows[0].count),
      services: parseInt(serviceCount.rows[0].count),
      orders: parseInt(orderCount.rows[0].count),
      activeOrders: parseInt(activeOrders.rows[0].count)
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// src/routes/userRoutes.ts
var router6 = (0, import_express6.Router)();
router6.get("/", authenticateToken, isAdmin, getAllUsers);
router6.get("/stats", authenticateToken, isAdmin, getStats);
router6.patch("/:id/status", authenticateToken, isAdmin, updateUserStatus);
router6.patch("/:id/verify", authenticateToken, isAdmin, toggleUserVerification);
var userRoutes_default = router6;

// server.ts
import_dotenv4.default.config();
async function startServer() {
  const app = (0, import_express7.default)();
  const PORT = parseInt(process.env.PORT || "3000", 10);
  app.use((0, import_cors.default)());
  app.use(import_express7.default.json({ limit: "50mb" }));
  app.use(import_express7.default.urlencoded({ limit: "50mb", extended: true }));
  console.log("Initializing DB...");
  initDB().then(() => {
    console.log("DB initialization finished.");
  }).catch((err) => {
    console.error("DB initialization failed:", err);
  });
  app.use("/api/auth", authRoutes_default);
  app.use("/api/services", serviceRoutes_default);
  app.use("/api/orders", orderRoutes_default);
  app.use("/api/reviews", reviewRoutes_default);
  app.use("/api/categories", categoryRoutes_default);
  app.use("/api/users", userRoutes_default);
  app.get("/api/health", async (req, res) => {
    const isMock = !process.env.DATABASE_URL;
    try {
      await query("SELECT 1");
      res.json({
        status: "ok",
        database: isMock ? "mock" : "connected",
        isMock
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        database: isMock ? "mock" : "disconnected",
        message: err instanceof Error ? err.message : "Unknown error",
        isMock
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express7.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
