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
      <section className="w-full py-16 sm:py-10 border-b border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewSliderSection />
        </div>
      </section>

      {/* FAQ + News */}
      <section className="w-full bg-gray-50 py-16 sm:py-10 border-b border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <FAQ />
            </div>
            <div>
              <NewsSection />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}