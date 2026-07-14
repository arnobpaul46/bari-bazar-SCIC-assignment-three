'use client';

import { useState, useEffect } from 'react';
import { User, Mail, ShieldCheck } from 'lucide-react';
import api from '@/lib/axios';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="text-muted-foreground">Loading profile...</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <User className="h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      <div className="max-w-md rounded-2xl border bg-background/50 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center text-2xl font-bold text-orange-500">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
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