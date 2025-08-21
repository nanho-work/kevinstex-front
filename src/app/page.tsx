// src/app/page.tsx
import './globals.css';

import Hero from '@/components/main/Hero'
import ReviewSliderSection from '@/components/main/ReviewSliderSection'
import FAQ from '@/components/FAQ/FAQ';


export default function Home() {
  return (
    <main className="bg-white text-gray-900 flex flex-col items-center justify-center">
      <Hero />
      
      <ReviewSliderSection />
      <div className="w-full max-w-7xl px-4">
        <FAQ />
      </div>
    </main>
  )
}