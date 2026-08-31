import { useEffect, useState } from 'react';
import api from '../api';

export default function Catalogue() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/books/meta/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    api.get('/books', { params: { search, category } }).then((res) => setBooks(res.data));
  }, [search, category]);

  const addToCart = async (bookId) => {
    if (!localStorage.getItem('token')) {
      setMessage('Please login first');
      return;
    }
    await api.post('/cart/add', { book_id: bookId, quantity: 1 });
    setMessage('Added to cart');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="container">
      <h1>Catalogue</h1>
      {message && <p style={{ color: '#1a1a2e', fontWeight: 600, margin: '0.5rem 0' }}>{message}</p>}
      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
        <input placeholder="Search title or author" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1 }} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '0.7rem', borderRadius: '6px' }}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid">
        {books.map((book) => (
          <div key={book.id} className="card">
            <img src={book.image_url} alt={book.title} />
            <div className="card-body">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <span className="price">₹{book.price}</span>
              <div style={{ marginTop: '0.7rem' }}>
                <button onClick={() => addToCart(book.id)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
