/* components/Footer.tsx */
export default function Footer() {
  return (
    <footer className="bg-gray-100 text-sm text-gray-600 mt-12 border-t">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 로고 및 기본정보 */}
        <div>
          <div className="text-lg font-bold text-blue-900 mb-2">THE KEVIN'S TAX LAB</div>
          <p>THE KEVIN's TAX LAB | 세무 기장 및 세금 신고</p>
          <p>대표자: 권도윤</p>
          <p>사업자등록번호: 111-14-63812</p>
        </div>

        {/* 서비스 안내 */}
        <div>
          <h4 className="font-semibold mb-2">서비스</h4>
          <ul className="space-y-1">
            <li>세무 컨설팅</li>
            <li>보고서 발급</li>
            <li>세무 Q&A</li>
            <li>블로그</li>
          </ul>
        </div>

        {/* 이용안내 */}
        <div>
          <h4 className="font-semibold mb-2">이용안내</h4>
          <ul className="space-y-1">
            <li>지점안내</li>
            <li>공지사항</li>
          </ul>
        </div>

        {/* 정책 및 채용 */}
        <div>
          <h4 className="font-semibold mb-2">정책/채용</h4>
          <ul className="space-y-1">
            <li>이용약관</li>
            <li>개인정보처리방침</li>
            <li>세무사 지원</li>
            <li>채용 안내</li>
          </ul>
        </div>
      </div>

      {/* 제작자 정보 */}
      <div className="text-center text-xs text-gray-400 mt-10">
        <h3 className="font-semibold text-gray-800 mb-2">Website</h3>
        <p>ⓒ {new Date().getFullYear()} Yongs Dining</p>
        <p>
          Website by{" "}
          <a
            href="https://laoncode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-800 font-medium"
          >
            LaonCode
          </a>
        </p>
      </div>

      {/* 폰트 정보 */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        폰트: KCC은영체 ⓒ projectnoonnu (CCL 저작자 표시)
      </p>
    </footer>
  );
}