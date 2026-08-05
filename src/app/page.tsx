import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Check,
  ChevronDown,
  CircleCheckBig,
  Clock3,
  FileCheck2,
  Landmark,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react'
import Hero from '@/components/main/Hero'
import HomeInsightCarousel from '@/components/main/HomeInsightCarousel'
import ProcessTimeline from '@/components/main/ProcessTimeline'
import {
  KAKAO_CHAT_URL,
  NAVER_RESERVATION_URL,
} from '@/constants/externalLinks'
import {
  CONTACT_PHONE,
  OFFICE_ADDRESS,
  OFFICE_NAME,
  SITE_NAME,
  SITE_URL,
} from '@/constants/siteConfig'

export const metadata: Metadata = {
  title: '디 케빈즈 택스랩 | 사업의 다음 결정을 함께하는 세무 파트너',
  description:
    '성남 위례에서 기장, 세금 신고, 양도·상속·증여, 법인 컨설팅을 제공하는 디 케빈즈 택스랩입니다. 방문 및 전국 비대면 상담이 가능합니다.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: '디 케빈즈 택스랩 | 사업의 다음 결정을 함께하는 세무 파트너',
    description:
      '복잡한 세무를 이해하기 쉽게. 기장과 신고부터 재산세제·법인 컨설팅까지 함께합니다.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/main-home.webp`,
        width: 1600,
        height: 1067,
        alt: '디 케빈즈 택스랩 권도윤 대표 세무사',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '디 케빈즈 택스랩',
    description: '사업의 다음 결정을 함께하는 세무 파트너',
    images: [`${SITE_URL}/main-home.webp`],
  },
}

type ServiceCard = {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: readonly string[]
  items: readonly string[]
}

const serviceCards: readonly ServiceCard[] = [
  {
    icon: BriefcaseBusiness,
    eyebrow: 'START',
    title: '사업을 시작할 때',
    description: [
      '사업자등록부터 법인 전환 검토까지,',
      '시작 단계의 세무 구조를',
      '함께 살펴봅니다.',
    ],
    items: ['사업자등록', '창업 세무 안내', '법인 전환 검토'],
  },
  {
    icon: Calculator,
    eyebrow: 'MANAGE',
    title: '매월 관리가 필요할 때',
    description: [
      '장부와 세무 일정을',
      '체계적으로 관리해 대표님이',
      '본업에 집중할 수 있게 돕습니다.',
    ],
    items: ['기장 대리', '부가가치세', '원천세 관리'],
  },
  {
    icon: FileCheck2,
    eyebrow: 'REPORT',
    title: '정기 신고가 다가올 때',
    description: [
      '신고 대상과 필요한 자료를',
      '먼저 정리하고, 빠뜨리는 항목 없이',
      '진행합니다.',
    ],
    items: ['종합소득세', '법인세', '각종 세금 신고'],
  },
  {
    icon: Landmark,
    eyebrow: 'ASSET',
    title: '재산을 이전할 때',
    description: [
      '거래와 가족 상황을 함께 살펴',
      '양도·상속·증여의 쟁점을',
      '이해하기 쉽게 설명합니다.',
    ],
    items: ['양도소득세', '상속세', '증여세'],
  },
]

const principles = [
  {
    icon: UserRoundCheck,
    title: '상황을 먼저 이해합니다',
    description: '정해진 답을 제시하기 전에 사업과 거래의 배경부터 확인합니다.',
  },
  {
    icon: MessageCircle,
    title: '쉬운 언어로 설명합니다',
    description: '어려운 세무 용어를 나열하기보다 선택지와 영향을 명확하게 정리합니다.',
  },
  {
    icon: ShieldCheck,
    title: '진행 과정을 공유합니다',
    description: '필요 자료와 일정, 다음 단계를 미리 안내해 업무의 불확실성을 줄입니다.',
  },
] as const

const processSteps = [
  {
    number: '01',
    title: '상담 신청',
    description: '방문 또는 비대면 상담을 신청합니다.',
  },
  {
    number: '02',
    title: '상황 확인',
    description: '사업과 세무 이슈, 필요한 업무 범위를 확인합니다.',
  },
  {
    number: '03',
    title: '자료 안내',
    description: '필요한 자료와 일정, 진행 방식을 정리해 드립니다.',
  },
  {
    number: '04',
    title: '신고·관리',
    description: '업무를 진행하고 결과와 다음 일정을 안내합니다.',
  },
] as const

const insightCards = [
  {
    label: '사업 시작',
    title: '사업자등록 전에 확인해야 할 세무 체크포인트',
    description: '사업 형태와 업종, 초기 비용 처리에서 먼저 살펴볼 내용을 정리합니다.',
  },
  {
    label: '세금 신고',
    title: '부가가치세 신고, 자료 준비부터 막히지 않게',
    description: '신고 시기마다 반복되는 자료 준비와 확인 항목을 쉽게 안내합니다.',
  },
  {
    label: '사업 전환',
    title: '개인사업자와 법인, 전환 시점은 어떻게 볼까',
    description: '매출만이 아니라 비용 구조와 운영 계획까지 함께 보아야 하는 이유를 살펴봅니다.',
  },
] as const

const faqs = [
  {
    question: '지역이 멀어도 세무 업무를 맡길 수 있나요?',
    answer:
      '네. 주요 세무 업무는 전산과 온라인 자료 전달을 통해 진행할 수 있어 전국 비대면 상담과 업무가 가능합니다. 방문이 필요한 경우에는 성남 위례 사무실에서 상담할 수 있습니다.',
  },
  {
    question: '첫 상담 전에 무엇을 준비하면 좋을까요?',
    answer:
      '사업자 유형과 현재 가장 궁금한 문제를 간단히 정리해 주세요. 구체적인 자료는 상담에서 상황을 확인한 뒤 필요한 항목만 안내해 드립니다.',
  },
  {
    question: '기장과 신고 대리는 어떤 차이가 있나요?',
    answer:
      '기장은 매월 장부와 세무 일정을 지속적으로 관리하는 업무이고, 신고 대리는 특정 세금 신고를 중심으로 진행하는 업무입니다. 사업 규모와 관리 필요성에 따라 적합한 방식을 안내해 드립니다.',
  },
] as const

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: OFFICE_NAME,
  url: SITE_URL,
  telephone: CONTACT_PHONE,
  image: `${SITE_URL}/main-home.webp`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: OFFICE_ADDRESS,
    addressLocality: '성남시',
    addressRegion: '경기도',
    postalCode: '13647',
    addressCountry: 'KR',
  },
  areaServed: {
    '@type': 'Country',
    name: '대한민국',
  },
}

function SectionHeading({
  eyebrow,
  title,
  description,
  wide = false,
  singleLineOnDesktop = false,
}: {
  eyebrow: string
  title: ReactNode
  description?: string
  wide?: boolean
  singleLineOnDesktop?: boolean
}) {
  return (
    <div className={wide ? 'max-w-none' : 'max-w-2xl'}>
      <p className="text-xs font-bold tracking-[0.2em] text-[#4779bf]">{eyebrow}</p>
      <h2
        className={`mt-3 break-keep text-[1.8rem] font-bold leading-[1.22] tracking-[-0.035em] text-[#10243f] sm:mt-4 sm:text-4xl ${
          singleLineOnDesktop
            ? 'xl:whitespace-nowrap xl:text-[2.45rem]'
            : 'lg:text-[2.7rem]'
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 break-keep text-[0.95rem] leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">{description}</p>
      ) : null}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>

      <div className="break-keep bg-[#fbfaf7] pb-28 text-[#10243f] md:pb-0">
        <Hero />

        <section
          aria-label="디 케빈즈 택스랩 상담 안내"
          className="relative z-10 mx-2 -mt-5 rounded-[1.25rem] border border-slate-200/80 bg-white px-4 py-5 shadow-[0_18px_50px_rgba(16,36,63,0.1)] sm:mx-8 sm:-mt-7 sm:rounded-[1.5rem] sm:px-8 sm:py-6 lg:mx-12"
        >
          <ul className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4 lg:divide-x lg:divide-slate-200">
            <li className="lg:px-5">
              <CircleCheckBig className="h-5 w-5 text-[#4779bf]" aria-hidden="true" />
              <p className="mt-2 text-sm font-bold text-[#10243f] sm:mt-3">1:1 세무 상담</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">상황부터 차근차근 확인</p>
            </li>
            <li className="lg:px-5">
              <MapPin className="h-5 w-5 text-[#4779bf]" aria-hidden="true" />
              <p className="mt-2 text-sm font-bold text-[#10243f] sm:mt-3">성남 위례 사무실</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">방문 상담 가능</p>
            </li>
            <li className="lg:px-5">
              <Building2 className="h-5 w-5 text-[#4779bf]" aria-hidden="true" />
              <p className="mt-2 text-sm font-bold text-[#10243f] sm:mt-3">개인·법인 사업자</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">사업 단계에 맞춘 업무</p>
            </li>
            <li className="lg:px-5">
              <Clock3 className="h-5 w-5 text-[#4779bf]" aria-hidden="true" />
              <p className="mt-2 text-sm font-bold text-[#10243f] sm:mt-3">전국 비대면</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">지역과 관계없이 진행</p>
            </li>
          </ul>
        </section>

        <section className="mx-auto max-w-7xl px-1 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-6 sm:gap-8 xl:flex-row xl:items-end">
            <SectionHeading
              eyebrow="YOUR SITUATION"
              title={
                <>
                  <span className="block xl:inline">필요한 세무 서비스를</span>{' '}
                  <span className="block xl:inline">상황으로 찾아보세요.</span>
                </>
              }
              description="무슨 세목인지 정확히 몰라도 괜찮습니다. 지금 겪고 있는 상황에서 시작하면 됩니다."
              wide
              singleLineOnDesktop
            />
            <Link
              href="/service"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#315f9f] transition hover:text-[#10243f]"
            >
              전체 서비스 보기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {serviceCards.map((service) => {
              const Icon = service.icon

              return (
                <Link
                  key={service.title}
                  href="/service"
                  className="group flex flex-col rounded-[1.5rem] border border-[#dfe5ec] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#adc4e4] hover:shadow-[0_18px_45px_rgba(16,36,63,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4779bf] sm:min-h-[330px] sm:rounded-[1.75rem] sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#4779bf]">
                      <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#4779bf]"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-7 text-xs font-bold tracking-[0.18em] text-[#6c8ebc]">{service.eyebrow}</p>
                  <h3 className="mt-3 text-xl font-bold tracking-[-0.025em] text-[#10243f] xl:whitespace-nowrap">{service.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {service.description.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  <ul className="mt-auto space-y-2 pt-7">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-[#4779bf]" strokeWidth={2.2} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-1 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28">
          <div className="overflow-hidden rounded-[2rem] bg-[#10243f] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden p-6 text-white sm:p-10 lg:min-h-[580px] lg:p-14">
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(circle at 0% 0%, rgba(91, 151, 240, 0.4), transparent 40%), radial-gradient(circle at 90% 100%, rgba(79, 143, 247, 0.2), transparent 36%)',
                }}
              />
              <div className="relative">
                <p className="text-xs font-bold tracking-[0.2em] text-[#9cc3ff]">OUR STANDARD</p>
                <h2 className="mt-4 max-w-lg text-[1.8rem] font-bold leading-[1.22] tracking-[-0.04em] sm:mt-5 sm:text-4xl">
                  <span className="block lg:inline">숫자를 처리하는 일을</span>{' '}
                  <span className="block lg:inline">넘어,</span>
                  <br className="hidden lg:block" />
                  <span className="block lg:inline">결정할 수 있게 돕습니다.</span>
                </h2>
                <p className="mt-5 max-w-lg text-[0.95rem] leading-7 text-slate-300 sm:mt-6 sm:text-base">
                  <span className="block">세금은 고객마다 상황이 다릅니다.</span>
                  <span className="block">먼저 듣고, 이해할 수 있게 설명하고</span>
                  <span className="block">다음 단계까지 안내하는 것을</span>
                  <span className="block">업무의 기준으로 삼습니다.</span>
                </p>
              </div>

              <blockquote className="relative mt-10 border-l border-[#77a9ef] pl-4 text-sm leading-6 text-slate-200 sm:mt-12 sm:pl-5">
                “장기적인 관점에서 사업의 기반을 설계하는
                <br className="hidden sm:block" /> 세무 파트너가 되겠습니다.”
              </blockquote>
            </div>

            <div className="grid gap-px bg-slate-200 sm:grid-cols-3 lg:grid-cols-1">
              {principles.map((principle) => {
                const Icon = principle.icon

                return (
                  <article key={principle.title} className="bg-white p-6 sm:p-8 lg:flex lg:items-center lg:gap-7 lg:px-12">
                    <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-[#edf4ff] text-[#4779bf]">
                      <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <div className="mt-5 lg:mt-0">
                      <h3 className="text-lg font-bold text-[#10243f]">{principle.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{principle.description}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-1 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
            <SectionHeading
              eyebrow="PROCESS"
              title={
                <>
                  <span className="block sm:inline">처음 맡기셔도,</span>{' '}
                  <span className="block sm:inline">다음 단계가 보이도록.</span>
                </>
              }
              description="상담부터 업무 완료까지 필요한 내용과 일정을 순서대로 안내합니다."
            />

            <ProcessTimeline steps={processSteps} />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-1 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.5rem] bg-[#eaf1fa] p-6 sm:rounded-[2rem] sm:p-10 lg:p-14">
              <p className="text-xs font-bold tracking-[0.2em] text-[#4779bf]">YOUR TAX PARTNER</p>
              <h2 className="mt-4 text-[1.8rem] font-bold leading-[1.22] tracking-[-0.04em] text-[#10243f] sm:mt-5 sm:text-4xl">
                <span className="block lg:inline">고객의 상황을 이해하는</span>{' '}
                <span className="block lg:inline">것에서</span>
                <br className="hidden lg:block" />
                <span className="block lg:inline">세무 업무를 시작합니다.</span>
              </h2>
              <p className="mt-5 max-w-xl text-[0.95rem] leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
                단순한 신고 대행을 넘어, 사업과 자산의 흐름을 함께 살펴 가장 합리적인 방향을 찾겠습니다.
              </p>
              <Link
                href="/about"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#10243f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1c3a61]"
              >
                대표 세무사 소개
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 sm:rounded-[2rem] sm:p-10 lg:p-14">
              <div>
                <p className="text-sm font-semibold text-[#4779bf]">권도윤 대표 세무사</p>
                <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#10243f]">디 케빈즈 택스랩</p>
              </div>
              <div className="my-8 h-px bg-slate-200" />
              <p className="text-sm font-bold text-[#10243f]">주요 전문 분야</p>
              <ul className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                {[
                  '기장 대리·신고 대리',
                  '양도·상속·증여',
                  '법인 컨설팅·가업승계',
                  '세무조사 대응',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#6c8ebc]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10 text-sm leading-6 text-slate-500">
                <p>전) 세무법인 혜안 · 세무법인 배 · 남택스&amp;컨설팅</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f0f4f8]">
          <div className="mx-auto max-w-7xl px-1 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
            <div className="flex flex-col justify-between gap-6 sm:gap-8 lg:flex-row lg:items-end">
              <SectionHeading
                eyebrow="TAX INSIGHT"
                title={
                  <>
                    <span className="block sm:inline">세무 판단에 필요한 정보를</span>{' '}
                    <span className="block sm:inline">쉽게 정리합니다.</span>
                  </>
                }
                description="복잡한 제도를 그대로 옮기기보다 실제 사업자가 궁금해하는 질문부터 설명합니다."
              />
              <Link
                href="/blog"
                className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#315f9f] transition hover:text-[#10243f]"
              >
                모든 글 보기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <HomeInsightCarousel items={insightCards} />
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-1 py-16 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:px-8 lg:py-28">
          <div>
            <SectionHeading
              eyebrow="FAQ"
              title={
                <>
                  <span className="block sm:inline">상담 전에 많이 물어보시는</span>{' '}
                  <span className="block sm:inline">내용입니다.</span>
                </>
              }
            />
            <Link
              href="/faq"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#315f9f] transition hover:text-[#10243f]"
            >
              자주 묻는 질문 전체 보기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq) => (
              <details key={faq.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-left text-base font-bold text-[#10243f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4779bf] sm:text-lg">
                  {faq.question}
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#edf4ff] text-[#4779bf] transition group-open:rotate-180">
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 pr-10 text-sm leading-7 text-slate-600 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-1 pb-5 sm:px-6 sm:pb-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[#10243f] px-6 py-10 text-white sm:rounded-[2rem] sm:px-12 sm:py-14 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-16">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(circle at 92% 10%, rgba(103, 163, 255, 0.35), transparent 28%), radial-gradient(circle at 5% 100%, rgba(72, 125, 205, 0.2), transparent 30%)',
              }}
            />
            <div className="relative max-w-2xl">
              <p className="text-xs font-bold tracking-[0.2em] text-[#9cc3ff]">LET&apos;S TALK</p>
              <h2 className="mt-4 text-[1.8rem] font-bold leading-[1.22] tracking-[-0.04em] sm:text-4xl">
                <span className="block lg:inline">세무 고민,</span>{' '}
                <span className="block lg:inline">혼자 정리하지 않아도 됩니다.</span>
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                현재 상황을 알려주시면 필요한 업무와 다음 단계를 함께 정리해 드립니다.
              </p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#9cc3ff]" aria-hidden="true" />
                  {CONTACT_PHONE}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#9cc3ff]" aria-hidden="true" />
                  성남 위례
                </span>
              </div>
            </div>
            <div className="relative mt-9 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-none">
              <a
                href={KAKAO_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                카카오 상담
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={NAVER_RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#4f8ff7] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#6aa1fa]"
              >
                상담 예약하기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(16,36,63,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-[#10243f]"
          >
            <MessageCircle className="h-4 w-4 text-[#4779bf]" aria-hidden="true" />
            카카오 상담
          </a>
          <a
            href={NAVER_RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#315f9f] px-4 text-sm font-bold text-white"
          >
            상담 예약
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  )
}
