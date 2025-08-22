'use client'


const prefix = ''

export default function Hero() {
  return (
    <section
      className="w-full hero-font bg-cover bg-center sm:min-h-[500px] md:min-h-[700px] px-4 md:px-8"
      style={{
        backgroundImage: `
      linear-gradient(to left, rgba(191, 219, 254, 0.3), rgba(255, 255, 255, 0.5)),
      url('/main_bg1.jpg')
    `
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10 py-10">
        {/* 좌측 문구 */}
        <div className="flex flex-col min-h-[400px] md:h-[500px] justify-center space-y-6">
          <p className="text-base text-blue-600 font-sm tracking-wide">세금도 간편하게 톡!</p>
          <h1 className="text-4xl md:text-7xl font-extrabold leading-tight text-gray-900">
            세금을 그리다<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-400">
              THE KEVIN's TAX LAB
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-md">
            복잡한 세무, 전문가가 간단하게 해결해드립니다.
          </p>
          <a
            href="https://map.naver.com/p/entry/place/1166913410..."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white px-4 py-2 rounded-lg shadow bg-gradient-to-r from-blue-800 to-blue-400 hover:from-blue-900 hover:to-blue-500 transition text-center w-fit"
          >
            지금 상담 신청하기
          </a>
        </div>

        {/* 우측 이미지 */}
        <div className="hidden md:flex relative h-[400px] md:h-[500px] w-full items-center justify-center">
          <img
            src={`/kwon-any.png`}
            alt="권도윤 송파세무사 | 디케빈즈택스랩, 케빈즈택스의 권도윤세무사가 세금과 세무를 책임집니다."
            className="md:h-[150%] h-auto object-contain absolute md:mt-[150px] mt-0"
          />
        </div>
      </div>
    </section>
  )
}