import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, MapPin } from 'lucide-react'
import { NAVER_RESERVATION_URL } from '@/constants/externalLinks'

const heroPoints = [
  '전문 세무사 1:1 상담',
  '성남 위례 방문 상담',
  '전국 비대면 업무',
] as const

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] bg-[#10243f] text-white shadow-[0_26px_80px_rgba(16,36,63,0.16)] sm:rounded-[2.25rem]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 16% 12%, rgba(94, 163, 255, 0.28), transparent 34%), radial-gradient(circle at 82% 74%, rgba(50, 112, 208, 0.3), transparent 34%)',
        }}
      />

      <div className="relative grid lg:min-h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 flex flex-col justify-center px-5 py-9 sm:px-12 sm:py-16 lg:px-14 xl:px-16">
          <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[0.7rem] font-semibold tracking-[0.06em] text-blue-100 backdrop-blur-sm sm:mb-7 sm:px-4 sm:text-sm">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            성남 위례 · 전국 비대면 세무 파트너
          </div>

          <h1 className="max-w-3xl break-keep text-[2.15rem] font-bold leading-[1.14] tracking-[-0.045em] text-white sm:text-5xl lg:text-[3.65rem] xl:text-[4.15rem]">
            <span className="block">세금 신고를 넘어,</span>
            <span className="mt-2 block text-[#9cc3ff]">사업의 다음 결정을</span>
            <span className="block text-[#9cc3ff]">함께합니다.</span>
          </h1>

          <p className="mt-6 max-w-2xl break-keep text-sm leading-6 text-slate-200 sm:mt-7 sm:text-lg sm:leading-8">
            <span className="block lg:hidden">기장과 각종 세금 신고부터</span>
            <span className="block lg:hidden">양도·상속·증여, 법인 컨설팅까지.</span>
            <span className="mt-2 block lg:hidden">복잡한 내용을 이해하기 쉬운 언어로</span>
            <span className="block lg:hidden">정리해 드립니다.</span>
            <span className="hidden lg:block">기장과 각종 세금 신고부터 양도·상속·증여, 법인 컨설팅까지.</span>
            <span className="hidden lg:block">복잡한 내용을 이해하기 쉬운 언어로 정리해 드립니다.</span>
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <a
              href={NAVER_RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#4f8ff7] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(34,105,220,0.34)] transition hover:-translate-y-0.5 hover:bg-[#6aa1fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
            >
              상담 예약하기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/service"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/45 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
            >
              서비스 살펴보기
            </Link>
          </div>

          <ul className="mt-7 flex flex-col items-start gap-3 text-sm text-slate-200 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {heroPoints.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[#9cc3ff]">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-[340px] overflow-hidden sm:min-h-[470px] lg:min-h-full">
          <div className="absolute inset-x-[7%] bottom-[-16%] aspect-square rounded-full bg-gradient-to-br from-[#d9e8ff] via-[#a8c8f5] to-[#5e92dd] opacity-95" aria-hidden="true" />
          <div className="absolute inset-x-[10%] bottom-0 top-5">
            <Image
              src="/kwon-home.webp"
              alt="권도윤 디 케빈즈 택스랩 대표 세무사"
              fill
              priority
              sizes="(max-width: 1023px) 80vw, 42vw"
              className="object-contain object-bottom drop-shadow-[0_24px_34px_rgba(5,20,42,0.35)]"
            />
          </div>

          <div className="absolute bottom-5 left-5 rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-[#10243f] shadow-xl backdrop-blur-md sm:bottom-9 sm:left-9 sm:px-5 sm:py-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#4779bf]">TAX PARTNER</p>
            <p className="mt-1 text-lg font-bold">권도윤 대표 세무사</p>
            <p className="mt-1 text-xs text-slate-600">디 케빈즈 택스랩</p>
          </div>
        </div>
      </div>
    </section>
  )
}
