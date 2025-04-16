import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { setUser } from '../../redux/slices/userSlice.js';
import { clearCart } from '../../redux/slices/cartSlice.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('❌ Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('❌ Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const token = data.token;
      localStorage.setItem('token', token);
      const decodedUser = jwt_decode(token);
      dispatch(setUser(decodedUser));
      dispatch(clearCart(decodedUser._id));
      navigate('/Main_page');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md relative">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome Back 👋</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Forgot your password?{' '}
              <Link to="/forgot-password" className="text-blue-500 hover:underline">
                Reset it
              </Link>
            </p>
          </div>
        </form>

        <button
          onClick={handleSubmit}
          disabled={loading || password.trim() === ''}
          className={`mt-6 w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
            password.trim() === ''
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } ${loading ? 'cursor-wait' : ''}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
