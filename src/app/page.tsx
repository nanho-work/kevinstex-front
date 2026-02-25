// src/app/page.tsx
import Hero from '@/components/main/Hero'
import ReviewSliderSection from '@/components/main/ReviewSliderSection'
import FAQ from '@/components/FAQ/FAQ'
import NewsSection from '@/components/news/NewsSection'

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="w-full">
        <Hero />
      </section>

      {/* Reviews */}
      <section className="w-full py-16 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewSliderSection />
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-gray-50 py-16 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQ />
        </div>
      </section>

      {/* News */}
      <section className="w-full bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsSection />
        </div>
      </section>
    </main>
  )
}