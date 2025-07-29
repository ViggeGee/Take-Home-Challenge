const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/brands - get all brands for logged-in user
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM brands WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/brands - create new brand
router.post('/', async (req, res) => {
  try {
    const { name, prompt } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const result = await pool.query(
      'INSERT INTO brands (user_id, name, prompt) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, name, prompt || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/brands/:id - update brand
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, prompt } = req.body;

    // Check if brand belongs to user
    const brandCheck = await pool.query(
      'SELECT * FROM brands WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (brandCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const result = await pool.query(
      'UPDATE brands SET name = $1, prompt = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, prompt, id, req.user.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update brand error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/brands/:id - delete brand
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if brand belongs to user
    const brandCheck = await pool.query(
      'SELECT * FROM brands WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (brandCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    await pool.query(
      'DELETE FROM brands WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;