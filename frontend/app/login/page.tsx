'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoUsers = {
    user: { email: 'user@baribazar.com', password: 'userBaribazar' },
    admin: { email: 'admin@baribazar.com', password: 'adminBaribazar' },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('📤 1. Starting login...');
      console.log('📤 2. Email:', email);
      console.log('📤 3. Password:', password);

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 4. Response status:', response.status);

      const data = await response.json();
      console.log('📥 5. Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('✅ 6. Token received:', data.token);
      
      document.cookie = `token=${data.token}; path=/; max-age=604800`;
      console.log('🍪 7. Cookie set:', document.cookie);
      
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error('❌ Error:', err.message);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (type: 'user' | 'admin') => {
    const creds = demoUsers[type];
    setEmail(creds.email);
    setPassword(creds.password);
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] right-[-10%] h-72 w-72 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] h-72 w-72 rounded-full bg-amber-500/30 blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-background/60 backdrop-blur-lg shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to your BariBazar account</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-background/50 border-white/10 focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10 bg-background/50 border-white/10 focus:border-orange-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/60 px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 border-orange-200/50 text-orange-600 hover:bg-orange-50 dark:border-orange-800/30 dark:text-orange-400 dark:hover:bg-orange-950/30 backdrop-blur-sm"
            onClick={() => handleDemoLogin('user')}
          >
            <User className="mr-2 h-4 w-4" /> Login as User
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-purple-200/50 text-purple-600 hover:bg-purple-50 dark:border-purple-800/30 dark:text-purple-400 dark:hover:bg-purple-950/30 backdrop-blur-sm"
            onClick={() => handleDemoLogin('admin')}
          >
            <ShieldCheck className="mr-2 h-4 w-4" /> Login as Admin
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground/60 mt-2">
          Demo credentials will auto-fill. Click again to sign in.
        </p>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-orange-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}