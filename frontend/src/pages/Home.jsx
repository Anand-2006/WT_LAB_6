import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get('/books').then((res) => setBooks(res.data.slice(0, 4)));
  }, []);

  return (
    <div className="container">
      <h1>Welcome to the Bookstore</h1>
      <p style={{ margin: '1rem 0', color: '#555' }}>Browse our featured picks below.</p>
      <div className="grid">
        {books.map((book) => (
          <Link key={book.id} to={`/catalogue`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={book.image_url} alt={book.title} />
            <div className="card-body">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <span className="price">₹{book.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
