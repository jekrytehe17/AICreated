import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from './lib/firebase';
import { motion } from 'motion/react';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      const code = err.code || '';
      console.error('Auth error code:', code);
      
      if (code === 'auth/user-not-found' || 
          code === 'auth/wrong-password' || 
          code === 'auth/invalid-credential' || 
          code === 'auth/invalid-email') {
        setError('Email or password is incorrect');
      } else if (code === 'auth/email-already-in-use') {
        setError('User already exists. Please sign in');
      } else if (code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617]">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="text-cyan-400">AI</span>Created
          </h1>
          <p className="text-slate-400">
            {isLogin ? 'Welcome back, please sign in' : 'Create your account to get started'}
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 p-4 rounded-2xl"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-slate-950 font-bold py-3 rounded-2xl hover:bg-slate-100 transition-colors active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-white/5 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {isLogin ? (
                <span>Don't have an account? <span className="font-bold underline decoration-cyan-400/30">Sign up</span></span>
              ) : (
                <span>Already have an account? <span className="font-bold underline decoration-cyan-400/30">Sign in</span></span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
