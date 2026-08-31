import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Bookstore</Link>
      <div>
        <Link to="/catalogue">Catalogue</Link>
        <Link to="/cart">Cart</Link>
        {isLoggedIn ? (
          <a href="#" onClick={logout}>Logout</a>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
