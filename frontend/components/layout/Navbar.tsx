'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Moon, Sun, Menu, X, User, PlusCircle, LayoutDashboard,
  LogOut, Bookmark, Settings, Home, Compass, Phone
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/lib/axios';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const fetchUser = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0;';
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const avatarUrl = useMemo(() => {
    if (user?.image) return user.image;
    if (user?.name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff&bold=true`;
    }
    return null;
  }, [user]);

  const isLoggedIn = !!user;

  // Main nav links (About removed)
  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  // Role‑based extra links for logged‑in users (used in both desktop & mobile)
  const protectedLinks = useMemo(() => {
    if (!isLoggedIn) return [];
    const links = [];

    // Buyer gets Bookmarks and Dashboard in the nav bar
    if (user?.role === 'buyer') {
      links.push({ href: '/bookmarks', label: 'Bookmarks', icon: Bookmark });
      links.push({ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard });
    }

    // Seller / Admin get property management links
    if (user?.role === 'seller' || user?.role === 'admin') {
      links.push({ href: '/items/add', label: 'Add Property', icon: PlusCircle });
      links.push({ href: '/items/manage', label: 'My Listings', icon: LayoutDashboard });
    }

    // Admin only
    if (user?.role === 'admin') {
      links.push({ href: '/admin/dashboard', label: 'Admin Panel', icon: Settings });
    }

    return links;
  }, [isLoggedIn, user]);

  // Build the combined list for desktop nav (no duplicates)
  const desktopNavLinks = useMemo(() => {
    const all = [...navLinks];
    if (isLoggedIn) {
      // Avoid adding duplicate Dashboard/Bookmarks if already present
      const existingHrefs = new Set(all.map(link => link.href));
      for (const link of protectedLinks) {
        if (!existingHrefs.has(link.href)) {
          all.push(link);
          existingHrefs.add(link.href);
        }
      }
    }
    return all;
  }, [navLinks, isLoggedIn, protectedLinks]);

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-[80%] px-4 h-16 flex items-center">
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-[80%] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
              BariBazar
            </span>
          </Link>

          {/* Desktop nav (no duplicates) */}
          <nav className="hidden md:flex items-center space-x-6">
            {desktopNavLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-orange-500 ${
                    isActive ? 'text-orange-500 font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isLoggedIn && (user?.role === 'seller' || user?.role === 'admin') && (
              <Link href="/items/add" className="hidden sm:inline-block">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm">
                  <PlusCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Add Property
                </Button>
              </Link>
            )}

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
            )}

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none ring-offset-background rounded-full focus-visible:ring-2 focus-visible:ring-orange-500">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-transparent transition-all hover:ring-orange-500">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={user?.name || 'User'} />}
                    <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-xs sm:text-sm">
                      {user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate w-[150px]">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer p-0">
                      <Link
                        href={
                          user?.role === 'admin'
                            ? '/admin/dashboard'
                            : user?.role === 'seller'
                            ? '/seller/dashboard'
                            : '/dashboard'
                        }
                        className={`flex w-full items-center px-2 py-1.5 text-sm ${
                          pathname.startsWith('/dashboard') ||
                          pathname.startsWith('/admin/dashboard') ||
                          pathname.startsWith('/seller/dashboard')
                            ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/30'
                            : ''
                        }`}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer p-0">
                      <Link
                        href="/profile"
                        className={`flex w-full items-center px-2 py-1.5 text-sm ${
                          pathname === '/profile' ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/30' : ''
                        }`}
                      >
                        <User className="mr-2 h-4 w-4" /> My Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    {user?.role === 'buyer' && (
                      <DropdownMenuItem className="cursor-pointer p-0">
                        <Link href="/bookmarks" className="flex w-full items-center px-2 py-1.5 text-sm">
                          <Bookmark className="mr-2 h-4 w-4" /> Bookmarks
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {(user?.role === 'seller' || user?.role === 'admin') && (
                      <>
                        <DropdownMenuItem className="cursor-pointer p-0">
                          <Link href="/items/manage" className="flex w-full items-center px-2 py-1.5 text-sm">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> My Listings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer p-0">
                          <Link href="/items/add" className="flex w-full items-center px-2 py-1.5 text-sm">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Property
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {user?.role === 'admin' && (
                      <DropdownMenuItem className="cursor-pointer p-0">
                        <Link href="/admin/dashboard" className="flex w-full items-center px-2 py-1.5 text-sm">
                          <Settings className="mr-2 h-4 w-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden h-8 w-8 sm:h-9 sm:w-9"
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu (no duplicates) */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="mx-auto w-full max-w-[80%] px-4 py-3 space-y-2">
            {desktopNavLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 py-2 text-sm font-medium ${
                    isActive ? 'text-orange-500 font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}

            {isLoggedIn && (
              <>
                {/* Add additional mobile-only items if needed, but avoid duplicates */}
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-orange-500"
                >
                  <User className="h-4 w-4" /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left py-2 text-sm font-medium text-red-600"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            )}

            {!isLoggedIn && (
              <div className="border-t pt-2 space-y-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full justify-start bg-orange-500 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}