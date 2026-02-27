/* components/Footer.tsx */
export default function Footer() {
  return (
    <footer className="bg-gray-100 w-full">
  <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between">
    {/* 좌측 정보 */}
    <div>
      <h3 className="font-semibold text-blue-900 mb-1">THE KEVIN'S TAX LAB</h3>
      <p className="text-sm text-gray-700">세무 기장 및 세금 신고</p>
      <p className="text-sm text-gray-700">대표자: 권도윤</p>
      <p className="text-sm text-gray-700">사업자등록번호: 111-14-63812</p>
      <p className="text-sm text-gray-700">전화: 02-409-0601</p>
      <p className="text-sm text-gray-700">이메일: akathekevin@thekevinstaxlab.com</p>
    </div>

    {/* 우측 정보 */}
    <div className="mt-6 md:mt-0 text-sm text-right text-gray-600">
      <p>© 2025 THE KEVIN'S TAX LAB</p>
      <p>
        Website by <a href="#" className="underline">LaonCode</a>
      </p>
      <p>폰트: KCC은영체 © projectnoonnu</p>
    </div>
  </div>
</footer>
  );
}