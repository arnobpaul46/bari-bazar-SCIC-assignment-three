'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background/50 p-6 shadow-lg">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
        </Link>

        {/* Profile Info */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-orange-500/10 flex items-center justify-center text-4xl font-bold text-orange-500">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1 className="text-2xl font-bold mt-3">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className="inline-block mt-2 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-500 capitalize">
            {user.role}
          </span>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-3 border-t pt-4">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}