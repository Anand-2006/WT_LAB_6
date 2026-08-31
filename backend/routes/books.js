const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM books WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category_id = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND (title LIKE ? OR author LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const [rows] = await pool.query(query, params);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Book not found' });
  res.json(rows[0]);
});

router.get('/meta/categories', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories');
  res.json(rows);
});

module.exports = router;
