import { Suspense } from 'react';
import { ExploreContent } from '@/components/ExploreContent';

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="flex h-60 items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>}>
      <ExploreContent />
    </Suspense>
  );
}