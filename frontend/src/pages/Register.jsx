import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/catalogue');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-mark">Bookstore</div>
        <form onSubmit={handleSubmit}>
          <h2 style={{ animationDelay: '0.05s' }}>Create account</h2>
          {error && <p className="error">{error}</p>}
          <input
            style={{ animationDelay: '0.12s' }}
            placeholder="Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required
          />
          <input
            style={{ animationDelay: '0.19s' }}
            type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required
          />
          <input
            style={{ animationDelay: '0.26s' }}
            type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}
          />
          <button style={{ animationDelay: '0.33s' }} type="submit">Register</button>
          <p style={{ animationDelay: '0.4s' }}>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}
