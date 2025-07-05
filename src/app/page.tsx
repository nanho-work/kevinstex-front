// src/app/page.tsx
import './globals.css';

import Hero from '@/components/main/Hero'
import ReviewSliderSection from '@/components/main/ReviewSliderSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-8">
      <Hero/>
      <ReviewSliderSection />
    </main>
  )
}