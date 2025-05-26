import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct import
import { setUser } from '../../redux/slices/userSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../Login/etap.png'; // Adjust the path as necessary
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        switch (user.role) {
          case 'administrator':
            navigate('/Admin_Main');
            break;
          case 'manager':
            navigate('/Orders');
            break;
          case 'employee':
            navigate('/Main_page');
            break;
          case 'storekeeper':
            navigate('/Manage_order');
            break;
          default:
            navigate('/Not_allowed');
        }
      }, 100);
    }
  }, [user, navigate]);

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
      const decodedUser = jwtDecode(token); // ✅ Correct usage

      dispatch(setUser({ user: decodedUser, token }));
      dispatch(clearCart(decodedUser._id));
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md transition-all duration-300">
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Company Logo"
            className="h-16 w-auto"
          />
        </div>
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-600">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-800 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}

          <div className="text-sm text-center text-gray-500">
            Forgot password?{' '}
            <Link to="/forgot-password" className="text-blue-600 font-medium hover:underline">
              Reset here
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || password.trim() === ''}
            className={`w-full py-3 font-semibold text-white rounded-xl transition-all duration-300 ${
              password.trim() === ''
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } ${loading ? 'cursor-wait' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
