import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/catalogue');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-mark">Bookstore</div>
        <form onSubmit={handleSubmit}>
          <h2 style={{ animationDelay: '0.05s' }}>Welcome back</h2>
          {error && <p className="error">{error}</p>}
          <input
            style={{ animationDelay: '0.12s' }}
            type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required
          />
          <input
            style={{ animationDelay: '0.19s' }}
            type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required
          />
          <button style={{ animationDelay: '0.26s' }} type="submit">Login</button>
          <p style={{ animationDelay: '0.32s' }}>No account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </div>
  );
}
