import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const LoginPage = ({ onSuccess }: { onSuccess: () => void }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister
        ? { username, email, password }
        : { email, password };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await axios.post(`${apiUrl}${endpoint}`, payload);

      if (isRegister) {
        setIsRegister(false);
        setError('');
      } else {
        login(res.data.token, res.data.user);
        onSuccess();
      }
    } catch (err) {
      setError((err as any).response?.data?.error || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '8px' }}>
          {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} style={{ marginTop: '10px', width: '100%' }}>
        {isRegister ? 'Back to Login' : 'Create Account'}
      </button>
    </div>
  );
};