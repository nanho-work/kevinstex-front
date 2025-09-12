export default function ExplanationSection() {
  return (
    <section className="py-16 max-w-5xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">경정청구란 무엇인가요?</h2>
      <p className="text-gray-700 mb-6">
        국세청에 이미 낸 세금을 정정 신고하여 환급받을 수 있습니다.
      </p>
      {/* 인포그래픽 / 아이콘 자리 */}
      <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
        인포그래픽 영역
      </div>
    </section>
  )
}