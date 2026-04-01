import { Request, Response } from 'express';
import { query } from '../db';
import { AuthRequest } from '../middleware/auth';

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      title, description, price, category_id, subcategory_id, 
      image_url, video_url, phone, lat, lng, service_type, experience, 
      certificates, bio 
    } = req.body;
    const user_id = req.user?.id || null; // Allow null for guest users

    const newService = await query(
      `INSERT INTO services (
        title, description, price, image_url, video_url, category_id, subcategory_id, 
        user_id, phone, lat, lng, service_type, experience, 
        certificates, bio
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [
        title, description, price, image_url, video_url, category_id, subcategory_id, 
        user_id, phone, lat, lng, service_type, experience, 
        JSON.stringify(certificates || []), bio
      ]
    );

    res.status(201).json(newService.rows[0]);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const incrementViews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'UPDATE services SET views = views + 1 WHERE id = $1 RETURNING views',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ views: result.rows[0].views });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const getServices = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 100, search = '', category_id, subcategory_id, sort = 'newest' } = req.query;

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
    const queryParams: any[] = [];
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

    if (subcategory_id && subcategory_id !== 'all') {
      queryText += ` AND s.subcategory_id = $${paramIndex}`;
      queryParams.push(subcategory_id);
      paramIndex++;
    }

    queryText += ` GROUP BY s.id, u.name, c.name_en, c.name_ar`;

    if (sort === 'highest_rated') {
      queryText += ` ORDER BY average_rating DESC`;
    } else {
      queryText += ` ORDER BY s.created_at DESC`;
    }

    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const services = await query(queryText, queryParams);

    // Get total count for pagination
    let countQueryText = `SELECT COUNT(*) FROM services s WHERE 1=1`;
    const countParams: any[] = [];
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

    if (subcategory_id && subcategory_id !== 'all') {
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
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM services WHERE id = $1', [id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, description, price, category_id, subcategory_id, 
      image_url, video_url, phone, lat, lng, service_type, experience, 
      certificates, bio 
    } = req.body;

    const updatedService = await query(
      `UPDATE services SET 
        title = $1, description = $2, price = $3, image_url = $4, video_url = $5, 
        category_id = $6, subcategory_id = $7, phone = $8, lat = $9, lng = $10, 
        service_type = $11, experience = $12, certificates = $13, bio = $14
      WHERE id = $15 RETURNING *`,
      [
        title, description, price, image_url, video_url, category_id, subcategory_id, 
        phone, lat, lng, service_type, experience, 
        JSON.stringify(certificates || []), bio, id
      ]
    );

    if (updatedService.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(updatedService.rows[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
