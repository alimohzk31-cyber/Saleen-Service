import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password, role } = req.body;

    // Check if user exists
    const userExists = await query('SELECT * FROM users WHERE phone = $1 OR email = $2', [phone, email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User with this phone or email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await query(
      'INSERT INTO users (name, phone, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, phone, email, role',
      [name, phone, email, hashedPassword, role || 'user']
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, phone, password } = req.body;

    // Find user by email or phone
    let userResult;
    if (email) {
      userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    } else if (phone) {
      userResult = await query('SELECT * FROM users WHERE phone = $1', [phone]);
    } else {
      return res.status(400).json({ error: 'Email or phone is required.' });
    }

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const user = userResult.rows[0];

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Your account has been blocked.' });
    }

    // Check password
    if (!user.password) {
      return res.status(400).json({ error: 'Please use the correct login method for this account.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Generate token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.warn('WARNING: JWT_SECRET is not set. Using an insecure fallback secret for development.');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, status: user.status, is_verified: user.is_verified }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginPhone = async (req: Request, res: Response) => {
  try {
    const { phone, name, otp } = req.body;

    // In a real app, verify OTP here. For now, we mock it.
    if (otp !== '123456' && otp !== '654321') {
      // return res.status(400).json({ error: 'Invalid OTP.' });
    }

    // Find or create user
    let userResult = await query('SELECT * FROM users WHERE phone = $1', [phone]);
    let user;

    if (userResult.rows.length === 0) {
      // Create new user
      const newUser = await query(
        'INSERT INTO users (name, phone, is_verified) VALUES ($1, $2, $3) RETURNING *',
        [name || 'User', phone, true]
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
      if (user.status === 'blocked') {
        return res.status(403).json({ error: 'Your account has been blocked.' });
      }
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.warn('WARNING: JWT_SECRET is not set. Using an insecure fallback secret for development.');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, status: user.status, is_verified: user.is_verified }
    });
  } catch (error) {
    console.error('Error phone login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginGoogle = async (req: Request, res: Response) => {
  try {
    const { token: googleToken } = req.body;

    // In a real app, verify Google token here. Mocking for now.
    const mockGoogleUser = {
      id: 'google-123',
      email: 'user@gmail.com',
      name: 'Google User'
    };

    let userResult = await query('SELECT * FROM users WHERE google_id = $1 OR email = $2', [mockGoogleUser.id, mockGoogleUser.email]);
    let user;

    if (userResult.rows.length === 0) {
      const newUser = await query(
        'INSERT INTO users (name, email, google_id, is_verified) VALUES ($1, $2, $3, $4) RETURNING *',
        [mockGoogleUser.name, mockGoogleUser.email, mockGoogleUser.id, true]
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
      if (user.status === 'blocked') {
        return res.status(403).json({ error: 'Your account has been blocked.' });
      }
      // Update google_id if not set
      if (!user.google_id) {
        await query('UPDATE users SET google_id = $1, is_verified = TRUE WHERE id = $2', [mockGoogleUser.id, user.id]);
      }
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.warn('WARNING: JWT_SECRET is not set. Using an insecure fallback secret for development.');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, status: user.status, is_verified: user.is_verified }
    });
  } catch (error) {
    console.error('Error google login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const adminCode = process.env.ADMIN_CODE || '199444';

    if (code !== adminCode) {
      return res.status(400).json({ error: 'Invalid admin code.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(
      { id: 0, role: 'admin' },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin logged in successfully',
      token,
      user: { id: 0, name: 'Admin', role: 'admin' }
    });
  } catch (error) {
    console.error('Error admin login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const userResult = await query('SELECT id, name, phone, email, role FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: userResult.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
