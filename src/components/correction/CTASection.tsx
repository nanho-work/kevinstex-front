export default function CTASection() {
    return (
        <section className="py-20 text-center rounded-lg bg-indigo-100 text-gray-800">
            <h2 className="text-2xl font-bold mb-6">
                지금 환급 가능 여부 확인해보세요
            </h2>
            <div className="flex items-center justify-center space-x-4">
                {/* 카카오톡 상담 */}
                <a
                    href="https://pf.kakao.com/_xgxlxjxb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition animate-pulse border border-black"
                >
                    카카오톡 상담
                </a>
                <a
                    href="/solution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition animate-pulse border border-black"
                >
                    원클릭 간편조회
                </a>
            </div>
        </section>
    )
}