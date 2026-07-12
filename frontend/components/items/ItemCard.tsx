'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

// টাইপ ডিফাইন
interface ItemCardProps {
  item: {
    _id: string;
    title: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    imageUrl: string;
    rating: number;
    category: string;
  };
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="group rounded-2xl border bg-background/50 overflow-hidden shadow-sm transition-all hover:shadow-lg hover:border-orange-500/50">
      
      <div className="relative aspect-[4/2] md:aspect-[4/3] overflow-hidden">
        <Image
          src={item.imageUrl || 'https://picsum.photos/seed/property/400/300'}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <span className="absolute top-3 left-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
          {item.category === 'sale' ? 'For Sale' : item.category === 'rent' ? 'For Rent' : item.category}
        </span>
      </div>


      <div className="p-4 space-y-3">
        
        <div>
          <h3 className="font-semibold text-base sm:text-lg line-clamp-1">{item.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
        </div>

        
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-lg font-bold text-orange-500">
            ${item.price.toLocaleString()}
          </span>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" /> {item.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {item.bathrooms}
            </span>
          </div>
        </div>

       
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
            <span className="text-sm font-medium">{item.rating || 'New'}</span>
          </div>
          <Link href={`/items/${item._id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs hover:bg-orange-500 hover:text-white transition-colors"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}