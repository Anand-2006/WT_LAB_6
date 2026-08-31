const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const pool = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', async (req, res) => {
  const [cartItems] = await pool.query(
    `SELECT c.quantity, b.id AS book_id, b.price
     FROM cart c JOIN books b ON c.book_id = b.id WHERE c.user_id = ?`,
    [req.user.id]
  );

  if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amountInPaise = Math.round(total * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: `receipt_${req.user.id}_${Date.now()}`
  });

  const [orderResult] = await pool.query(
    'INSERT INTO orders (user_id, total_amount, status, razorpay_order_id) VALUES (?, ?, ?, ?)',
    [req.user.id, total, 'pending', razorpayOrder.id]
  );

  for (const item of cartItems) {
    await pool.query(
      'INSERT INTO order_items (order_id, book_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
      [orderResult.insertId, item.book_id, item.quantity, item.price]
    );
  }

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    dbOrderId: orderResult.insertId,
    keyId: process.env.RAZORPAY_KEY_ID
  });
});

router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['failed', dbOrderId]);
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  await pool.query(
    'UPDATE orders SET status = ?, razorpay_payment_id = ? WHERE id = ?',
    ['paid', razorpay_payment_id, dbOrderId]
  );
  await pool.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

  res.json({ message: 'Payment verified, order confirmed' });
});

module.exports = router;
