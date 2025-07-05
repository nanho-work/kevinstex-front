'use client';

import LocationMap from '@/components/LocationMap/LocationMap';

export default function CustomerLocationPage() {
  return (
    <main className="px-4 py-16 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">오시는 길</h1>
      <LocationMap />
    </main>
  );
}