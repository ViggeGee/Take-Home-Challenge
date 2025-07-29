const express = require('express');
const { faker } = require('@faker-js/faker');
const pool = require('../config/database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/responses/brand/:brandId - get all responses for a brand
router.get('/brand/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;

    // Check if brand belongs to user
    const brandCheck = await pool.query(
      'SELECT * FROM brands WHERE id = $1 AND user_id = $2',
      [brandId, req.user.userId]
    );

    if (brandCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Get responses with ratings
    const result = await pool.query(`
      SELECT 
        r.*,
        rt.rating,
        rt.id as rating_id
      FROM responses r
      LEFT JOIN ratings rt ON r.id = rt.response_id
      WHERE r.brand_id = $1
      ORDER BY r.created_at DESC
    `, [brandId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/responses/generate/:brandId - generate fake AI response
router.post('/generate/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;

    // Check if brand belongs to user
    const brandCheck = await pool.query(
      'SELECT * FROM brands WHERE id = $1 AND user_id = $2',
      [brandId, req.user.userId]
    );

    if (brandCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Generate fake AI response using faker
    const fakeResponse = generateFakeAIResponse();

    // Save to database
    const result = await pool.query(
      'INSERT INTO responses (brand_id, response_text) VALUES ($1, $2) RETURNING *',
      [brandId, fakeResponse]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Generate response error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/responses/:responseId/rate - rate a response (👍/👎)
router.post('/:responseId/rate', async (req, res) => {
  try {
    const { responseId } = req.params;
    const { rating } = req.body; // true for 👍, false for 👎

    if (typeof rating !== 'boolean') {
      return res.status(400).json({ message: 'Rating must be true or false' });
    }

    // Check if response belongs to user's brand
    const responseCheck = await pool.query(`
      SELECT r.* FROM responses r
      JOIN brands b ON r.brand_id = b.id
      WHERE r.id = $1 AND b.user_id = $2
    `, [responseId, req.user.userId]);

    if (responseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Check if rating already exists
    const existingRating = await pool.query(
      'SELECT * FROM ratings WHERE response_id = $1',
      [responseId]
    );

    let result;
    if (existingRating.rows.length > 0) {
      // Update existing rating
      result = await pool.query(
        'UPDATE ratings SET rating = $1 WHERE response_id = $2 RETURNING *',
        [rating, responseId]
      );
    } else {
      // Create new rating
      result = await pool.query(
        'INSERT INTO ratings (response_id, rating) VALUES ($1, $2) RETURNING *',
        [responseId, rating]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Rate response error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Function to generate fake AI responses
function generateFakeAIResponse() {
  const responses = [
    `${faker.company.name()} is known for ${faker.commerce.productAdjective()} ${faker.commerce.product()}s and ${faker.company.buzzPhrase()}.`,
    `Based on recent data, ${faker.company.name()} has been focusing on ${faker.commerce.department()} with ${faker.company.buzzPhrase()}.`,
    `${faker.company.name()}'s reputation centers around ${faker.commerce.productAdjective()} quality and ${faker.company.buzzPhrase()}.`,
    `Industry experts describe ${faker.company.name()} as ${faker.company.buzzPhrase()} with strong ${faker.commerce.department()} presence.`,
    `${faker.company.name()} stands out for ${faker.commerce.productAdjective()} ${faker.commerce.product()}s and commitment to ${faker.company.buzzPhrase()}.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = router;