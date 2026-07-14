'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    document.cookie = 'token=; path=/; max-age=0;';
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { href: '/dashboard/orders', label: 'Orders', icon: Package },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  // Seller/Admin extra links
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
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Brand / User */}
          <div className="flex items-center gap-3 border-b p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff`} />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-500 font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}