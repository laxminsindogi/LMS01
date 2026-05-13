import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { Role } from '../types';

interface AuthPageProps {
  onLogin: (user: any, token: string) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Student' as Role,
    department: '',
    age: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { 
          username: formData.username, 
          email: formData.email, 
          password: formData.password, 
          role: formData.role,
          demographics: {
            department: formData.department,
            age: parseInt(formData.age)
          } 
        };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      if (isLogin) {
        onLogin(data.user, data.token);
      } else {
        setIsLogin(true);
        setError('Account created! Please login.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-f1-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-f1-red/5 skew-x-[-15deg] translate-x-24" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-f1-blue/5 skew-x-[-15deg] -translate-x-24" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-f1-gray border-t-8 border-f1-red shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-8 relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <span className="font-display font-black text-3xl tracking-tighter uppercase">
              <span className="text-f1-red">Kle</span><span className="text-white ml-1">LIB</span>
            </span>
            <div className="ml-4 h-8 w-1.5 bg-f1-red rotate-12"></div>
          </div>
        </div>

        <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2 text-center">
          {isLogin ? 'ESTABLISH LINK' : 'NEW PERSONNEL REGISTRY'}
        </h2>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-8">
          {isLogin ? 'Access the knowledge grid' : 'Join the academic network'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-f1-red/10 border border-f1-red/50 text-f1-red text-xs font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  required
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-f1-dark border border-white/10 p-4 pl-12 text-white focus:outline-hidden focus:border-f1-red transition-all"
                  placeholder="Enter username"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-f1-dark border border-white/10 p-4 pl-12 text-white focus:outline-hidden focus:border-f1-red transition-all"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-f1-dark border border-white/10 p-4 pl-12 text-white focus:outline-hidden focus:border-f1-red transition-all"
                placeholder="Enter password"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as Role})}
                    className="w-full bg-f1-dark border border-white/10 p-4 text-white focus:outline-hidden focus:border-f1-red transition-all"
                  >
                    <option value="Student">Student</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                    className="w-full bg-f1-dark border border-white/10 p-4 text-white focus:outline-hidden focus:border-f1-red transition-all"
                    placeholder="21"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Department / Course</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className="w-full bg-f1-dark border border-white/10 p-4 text-white focus:outline-hidden focus:border-f1-red transition-all"
                  placeholder="e.g. Computer Engineering"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-f1-red py-5 mt-4 font-black uppercase italic tracking-[0.2em] text-sm hover:bg-white hover:text-f1-red transition-all flex items-center justify-center gap-3 f1-slant"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {isLogin ? 'Initiate Link' : 'Register Member'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-f1-red transition-colors"
          >
            {isLogin ? "Don't have an account? Create Registry" : "Already registered? Establish Link"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
