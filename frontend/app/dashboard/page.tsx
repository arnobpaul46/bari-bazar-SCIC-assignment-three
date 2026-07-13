'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, PlusCircle, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto max-w-[80%] px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
      <p className="text-muted-foreground mb-8">Role: {user.role}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/">
          <div className="rounded-xl border p-6 text-center hover:shadow-lg transition-all hover:border-orange-500/50">
            <Home className="h-10 w-10 mx-auto text-orange-500 mb-3" />
            <h3 className="font-semibold">Browse Properties</h3>
            <p className="text-sm text-muted-foreground">Find your dream home</p>
          </div>
        </Link>

        {user.role === 'seller' || user.role === 'admin' ? (
          <>
            <Link href="/items/add">
              <div className="rounded-xl border p-6 text-center hover:shadow-lg transition-all hover:border-orange-500/50">
                <PlusCircle className="h-10 w-10 mx-auto text-orange-500 mb-3" />
                <h3 className="font-semibold">Add Property</h3>
                <p className="text-sm text-muted-foreground">List a new property</p>
              </div>
            </Link>
            <Link href="/items/manage">
              <div className="rounded-xl border p-6 text-center hover:shadow-lg transition-all hover:border-orange-500/50">
                <List className="h-10 w-10 mx-auto text-orange-500 mb-3" />
                <h3 className="font-semibold">My Listings</h3>
                <p className="text-sm text-muted-foreground">Manage your properties</p>
              </div>
            </Link>
          </>
        ) : (
          <div className="rounded-xl border p-6 text-center">
            <List className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold">Saved Properties</h3>
            <p className="text-sm text-muted-foreground">Your favorites list</p>
          </div>
        )}
      </div>
    </div>
  );
}