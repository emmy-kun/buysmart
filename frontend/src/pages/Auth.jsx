import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error('Name is required');
        await signup(name, email, password);
      }
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="bg-[#132f4c] w-full max-w-sm p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <img
            src="/images/logo.png"
            alt="BuySmart"
            className="h-20 mx-auto object-contain"
          />
        </div>

        <h2 className="text-white text-xl font-bold text-center mb-6">
          {isLogin ? 'Log In' : 'Create Account'}
        </h2>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-[#9ecbff] outline-none focus:border-[#4DA3FF]"
              required={!isLogin}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-[#9ecbff] outline-none focus:border-[#4DA3FF]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-[#9ecbff] outline-none focus:border-[#4DA3FF]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#1e73ff] text-white font-semibold rounded-lg hover:bg-[#1557c2] transition-colors disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p
          className="text-center mt-5 text-[#9ecbff] text-sm cursor-pointer hover:underline"
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
        >
          {isLogin ? 'Create an account' : 'Already have an account?'}
        </p>
      </div>
    </div>
  );
}
