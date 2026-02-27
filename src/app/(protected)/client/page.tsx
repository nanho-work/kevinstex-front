import Link from 'next/link'

function FeatureCard({
  title,
  desc,
  href,
}: {
  title: string
  desc: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 hover:shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{desc}</p>
        </div>
        <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition group-hover:border-neutral-300 group-hover:text-neutral-900">
          <span aria-hidden>→</span>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm text-neutral-500">
        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
          신고
        </span>
        <span className="text-neutral-400">•</span>
        <span>입력 후 제출</span>
      </div>
    </Link>
  )
}

function SectionHeader({
  title,
  desc,
}: {
  title: string
  desc: string
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
        {title}
      </h2>
      <p className="mt-1 text-sm text-neutral-600">{desc}</p>
    </div>
  )
}

function NoticeCard({
  title,
  date,
  pinned,
  desc,
}: {
  title: string
  date: string
  pinned?: boolean
  desc: string
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {title}
            </p>
            {pinned ? (
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                고정
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{desc}</p>
        </div>
        <div className="shrink-0 text-xs text-neutral-500">{date}</div>
      </div>
    </div>
  )
}

function ScheduleCard({
  title,
  range,
  badge,
}: {
  title: string
  range: string
  badge: string
}) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-neutral-900">{title}</p>
        <p className="mt-1 text-xs text-neutral-500">{range}</p>
      </div>
      <span className="shrink-0 inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
        {badge}
      </span>
    </div>
  )
}

export default function ClientHomePage() {
  return (
    <main className="min-h-[calc(100vh-80px)] w-full">
      <div className="mb-6">
        <div className="mb-8">
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
            대시보드
          </h1>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Notices */}
          <section className="lg:col-span-3">
            <SectionHeader
              title="공지사항"
              desc="자료 제출 방식/유의사항 등 중요한 안내를 확인하세요. (UI-only)"
            />

            <div className="space-y-3">
              <NoticeCard
                title="[필독] 2월 원천세 자료 제출 안내"
                date="2026-02-27"
                pinned
                desc="이번 달 원천세 자료는 3/5(목)까지 업로드 부탁드립니다. 지급일/대상월을 꼭 확인해 주세요."
              />

              <NoticeCard
                title="신분증/주민번호 처리 방식 안내"
                date="2026-02-20"
                desc="민감정보는 추후 암호화 저장 및 권한 분리(고객사/내부직원/관리자)로 단계적 적용 예정입니다."
              />

              <NoticeCard
                title="사업소득(3.3%) 입력 화면 개선"
                date="2026-02-18"
                desc="등록 버튼 기반 + 중복 지급 확인 모달 + 소프트 삭제 방식으로 UI가 통일되었습니다."
              />
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                공지사항 더보기(예시) →
              </button>
            </div>
          </section>

          {/* Schedule */}
          <section className="lg:col-span-2">
            <SectionHeader
              title="다가오는 일정"
              desc="세무 일정/마감 정보를 확인하세요. (UI-only)"
            />

            <div className="space-y-3">
              <ScheduleCard
                title="원천세 자료 제출 마감"
                range="2026-03-01 ~ 2026-03-05"
                badge="마감"
              />
              <ScheduleCard
                title="부가세 신고 준비 기간"
                range="2026-04-01 ~ 2026-04-20"
                badge="예정"
              />
              <ScheduleCard
                title="4대보험 취득/상실 정리"
                range="매월 1일 ~ 10일"
                badge="월간"
              />
              <ScheduleCard
                title="급여대장 확정 권장"
                range="매월 25일"
                badge="권장"
              />
            </div>

            <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-sm font-medium text-neutral-900">메모</p>
              <p className="mt-1 text-sm text-neutral-600">
                대시보드에는 월간 달력 전체보다, “다가오는 일정” 형태가 더 직관적입니다.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-sm font-medium text-neutral-900">안내</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-600">
            <li>해당 화면은 UI만 구성되어 있으며, 인증/제출 기능은 추후 연결합니다.</li>
            <li>신고 유형을 잘못 선택한 경우, 상단 메뉴 또는 뒤로가기로 다시 선택할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
