import React, { useState } from 'react';
import { signup } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await signup({ name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container">
      <h2>Explorer Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" required value={name} onChange={e => setName(e.target.value)} />
        <label>Email</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
