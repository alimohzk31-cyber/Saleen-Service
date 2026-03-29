import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDB } from './src/db/init';
import { query } from './src/db';

import authRoutes from './src/routes/authRoutes';
import serviceRoutes from './src/routes/serviceRoutes';
import orderRoutes from './src/routes/orderRoutes';
import reviewRoutes from './src/routes/reviewRoutes';
import categoryRoutes from './src/routes/categoryRoutes';
import userRoutes from './src/routes/userRoutes';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Initialize DB
  console.log('Initializing DB...');
  initDB().then(() => {
    console.log('DB initialization finished.');
  }).catch(err => {
    console.error('DB initialization failed:', err);
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/users', userRoutes);

  app.get('/api/health', async (req, res) => {
    const isMock = !process.env.DATABASE_URL;
    try {
      await query('SELECT 1');
      res.json({ 
        status: 'ok', 
        database: isMock ? 'mock' : 'connected',
        isMock 
      });
    } catch (err) {
      res.status(500).json({ 
        status: 'error', 
        database: isMock ? 'mock' : 'disconnected', 
        message: err instanceof Error ? err.message : 'Unknown error',
        isMock
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
