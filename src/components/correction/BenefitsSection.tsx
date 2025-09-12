export default function BenefitsSection() {
  const benefits = [
    "환급금 돌려받기",
    "절차 단순화 (원스톱 처리)",
    "전문가 검토로 리스크 최소화"
  ]

  return (
    <section className="py-16 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-10">경정청구의 장점</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="p-6 border rounded-lg text-center">
            <p>{benefit}</p>
          </div>
        ))}
      </div>
    </section>
  )
}