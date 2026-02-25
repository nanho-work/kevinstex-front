'use client'

import Image from 'next/image'

const prefix = ''

const expertiseItems = [
  '기장 대리 / 신고 대리',
  '양도 · 상속 · 증여',
  '법인 컨설팅 / 가업승계',
  '세무 조사 대응',
  '신용등급 관리',
] as const

export default function About() {
  return (
    <main className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 font-Pretendard text-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* Top Profile Section */}
        <section className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src={`${prefix}/kwon_profile1.png`}
              alt="권도윤 세무사"
              width={200}
              height={200}
              className="rounded-2xl border border-gray-200 shadow-sm"
              priority
            />
          </div>

          <div className="w-full lg:w-1/2 max-w-xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              권도윤
            </h1>
            <p className="mt-2 text-base sm:text-lg text-gray-600">
              대표 세무사 | 디케빈즈택스랩
            </p>

            <p className="mt-6 text-gray-700 leading-relaxed">
              만나 뵙게 되어 반갑습니다.<br />
              송파구 문정동에 위치한 디케빈즈택스랩 대표 세무사 권도윤입니다.<br />
              세금은 단순한 퍼즐이 아니라,<br />
              고객 한 분 한 분의 상황을 이해하고 가장 적절한 구조를 설계하는 과정이라 생각합니다.
            </p>

            <p className="mt-8 text-gray-700 leading-relaxed">
              고객 여러분과 함께 가장 합리적인 방향을 찾고,<br />
              장기적인 관점에서 사업의 기반을 설계하는 파트너가 되겠습니다.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="my-10 sm:my-16 border-t border-gray-200" />

        {/* Education & Qualification */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="text-xs tracking-widest text-gray-500 font-medium">PROFILE</p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900 mb-6">학력 및 자격</h2>
            <ul className="space-y-3 text-gray-800 text-sm sm:text-base">
              <li>Murchison Middle School, Austin, TX, USA 졸업</li>
              <li>Anderson High School, Austin, TX, USA 입학</li>
              <li>영동일 고등학교 졸업</li>
              <li>동국대학교 화공생물공학과 입학</li>
              <li>동국대학교 경제학과 졸업</li>
              <li>펀드 투자상담사 자격증 취득</li>
              <li>증권 투자상담사 자격증 취득</li>
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-widest text-gray-500 font-medium">CAREER</p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900 mb-6">경력</h2>
            <ul className="space-y-3 text-gray-800 text-sm sm:text-base">
              <li><strong>현)</strong> 디 케빈즈 택스랩 대표 세무사</li>
              <li>전) 세무법인 혜안 근무</li>
              <li>전) 세무법인 배 근무</li>
              <li>전) 남택스&컨설팅 근무</li>
            </ul>
          </div>
        </section>

        {/* Divider */}
        <div className="my-10 sm:my-16 border-t border-gray-200" />

        {/* Expertise */}
        <section>
          <p className="text-xs tracking-widest text-gray-500 font-medium">EXPERTISE</p>
          <h2 className="mt-2 text-xl font-semibold text-gray-900 mb-6">전문 분야</h2>
          {/* Mobile (compact list) */}
          <ul className="sm:hidden mt-6 space-y-3">
            {expertiseItems.map((label) => (
              <li
                key={label}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-800 flex-shrink-0" />
                <span className="text-sm text-gray-900 font-medium leading-relaxed">{label}</span>
              </li>
            ))}
          </ul>

          {/* Desktop / Tablet (cards) */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {expertiseItems.map((label) => (
              <div
                key={label}
                className="border border-gray-200 rounded-xl p-6 bg-white hover:border-gray-300 hover:shadow-sm transition"
              >
                <p className="font-semibold text-gray-900">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing Message */}
        <section className="mt-14 sm:mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 text-gray-700 leading-relaxed">

            {/* Left empty container (visual balance) */}
            <div />

            {/* Right content container */}
            <div className="max-w-2xl">
              <p>
                저는 고객 여러분의 <strong>세무 파트너</strong>로서, 신뢰와 전문성을 바탕으로 한 조언과 도움을 드릴 것을 약속드립니다.<br />
                단순한 신고 대행이 아닌, 절세 전략과 경영 조언을 통해 <strong>함께 성장하는 동반자</strong>가 되겠습니다.
              </p>
              <p className="mt-4">
                앞으로 여러분의 곁에서 최선의 서비스를 제공하며, 세무 고민부터 경영 고민까지 든든하게 함께하겠습니다.<br /><br />
                <strong className="block text-right text-lg">감사합니다.</strong>
              </p>
            </div>

          </div>

          <p
            className="mt-12 text-right text-gray-500"
            style={{ fontFamily: 'KCC-eunyoung', fontSize: '2.0rem' }}
          >
            디 케빈즈 택스랩 대표 세무사 권도윤
          </p>
        </section>

      </div>
    </main>
  )
}