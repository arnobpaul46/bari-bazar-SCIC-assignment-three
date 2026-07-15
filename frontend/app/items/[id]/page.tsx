'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Home, ArrowLeft, Star, User, Phone, Mail, Heart, ShoppingBag, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/items/ItemCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/lib/axios';

// Helper to decode JWT and get role
function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

// Types
interface Item {
  _id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  location: string;
  category: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  status: 'active' | 'sold' | 'canceled';
  sellerId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
}

const DetailsSkeleton = () => (
  <div className="max-w-[80%] mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="aspect-video bg-muted rounded-2xl animate-pulse" />
        <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
        <div className="h-24 w-full bg-muted rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-40 w-full bg-muted rounded-2xl animate-pulse" />
        <div className="h-20 w-full bg-muted rounded-2xl animate-pulse" />
      </div>
    </div>
  </div>
);

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<Item | null>(null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Auth & status states
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ✅ Use token to determine logged in and role (no /auth/me dependency)
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      setIsLoggedIn(true);
      const role = getRoleFromToken(token);
      const isBuyerRole = role === 'buyer';
      setIsBuyer(isBuyerRole);

      // Fetch bookmark & order status only if buyer and id exists
      if (isBuyerRole && id) {
        Promise.all([
          api.get(`/bookmarks/check/${id}`).catch(() => ({ data: { bookmarked: false } })),
          api.get(`/orders/check/${id}`).catch(() => ({ data: { ordered: false } }))
        ])
        .then(([bookmarkRes, orderRes]) => {
          setIsBookmarked(bookmarkRes.data.bookmarked);
          setIsOrdered(orderRes.data.ordered);
        })
        .catch(() => {
          setIsBookmarked(false);
          setIsOrdered(false);
        });
      } else {
        setIsBookmarked(false);
        setIsOrdered(false);
      }

      // Optional: also fetch user details for display (name/email) but not required for role
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => {});
    } else {
      setIsLoggedIn(false);
      setIsBuyer(false);
      setIsBookmarked(false);
      setIsOrdered(false);
    }
  }, [id]);

  // Fetch item details
  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/items/${id}`);
        if (res.data.success) {
          setItem(res.data.item);
          setRelatedItems(res.data.relatedItems || []);
        } else {
          setError('Property not found');
        }
      } catch (err: any) {
        console.error('Error fetching item:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleContactSeller = () => {
    toast.success('📩 Seller will contact you shortly!');
  };

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (!isBuyer) {
      toast.error('Only buyers can bookmark properties.');
      return;
    }
    try {
      setActionLoading(true);
      if (isBookmarked) {
        await api.delete(`/bookmarks/${id}`);
        setIsBookmarked(false);
        toast.success('Removed from bookmarks');
      } else {
        await api.post('/bookmarks', { itemId: id });
        setIsBookmarked(true);
        toast.success('Added to bookmarks');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Bookmark action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (!isBuyer) {
      toast.error('Only buyers can purchase properties.');
      return;
    }
    if (item?.status === 'sold') {
      toast.error('This property has been sold already.');
      return;
    }
    if (isOrdered) {
      toast.error('You already have an order for this property.');
      return;
    }
    setShowOrderModal(true);
  };

  const confirmOrder = async () => {
    try {
      setActionLoading(true);
      const res = await api.post('/orders', { itemId: id });
      if (res.status === 201) {
        setIsOrdered(true);
        setShowOrderModal(false);
        toast.success('🎉 Order placed successfully!', {
          action: {
            label: 'View Orders',
            onClick: () => router.push('/dashboard/orders'),
          },
        });
        setItem(prev => prev ? { ...prev, status: 'sold' } : null);
        router.push('/dashboard/orders');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DetailsSkeleton />;
  if (error || !item) {
    return (
      <div className="max-w-[80%] mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Oops! Property not found</h2>
        <p className="text-muted-foreground mb-6">{error || 'The property does not exist.'}</p>
        <Link href="/explore">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[80%] mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/explore" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={item.imageUrl || 'https://picsum.photos/seed/property/800/400'}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
            {item.status === 'sold' ? (
              <span className="absolute top-4 left-4 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">Sold</span>
            ) : (
              <span className="absolute top-4 left-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white capitalize">
                {item.category === 'sale' ? 'For Sale' : item.category === 'rent' ? 'For Rent' : item.category}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{item.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-3xl font-bold ${item.status === 'sold' ? 'text-muted-foreground line-through' : 'text-orange-500'}`}>
                ${item.price.toLocaleString()}
              </span>
              {item.status === 'sold' && <p className="text-xs text-red-500">Sold</p>}
            </div>
          </div>

          <p className="text-muted-foreground text-sm border-l-4 border-orange-500 pl-4">{item.shortDesc}</p>
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{item.fullDesc}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border bg-background/50 p-4 text-center">
              <Home className="h-5 w-5 mx-auto text-orange-500 mb-1" />
              <p className="text-sm font-medium capitalize">{item.category}</p>
              <p className="text-xs text-muted-foreground">Category</p>
            </div>
            <div className="rounded-xl border bg-background/50 p-4 text-center">
              <Bed className="h-5 w-5 mx-auto text-orange-500 mb-1" />
              <p className="text-sm font-medium">{item.bedrooms}</p>
              <p className="text-xs text-muted-foreground">Bedrooms</p>
            </div>
            <div className="rounded-xl border bg-background/50 p-4 text-center">
              <Bath className="h-5 w-5 mx-auto text-orange-500 mb-1" />
              <p className="text-sm font-medium">{item.bathrooms}</p>
              <p className="text-xs text-muted-foreground">Bathrooms</p>
            </div>
            <div className="rounded-xl border bg-background/50 p-4 text-center">
              <Star className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
              <p className="text-sm font-medium">{item.rating || 'New'}</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Seller Info */}
          <div className="rounded-2xl border bg-background/50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Seller Information</h3>
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-orange-100">
                {item.sellerId?.image ? (
                  <Image src={item.sellerId.image} alt={item.sellerId.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-orange-500">
                    {item.sellerId?.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{item.sellerId?.name || 'Unknown Seller'}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {item.sellerId?.email || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Always visible */}
          <div className="rounded-2xl border bg-background/50 p-6 space-y-3">
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleContactSeller}
            >
              <Phone className="mr-2 h-4 w-4" /> Contact Seller
            </Button>

            <div className="flex gap-3">
              <Button
                variant={isBookmarked ? 'default' : 'outline'}
                className={`flex-1 ${isBookmarked ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800/30 dark:text-orange-400'}`}
                onClick={handleBookmark}
                disabled={actionLoading || item.status === 'sold' || !isLoggedIn || !isBuyer}
              >
                <Heart className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-white' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button
                className={`flex-1 ${item.status === 'sold' || isOrdered || !isLoggedIn || !isBuyer ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                onClick={handleBuyNow}
                disabled={actionLoading || item.status === 'sold' || isOrdered || !isLoggedIn || !isBuyer}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {item.status === 'sold' ? 'Sold' : isOrdered ? 'Ordered' : 'Buy Now'}
              </Button>
            </div>

            {!isLoggedIn && (
              <p className="text-center text-xs text-muted-foreground">
                <Link href="/login" className="text-orange-500 hover:underline">Login</Link> to bookmark or buy.
              </p>
            )}
            {isLoggedIn && !isBuyer && (
              <p className="text-center text-xs text-muted-foreground">
                🔒 Only buyers can bookmark or purchase.
              </p>
            )}
            {isLoggedIn && isBuyer && item.status === 'sold' && (
              <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" /> This property has been sold.
              </p>
            )}
            {isLoggedIn && isBuyer && isOrdered && item.status !== 'sold' && (
              <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-orange-500" /> You already ordered this.
              </p>
            )}
          </div>

          <div className="rounded-2xl border bg-background/50 p-4 text-center text-xs text-muted-foreground">
            Listed on {new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              You are about to purchase <strong>{item.title}</strong> for <strong>${item.price.toLocaleString()}</strong>.
              <br />
              <span className="text-xs text-muted-foreground">You can cancel within 24 hours.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowOrderModal(false)}>Cancel</Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={confirmOrder}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Related Properties */}
      {relatedItems.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Similar Properties</h2>
            <Link href="/explore" className="text-sm text-orange-500 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {relatedItems.map((relatedItem) => (
              <ItemCard key={relatedItem._id} item={relatedItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}