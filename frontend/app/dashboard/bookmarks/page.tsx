'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/items/ItemCard';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get('/bookmarks');
        setBookmarks(res.data.bookmarks || []);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        toast.error('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const removeBookmark = async (itemId: string) => {
    try {
      await api.delete(`/bookmarks/${itemId}`);
      setBookmarks(bookmarks.filter((b: any) => b._id !== itemId));
      toast.success('Removed from bookmarks');
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-background/50 overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-medium">No bookmarks yet</p>
          <p className="text-sm text-muted-foreground">Start exploring and save your favorite properties.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {bookmarks.map((item: any) => (
            <div key={item._id} className="relative">
              <ItemCard item={item} />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 rounded-full p-0 opacity-80 hover:opacity-100"
                onClick={() => removeBookmark(item._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}