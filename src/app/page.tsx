// src/app/page.tsx
import './globals.css';

import Hero from '@/components/main/Hero'
import ReviewSliderSection from '@/components/main/ReviewSliderSection'
import FAQ from '@/components/FAQ/FAQ';
import NewsSection from '@/components/news/NewsSection';


export default function Home() {
  return (
    <main className="bg-white text-gray-900 flex flex-col items-center justify-center">
      <div className="w-full mb-10">
        <Hero />
      </div>
      
      <div className="w-full max-w-8xl px-4 mb-10">
        <FAQ />
      </div>
      <div className="w-full max-w-8xl px-4 mb-10 border-b border-gray-100">
        <ReviewSliderSection />
      </div>
      <div className="w-full max-w-8xl px-4 mb-2">
        < NewsSection />
      </div>
      
      
    </main >
  )
}