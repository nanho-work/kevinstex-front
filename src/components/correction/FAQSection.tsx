export default function FAQSection() {
  return (
    <section className="py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">자주 묻는 질문</h2>
      <ul className="space-y-4">
        <li>
          <strong>환급 기간은 얼마나 걸리나요?</strong>
          <p className="text-gray-700">보통 1~3개월 소요됩니다.</p>
        </li>
        <li>
          <strong>필요한 서류는 무엇인가요?</strong>
          <p className="text-gray-700">종합소득세 신고서, 부가세 신고서 등이 필요합니다.</p>
        </li>
        <li>
          <strong>수수료는 어떻게 되나요?</strong>
          <p className="text-gray-700">환급액 기준으로 협의 후 진행됩니다.</p>
        </li>
      </ul>
    </section>
  )
}