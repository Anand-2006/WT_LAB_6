import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get('/books').then((res) => setBooks(res.data.slice(0, 4)));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <h1>Books worth staying up for.</h1>
          <p>A small, carefully stocked catalogue — search, browse by category, and check out in a minute.</p>
          <div className="hero-rule" />
        </div>
      </section>

      <div className="container">
        <h2 className="section-label">Featured this week</h2>
        <div className="grid">
          {books.map((book, i) => (
            <Link
              key={book.id}
              to="/catalogue"
              className="card"
              style={{ textDecoration: 'none', color: 'inherit', animationDelay: `${i * 0.08}s` }}
            >
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
    </>
  );
}
