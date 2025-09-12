export default function ProcessSection() {
  const steps = ["신청", "검토", "제출", "환급"]

  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-10">진행 절차</h2>
      <div className="flex justify-center space-x-8">
        {steps.map((step, idx) => (
          <div key={idx} className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
              {idx + 1}
            </div>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </section>
  )
}