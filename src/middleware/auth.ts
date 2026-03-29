import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('authenticateToken called for:', req.url, 'token:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: number; role: string };
    console.log('Token verified, user:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ error: 'Invalid token.' });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: number; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    // Ignore invalid tokens for optional auth
    next();
  }
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  console.log('isAdmin called, user role:', req.user?.role);
  if (req.user?.role !== 'admin') {
    console.log('Access denied. Admin only.');
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};
