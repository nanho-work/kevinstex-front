import Hero from '@/components/correction/Hero'
import ProblemSection from '@/components/correction/ProblemSection'
import ExplanationSection from '@/components/correction/ExplanationSection'
import ProcessSection from '@/components/correction/ProcessSection'
import BenefitsSection from '@/components/correction/BenefitsSection'
import SocialProofSection from '@/components/correction/SocialProofSection'
import TrustSection from '@/components/correction/TrustSection'
import CTASection from '@/components/correction/CTASection'
import FAQSection from '@/components/correction/FAQSection'

export default function CorrectionPage() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <ExplanationSection />
      <ProcessSection />
      <BenefitsSection />
      {/* <SocialProofSection /> */}
      {/* <TrustSection /> */}
      <CTASection />
      <FAQSection />
    </main>
  )
}