'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ItemCard } from '@/components/items/ItemCard';
import api from '@/lib/axios';

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

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL থেকে ইনিশিয়াল মান নেওয়া
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('newest');

  const limit = 8;

  const fetchItems = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = { page, limit, sort };
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await api.get('/items', { params });
      setItems(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ফিল্টার বা সর্ট পরিবর্তন হলে ডেটা রিফ্রেশ ও URL আপডেট
  useEffect(() => {
    // URL আপডেট (ব্রাউজার হিস্টোরি রেখে)
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    const queryString = params.toString();
    const newUrl = queryString ? `/explore?${queryString}` : '/explore';
    // শুধু যদি URL পরিবর্তিত হয় তাহলে push করি (অনন্ত লুপ এড়াতে)
    if (window.location.pathname + window.location.search !== newUrl) {
      router.push(newUrl, { scroll: false });
    }

    fetchItems(1);
  }, [search, category, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // useEffect ইতিমধ্যে fetch করবে
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setSort('newest');
    // useEffect নিজেই fetch করবে
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchItems(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto max-w-[80%] px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Find Your Dream Property</h1>
        <p className="text-muted-foreground mt-1">Search, filter, and explore verified listings</p>
      </div>

      {/* প্রপার্টি কাউন্ট */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? 'property' : 'properties'} found
        </p>
      </div>

      {/* ফিল্টার বার */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="bg-background/60 backdrop-blur-sm border rounded-2xl shadow-sm p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* সার্চ */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11 bg-background/60 border-muted/40 focus-visible:ring-orange-500/30"
              />
            </div>

            {/* ক্যাটাগরি + সর্ট */}
            <div className="flex flex-row gap-3 md:flex-initial">
              <div className="flex-1 md:min-w-[130px] md:flex-none">
                <Select value={category} onValueChange={(value) => setCategory(value || '')}>
                  <SelectTrigger className="h-11 bg-background/60 border-muted/40 text-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                    <SelectItem value="furnished">Furnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 md:min-w-[130px] md:flex-none">
                <Select value={sort} onValueChange={(value) => setSort(value || 'newest')}>
                  <SelectTrigger className="h-11 bg-background/60 border-muted/40 text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* বাটন */}
            <div className="flex flex-row gap-2 md:flex-none">
              <Button type="submit" className="flex-1 md:flex-none h-11 bg-orange-500 hover:bg-orange-600 text-white px-5">
                <Search className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Apply</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" className="flex-1 md:flex-none h-11 w-11" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: limit }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((item: any) => <ItemCard key={item._id} item={item} />)}
      </div>

      {!loading && items.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-medium">No properties found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search filters.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm font-medium px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}