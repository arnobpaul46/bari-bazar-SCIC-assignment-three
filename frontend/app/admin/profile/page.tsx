'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, ShieldCheck } from 'lucide-react';
import api from '@/lib/axios';

export default function AdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.user?.role !== 'admin') {
          router.push('/');
          return;
        }
        setUser(res.data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>
      <div className="max-w-md rounded-2xl border bg-background/50 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center text-2xl font-bold text-orange-500">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className="inline-block mt-1 rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-xs dark:bg-purple-900/30 dark:text-purple-400">
              Admin
            </span>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
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