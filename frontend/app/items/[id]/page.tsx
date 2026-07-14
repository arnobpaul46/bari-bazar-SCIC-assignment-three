'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Home, ArrowLeft, Star, User, Phone, Mail, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/items/ItemCard';
import { toast } from 'sonner';
import api from '@/lib/axios';

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
  status: string;
  sellerId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
}

// Skeleton Loader
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
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);

  // ইউজার চেক
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];
        if (token) {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          setIsLoggedIn(true);
          setIsBuyer(res.data.user?.role === 'buyer');
        }
      } catch {
        setIsLoggedIn(false);
        setIsBuyer(false);
      }
    };
    checkUser();
  }, []);

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
        if (err.response?.status === 404) {
          setError('Property not found');
        } else {
          setError('Failed to load property details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleContactSeller = () => {
    toast.success('📩 Seller will contact you shortly!', {
      description: 'Check your email and phone for updates.',
      duration: 4000,
    });
  };

  const handleBookmark = () => {
    if (!isLoggedIn) {
      toast.error('Please login to bookmark properties', {
        description: 'You need to be logged in as a buyer.',
      });
      return;
    }
    toast.success('❤️ Added to bookmarks!', {
      description: 'You can view all bookmarks in your dashboard.',
      duration: 3000,
    });
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast.error('Please login to purchase', {
        description: 'You need to be logged in as a buyer.',
      });
      return;
    }
    toast.info('💳 Payment gateway coming soon!', {
      description: 'We are working on integrating secure payments.',
      duration: 4000,
    });
  };

  if (loading) return <DetailsSkeleton />;

  if (error || !item) {
    return (
      <div className="max-w-[80%] mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Oops! Property not found</h2>
        <p className="text-muted-foreground mb-6">{error || 'The property you are looking for does not exist.'}</p>
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
        {/* Left Column: Image & Details */}
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
            <span className="absolute top-4 left-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white capitalize">
              {item.category === 'sale' ? 'For Sale' : item.category === 'rent' ? 'For Rent' : item.category}
            </span>
          </div>

          {/* Title & Price */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{item.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-orange-500">
                ${item.price.toLocaleString()}
              </span>
              <p className="text-xs text-muted-foreground">Fixed Price</p>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-muted-foreground text-sm border-l-4 border-orange-500 pl-4">
            {item.shortDesc}
          </p>

          {/* Full Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {item.fullDesc}
            </p>
          </div>

          {/* Specifications */}
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

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <div className="rounded-2xl border bg-background/50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Seller Information
            </h3>
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

          {/* Action Buttons */}
          <div className="rounded-2xl border bg-background/50 p-6 space-y-3">
            {/* Contact Seller - সবাই দেখতে পাবে */}
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleContactSeller}
            >
              <Phone className="mr-2 h-4 w-4" /> Contact Seller
            </Button>

            {/* ✅ শুধু Buyer দেখতে পাবে */}
            {isBuyer && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800/30 dark:text-orange-400 dark:hover:bg-orange-950/30"
                  onClick={handleBookmark}
                >
                  <Heart className="mr-2 h-4 w-4" /> Bookmark
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleBuyNow}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Buy Now
                </Button>
              </div>
            )}

            {/* Buyer না হলে মেসেজ */}
            {!isBuyer && isLoggedIn && user?.role !== 'buyer' && (
              <p className="text-center text-xs text-muted-foreground">
                🔒 Only buyers can bookmark or purchase properties.
              </p>
            )}
            {!isLoggedIn && (
              <p className="text-center text-xs text-muted-foreground">
                <Link href="/login" className="text-orange-500 hover:underline">Login</Link> as a buyer to bookmark or buy.
              </p>
            )}
          </div>

          {/* Listed Date */}
          <div className="rounded-2xl border bg-background/50 p-4 text-center text-xs text-muted-foreground">
            Listed on {new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Related Properties */}
      {relatedItems.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Similar Properties</h2>
            <Link href="/explore" className="text-sm text-orange-500 hover:underline">
              View All
            </Link>
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