var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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

// src/db/index.ts
var db_exports = {};
__export(db_exports, {
  default: () => db_default,
  isDatabaseConnected: () => isDatabaseConnected,
  query: () => query,
  setDatabaseConnected: () => setDatabaseConnected
});
var import_pg, import_dotenv, import_fs, import_path, databaseUrl, isDatabaseConnected, setDatabaseConnected, pool, MOCK_DB_PATH, mockStore, saveMockDb, query, queryInMockMode, db_default;
var init_db = __esm({
  "src/db/index.ts"() {
    import_pg = require("pg");
    import_dotenv = __toESM(require("dotenv"), 1);
    import_fs = __toESM(require("fs"), 1);
    import_path = __toESM(require("path"), 1);
    import_dotenv.default.config();
    databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      try {
        const url = new URL(databaseUrl);
        const maskedUrl = `${url.protocol}//${url.username}:****@${url.host}${url.pathname}${url.search}`;
        console.log("DEBUG: DATABASE_URL is:", maskedUrl);
        console.log("DEBUG: Database Host:", url.hostname);
        console.log("DEBUG: Database Port:", url.port || (url.protocol === "postgres:" ? "5432" : "unknown"));
      } catch (e) {
        console.log("DEBUG: DATABASE_URL is set but could not be parsed as a URL.");
      }
    } else {
      console.log("DEBUG: DATABASE_URL is not set.");
    }
    isDatabaseConnected = !!databaseUrl;
    setDatabaseConnected = (status) => {
      isDatabaseConnected = status;
      if (!status) {
        console.error("CRITICAL: Database connection failed. The application may not function correctly.");
      }
    };
    if (!databaseUrl) {
      console.warn("WARNING: DATABASE_URL environment variable is not set. Using Mock Database Mode (NON-PERSISTENT).");
    }
    pool = databaseUrl ? new import_pg.Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 12e4,
      // Increased to 120 seconds
      idleTimeoutMillis: 6e4,
      // Increased to 60 seconds
      max: 5,
      // Further reduced max connections to ensure stability on free tiers
      keepAlive: true,
      keepAliveInitialDelayMillis: 1e4,
      statement_timeout: 12e4,
      // 120 seconds
      query_timeout: 12e4,
      // 120 seconds
      application_name: "saleen-app",
      idle_in_transaction_session_timeout: 6e4
      // 60 seconds
    }) : null;
    console.log("DEBUG: Pool initialized:", !!pool);
    if (pool) {
      pool.on("connect", () => {
        console.log("DEBUG: A new client has connected to the database pool.");
        isDatabaseConnected = true;
      });
      pool.on("error", (err) => {
        console.error("Unexpected error on idle client", err);
      });
      const closePool = async () => {
        console.log("DEBUG: Closing database pool...");
        try {
          await pool.end();
          console.log("DEBUG: Database pool closed.");
        } catch (err) {
          console.error("Error closing database pool:", err);
        }
      };
      process.on("SIGTERM", closePool);
      process.on("SIGINT", closePool);
    }
    MOCK_DB_PATH = import_path.default.join(process.cwd(), "mock-db.json");
    mockStore = {
      users: [],
      services: [],
      categories: [],
      visits: []
    };
    try {
      if (import_fs.default.existsSync(MOCK_DB_PATH)) {
        const data = import_fs.default.readFileSync(MOCK_DB_PATH, "utf-8");
        const parsed = JSON.parse(data);
        mockStore = {
          users: parsed.users || [],
          services: parsed.services || [],
          categories: parsed.categories || [],
          visits: parsed.visits || []
        };
      }
    } catch (e) {
      console.error("Failed to load mock DB:", e);
    }
    saveMockDb = () => {
      try {
        import_fs.default.writeFileSync(MOCK_DB_PATH, JSON.stringify(mockStore, null, 2));
      } catch (e) {
        console.error("Failed to save mock DB:", e);
      }
    };
    query = async (text, params, retries = 3) => {
      if (!databaseUrl || !pool || !isDatabaseConnected) {
        return queryInMockMode(text, params);
      }
      let lastError;
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const startTime = Date.now();
          const result = await pool.query(text, params);
          const duration = Date.now() - startTime;
          if (duration > 2e3) {
            console.warn(`Slow query detected (${duration}ms):`, text.substring(0, 100));
          }
          isDatabaseConnected = true;
          return result;
        } catch (err) {
          lastError = err;
          const isConnectionError = err.message.toLowerCase().includes("terminated") || err.message.toLowerCase().includes("timeout") || err.message.toLowerCase().includes("connection") || err.message.toLowerCase().includes("pool") || err.message.toLowerCase().includes("econnrefused") || err.message.toLowerCase().includes("econnreset");
          if (isConnectionError) {
            console.error(`Database query attempt ${attempt}/${retries} failed:`, err.message);
            if (err.code) console.error(`Error Code: ${err.code}`);
            if (attempt < retries) {
              const delay = Math.pow(2, attempt) * 3e3;
              console.log(`Retrying query in ${delay / 1e3} seconds...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            }
            isDatabaseConnected = false;
            console.error("CRITICAL: Database connection lost after multiple attempts. Falling back to MOCK MODE.");
          } else {
            throw err;
          }
        }
      }
      console.warn("Falling back to MOCK MODE due to database connection failure.");
      return queryInMockMode(text, params);
    };
    queryInMockMode = (text, params) => {
      console.log("MOCK QUERY EXECUTION:", text);
      const lowerText = text.toLowerCase();
      if (lowerText.includes("select 1")) return { rows: [{ 1: 1 }] };
      if (lowerText.includes("select count(*)")) {
        if (lowerText.includes("from users")) return { rows: [{ count: mockStore.users.length }] };
        if (lowerText.includes("from services")) return { rows: [{ count: mockStore.services.length }] };
        if (lowerText.includes("from categories")) return { rows: [{ count: mockStore.categories.length }] };
        if (lowerText.includes("from visits")) return { rows: [{ count: mockStore.visits.length }] };
        return { rows: [{ count: 0 }] };
      }
      if (lowerText.includes("insert into visits")) {
        const newVisit = {
          id: mockStore.visits.length + 1,
          visitor_id: params?.[0],
          user_agent: params?.[1],
          ip_address: params?.[2],
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        mockStore.visits.push(newVisit);
        saveMockDb();
        return { rows: [newVisit] };
      }
      if (lowerText.includes("from visits")) {
        return { rows: mockStore.visits };
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
          provider_name: params?.[0] || "",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        mockStore.services.push(newService);
        saveMockDb();
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
          return { rows: [mockStore.services[index]] };
        }
        return { rows: [] };
      }
      if (lowerText.includes("delete from services")) {
        const id = parseInt(params?.[0]);
        mockStore.services = mockStore.services.filter((s) => s.id !== id);
        saveMockDb();
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
    db_default = pool;
  }
});

// server.ts
var import_express8 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_dotenv4 = __toESM(require("dotenv"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");
init_db();

// src/routes/authRoutes.ts
var import_express = require("express");

// src/controllers/authController.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
init_db();
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
init_db();
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
var incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      "UPDATE services SET views = views + 1 WHERE id = $1 RETURNING views",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json({ views: result.rows[0].views });
  } catch (error) {
    console.error("Error incrementing views:", error);
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
router2.patch("/:id/view", incrementViews);
router2.put("/:id", authenticateToken, isAdmin, updateService);
router2.delete("/:id", authenticateToken, isAdmin, deleteService);
var serviceRoutes_default = router2;

// src/routes/orderRoutes.ts
var import_express3 = require("express");

// src/controllers/orderController.ts
init_db();
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
init_db();
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
init_db();
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
init_db();
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
    const visitorCount = await query("SELECT COUNT(*) FROM visits");
    res.json({
      users: parseInt(userCount.rows[0].count),
      services: parseInt(serviceCount.rows[0].count),
      orders: parseInt(orderCount.rows[0].count),
      activeOrders: parseInt(activeOrders.rows[0].count),
      visitors: parseInt(visitorCount.rows[0].count)
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

// src/routes/visitRoutes.ts
var import_express7 = __toESM(require("express"), 1);
init_db();
var router7 = import_express7.default.Router();
router7.post("/", async (req, res) => {
  const { visitor_id } = req.body;
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;
  try {
    await query(
      "INSERT INTO visits (visitor_id, user_agent, ip_address) VALUES ($1, $2, $3)",
      [visitor_id, userAgent, ipAddress]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error recording visit:", err);
    res.status(500).json({ error: "Failed to record visit" });
  }
});
router7.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM visits ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching visits:", err);
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});
router7.delete("/clear", async (req, res) => {
  try {
    await query("DELETE FROM visits");
    res.json({ success: true });
  } catch (err) {
    console.error("Error clearing visits:", err);
    res.status(500).json({ error: "Failed to clear visits" });
  }
});
var visitRoutes_default = router7;

// server.ts
import_dotenv4.default.config();
async function startServer() {
  const app = (0, import_express8.default)();
  const PORT = parseInt(process.env.PORT || "3000", 10);
  app.use((0, import_cors.default)());
  app.use(import_express8.default.json({ limit: "50mb" }));
  app.use(import_express8.default.urlencoded({ limit: "50mb", extended: true }));
  app.use("/api/auth", authRoutes_default);
  app.use("/api/services", serviceRoutes_default);
  app.use("/api/orders", orderRoutes_default);
  app.use("/api/reviews", reviewRoutes_default);
  app.use("/api/categories", categoryRoutes_default);
  app.use("/api/users", userRoutes_default);
  app.use("/api/visits", visitRoutes_default);
  app.get("/api/health", async (req, res) => {
    const { isDatabaseConnected: isDatabaseConnected2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const isMock = !process.env.DATABASE_URL || !isDatabaseConnected2;
    try {
      if (!isMock) {
        await query("SELECT 1");
      }
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
        isMock: true
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
    app.use(import_express8.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
