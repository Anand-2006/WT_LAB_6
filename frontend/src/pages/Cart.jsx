import { useEffect, useState } from 'react';
import api from '../api';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');

  const loadCart = () => api.get('/cart').then((res) => setItems(res.data));

  useEffect(() => { loadCart(); }, []);

  const removeItem = async (bookId) => {
    await api.delete(`/cart/${bookId}`);
    loadCart();
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async () => {
    const { data } = await api.post('/payment/create-order');

    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: 'Bookstore',
      description: 'Book purchase',
      order_id: data.razorpayOrderId,
      handler: async (response) => {
        await api.post('/payment/verify', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          dbOrderId: data.dbOrderId
        });
        setStatus('Payment successful! Order confirmed.');
        setItems([]);
      },
      theme: { color: '#1a1a2e' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="container">
      <h1>Your Cart</h1>
      {status && <p style={{ color: 'green', fontWeight: 600 }}>{status}</p>}
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.book_id} className="cart-item">
              <div>
                <strong>{item.title}</strong>
                <p>Qty: {item.quantity} × ₹{item.price}</p>
              </div>
              <button onClick={() => removeItem(item.book_id)}>Remove</button>
            </div>
          ))}
          <div className="cart-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button style={{ marginTop: '1.5rem' }} onClick={checkout}>Pay with Razorpay</button>
        </>
      )}
    </div>
  );
}
