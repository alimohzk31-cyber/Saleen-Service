import { Request, Response } from 'express';
import { query } from '../db';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { service_id } = req.body;
    const user_id = req.user?.id;

    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const newOrder = await query(
      'INSERT INTO orders (user_id, service_id) VALUES ($1, $2) RETURNING *',
      [user_id, service_id]
    );

    res.status(201).json(newOrder.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

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
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
