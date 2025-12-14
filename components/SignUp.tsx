import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowLeft, Loader2, Package } from 'lucide-react';
import { User } from '../types';

interface SignUpProps {
  onSignUp: (user: User) => void;
  onNavigate: (view: 'HOME' | 'SIGN_IN') => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSignUp, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSignUp({
        id: '1',
        name: name,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Right Side - Image/Brand (Swapped for variety) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center order-2">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 text-center px-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 mb-8">
            <Package size={32} className="text-white" />
            <span className="text-3xl font-bold text-white tracking-tight">Lumina</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Join the Future</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Create an account to unlock exclusive deals, early access to new tech, and your own personalized shopping history.
          </p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 order-1">
        <div className="w-full max-w-md">
          <button 
            onClick={() => onNavigate('HOME')}
            className="group flex items-center text-slate-500 hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </button>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h1>
            <p className="text-slate-500">
              Already have an account?{' '}
              <button 
                onClick={() => onNavigate('SIGN_IN')}
                className="text-accent font-semibold hover:text-blue-600 transition-colors"
              >
                Log in
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white h-12 rounded-xl font-semibold hover:bg-slate-800 focus:ring-4 focus:ring-primary/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>

            <p className="text-xs text-center text-slate-400 mt-4">
              By clicking "Sign Up", you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
