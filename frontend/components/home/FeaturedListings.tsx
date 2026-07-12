'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ItemCard } from '@/components/items/ItemCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// ডামি ডেটা (পরে API থেকে আসবে)
const dummyItems = [
  {
    _id: '1',
    title: 'Sunset Villa',
    location: 'Gulshan, Dhaka',
    price: 350000,
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&auto=format&fit=crop&q=60',
    rating: 4.8,
    category: 'sale',
  },
  {
    _id: '2',
    title: 'Ocean View Apartment',
    location: 'Banani, Dhaka',
    price: 280000,
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop&q=60',
    rating: 4.5,
    category: 'sale',
  },
  {
    _id: '3',
    title: 'Lake Side Villa',
    location: 'Uttara, Dhaka',
    price: 420000,
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&auto=format&fit=crop&q=60',
    rating: 4.9,
    category: 'sale',
  },
  {
    _id: '4',
    title: 'Modern Penthouse',
    location: 'Dhanmondi, Dhaka',
    price: 550000,
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=60',
    rating: 4.7,
    category: 'sale',
  },
];

export function FeaturedListings() {
  const [items, setItems] = useState(dummyItems);
  const [loading, setLoading] = useState(false);

  
  const SkeletonCard = () => (
    <div className="rounded-2xl border bg-background/50 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-5 bg-muted rounded w-1/3" />
        <div className="flex justify-between pt-2 border-t">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-8 bg-muted rounded w-1/3" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 md:py-20 border-t">
      <div className="mx-auto w-full max-w-[92%] sm:max-w-[88%] md:max-w-[80%] px-4 sm:px-6 lg:px-8">

        <div className="flex flex-row   justify-between mb-8 md:mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
            >
              Featured <span className="text-orange-500">Properties</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-sm w-5/6 md:w-fit sm:text-base text-muted-foreground mt-1"
            >
              Discover our handpicked selection of premium properties.
            </motion.p>
          </div>
          <Link href="/explore">
            <Button variant="ghost" className="mt-2 sm:mt-0 text-orange-500 hover:text-orange-600">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}