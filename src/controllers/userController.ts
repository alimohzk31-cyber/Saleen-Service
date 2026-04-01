import { Request, Response } from 'express';
import { query } from '../db';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name, phone, email, role, status, is_verified, created_at FROM users ORDER BY created_at DESC');
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    await query('UPDATE users SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleUserVerification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    await query('UPDATE users SET is_verified = $1 WHERE id = $2', [is_verified, id]);
    res.json({ message: 'User verification toggled successfully' });
  } catch (error) {
    console.error('Error toggling user verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const userCount = await query('SELECT COUNT(*) FROM users');
    const serviceCount = await query('SELECT COUNT(*) FROM services');
    const orderCount = await query('SELECT COUNT(*) FROM orders');
    const activeOrders = await query('SELECT COUNT(*) FROM orders WHERE status = \'pending\'');
    const visitorCount = await query('SELECT COUNT(*) FROM visits');

    res.json({
      users: parseInt(userCount.rows[0].count),
      services: parseInt(serviceCount.rows[0].count),
      orders: parseInt(orderCount.rows[0].count),
      activeOrders: parseInt(activeOrders.rows[0].count),
      visitors: parseInt(visitorCount.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
