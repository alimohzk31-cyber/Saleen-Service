import express from 'express';
import { query } from '../db';

const router = express.Router();

// Record a visit
router.post('/', async (req, res) => {
  const { visitor_id } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;

  try {
    await query(
      'INSERT INTO visits (visitor_id, user_agent, ip_address) VALUES ($1, $2, $3)',
      [visitor_id, userAgent, ipAddress]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error recording visit:', err);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// Get all visits
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM visits ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching visits:', err);
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

// Clear all visits (Admin only - in a real app this would need auth middleware)
router.delete('/clear', async (req, res) => {
  try {
    await query('DELETE FROM visits');
    res.json({ success: true });
  } catch (err) {
    console.error('Error clearing visits:', err);
    res.status(500).json({ error: 'Failed to clear visits' });
  }
});

export default router;
