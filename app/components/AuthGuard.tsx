'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, login } = useAuth();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(password);
    if (success) {
      setPassword('');
    } else {
      setError('Invalid password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-zinc-950 rounded-2xl p-8 max-w-md w-full border-2 border-red-900/30 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gradient">Admin Access</h1>
          <p className="text-zinc-400">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
              placeholder="Enter admin password..."
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-600/50 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:from-zinc-700 disabled:to-zinc-600 py-3 rounded-xl font-semibold transition-all disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Access Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
