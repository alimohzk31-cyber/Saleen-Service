import { Request, Response } from 'express';
import { query } from '../db';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { service_id, rating, comment } = req.body;
    const user_id = req.user?.id;

    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    // Check if user has ordered the service
    const orderExists = await query(
      'SELECT * FROM orders WHERE user_id = $1 AND service_id = $2 AND status = $3',
      [user_id, service_id, 'completed']
    );

    if (orderExists.rows.length === 0) {
      return res.status(403).json({ error: 'You can only review services you have completed orders for.' });
    }

    const newReview = await query(
      'INSERT INTO reviews (user_id, service_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, service_id, rating, comment]
    );

    res.status(201).json(newReview.rows[0]);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getServiceReviews = async (req: Request, res: Response) => {
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
    console.error('Error fetching service reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
