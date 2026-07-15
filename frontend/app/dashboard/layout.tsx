// app/dashboard/layout.tsx
'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Bookmark,
  Package,
  User,
  PlusCircle,
  List,
  Settings,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  image?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { href: '/dashboard/orders', label: 'Orders', icon: Package },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  if (user?.role === 'seller' || user?.role === 'admin') {
    navLinks.push(
      { href: '/items/add', label: 'Add Property', icon: PlusCircle },
      { href: '/items/manage', label: 'My Listings', icon: List }
    );
  }
  if (user?.role === 'admin') {
    navLinks.push({ href: '/admin/dashboard', label: 'Admin Panel', icon: Settings });
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ✅ Sidebar - fixed height, no scroll, full screen */}
      <aside className="hidden md:flex w-64 flex-col h-screen border-r bg-background/50">
        {/* User profile - fixed top */}
        <div className="flex items-center gap-3 border-b p-4 flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=f97316&color=fff`} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        {/* ✅ Navigation - takes remaining space, no scroll */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          {navLinks.map((link) => {
            const isActive =
              link.href === pathname ||
              (link.href !== '/dashboard' && pathname?.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                    ? 'bg-orange-500/10 text-orange-500 font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                <link.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ✅ Logout button - fixed bottom */}
        <div className="border-2 p-4 flex-shrink-0 mt-auto ">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg  px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content - scrollable if needed */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}