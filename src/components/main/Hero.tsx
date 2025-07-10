'use client'

import Link from 'next/link'

const prefix = ''

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-l from-blue-300 to-white  shadow rounded-lg hero-font">
      <div className="w-full grid md:grid-cols-2 items-start gap-10">
        {/* 좌측 문구 */}
        <div className="flex flex-col min-h-[400px] md:h-[500px] justify-center space-y-6">
          <p className="text-base text-blue-700 font-sm tracking-wide">세금도 간편하게 톡!</p>
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
            href="https://map.naver.com/p/entry/place/1166913410?lng=127.1221551&lat=37.4883000&placePath=/home?bookingRedirectUrl=https%3A%2F%2Fm.booking.naver.com%2Fbooking%2F5%2Fbizes%2F1171914&theme=place&entry=pll&lang=ko&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202507101558&locale=ko&svcName=map_pcv5&theme=place&entry=pll&lang=ko&from=map&fromPanelNum=1&additionalHeight=76&timestamp=202507101558&locale=ko&svcName=map_pcv5&area=pll&c=15.00,0,0,0,dh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white px-4 py-2 rounded-lg shadow bg-gradient-to-r from-blue-800 to-blue-400 hover:from-blue-900 hover:to-blue-500 transition text-center w-fit"
          >
            지금 상담 신청하기
          </a>
        </div>

        {/* 우측 이미지 */}
        <div className="hidden md:flex relative md:h-[500px] w-full items-center justify-center">
          <img
            src={`${prefix}/kwon_profile.png`}
            alt="권도윤 송파세무사 | 디케빈즈택스랩, 케빈즈택스의 권도윤세무사가 세금과 세무를 책임집니다."
            className="h-[180%] object-contain absolute mt-[55px]"
          />
        </div>
      </div>
    </section>
  )
}