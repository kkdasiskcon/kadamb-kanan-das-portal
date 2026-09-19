import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, X } from 'lucide-react';

export default function AdminLogin({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    // Default master admin password for instant access (can be updated in Supabase)
    if (password === 'admin123' || password === 'kadamb2026') {
      onLoginSuccess();
      onClose();
    } else {
      setError('Invalid master password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-12 h-12 rounded-full gradient-saffron text-white mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Kadamb Kanan Das CMS</h3>
          <p className="text-xs text-slate-500">Enter master password to access the website management dashboard.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Master Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="Enter admin password (default: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full gradient-saffron text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" /> Login to Admin Panel
          </button>
        </form>

        <div className="mt-4 text-center text-[11px] text-slate-400">
          Default Master Password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-saffron-600 font-bold">admin123</code>
        </div>
      </div>
    </div>
  );
}
