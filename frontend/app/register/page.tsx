'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, Image as ImageIcon, AlertCircle, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sellerWarning, setSellerWarning] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    
    if (role === 'seller') {
      setSellerWarning(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
        metadata: { role: 'buyer' },
      });

      if (error) {
        setError(error.message || 'Registration failed. Please try again.');
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
            Create Account
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Start your journey with BariBazar</p>
        </div>

        
        {sellerWarning && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Seller registration is coming soon!</strong> Please register as a Buyer for now.
            </span>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 bg-background/50 border-white/10 focus:border-orange-500"
                required
              />
            </div>
          </div>

          
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

          {/* Profile Image (optional) */}
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Profile Image URL <span className="text-muted-foreground">(optional)</span>
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="pl-9 bg-background/50 border-white/10 focus:border-orange-500"
              />
            </div>
          </div>

          
          <div className="space-y-2">
            <label className="text-sm font-medium">I want to register as</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRole('buyer');
                  setSellerWarning(false);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${
                  role === 'buyer'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                    : 'border-white/10 hover:border-orange-500/50'
                }`}
              >
                <Users className="h-4 w-4" /> Buyer
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('seller');
                  setSellerWarning(true);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${
                  role === 'seller'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                    : 'border-white/10 hover:border-amber-500/50'
                }`}
              >
                <Briefcase className="h-4 w-4" /> Seller
              </button>
            </div>
            {role === 'seller' && (
              <p className="text-xs text-amber-500 mt-1">⚠️ Seller registration is coming soon!</p>
            )}
          </div>

          {/* Password */}
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
                minLength={6}
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9 bg-background/50 border-white/10 focus:border-orange-500"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25"
            disabled={loading || role === 'seller'}
          >
            {loading ? 'Creating account...' : role === 'seller' ? 'Coming Soon' : 'Create Account'}
          </Button>

          {role === 'seller' && (
            <p className="text-center text-xs text-amber-500">
              🔒 Seller registration is not available yet. Please select <strong>Buyer</strong> to continue.
            </p>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-500 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}