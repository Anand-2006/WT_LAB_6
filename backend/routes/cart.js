const express = require('express');
const pool = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.quantity, b.id AS book_id, b.title, b.price, b.image_url
     FROM cart c JOIN books b ON c.book_id = b.id
     WHERE c.user_id = ?`,
    [req.user.id]
  );
  res.json(rows);
});

router.post('/add', async (req, res) => {
  const { book_id, quantity = 1 } = req.body;
  await pool.query(
    `INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
    [req.user.id, book_id, quantity, quantity]
  );
  res.status(201).json({ message: 'Added to cart' });
});

router.delete('/:bookId', async (req, res) => {
  await pool.query('DELETE FROM cart WHERE user_id = ? AND book_id = ?', [req.user.id, req.params.bookId]);
  res.json({ message: 'Removed from cart' });
});

module.exports = router;
