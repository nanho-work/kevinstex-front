'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export type HomeInsightItem = {
  label: string
  title: string
  description: string
}

type HomeInsightCarouselProps = {
  items: readonly HomeInsightItem[]
}

function InsightCard({
  item,
  className = '',
}: {
  item: HomeInsightItem
  className?: string
}) {
  return (
    <Link
      href="/blog"
      className={`group flex flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 transition hover:shadow-[0_18px_45px_rgba(16,36,63,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4779bf] motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:rounded-[1.75rem] sm:p-7 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#edf4ff] px-3 py-1.5 text-xs font-bold text-[#4779bf]">
          {item.label}
        </span>
        <BookOpenText
          className="h-5 w-5 text-slate-300 transition group-hover:text-[#4779bf]"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-8 text-xl font-bold leading-8 tracking-[-0.025em] text-[#10243f]">
        {item.title}
      </h3>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        {item.description}
      </p>
      <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold text-[#4779bf]">
        관련 글 모아보기
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  )
}

export default function HomeInsightCarousel({
  items,
}: HomeInsightCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const updateCurrentIndex = () => {
    const scroller = scrollerRef.current

    if (!scroller) {
      return
    }

    const cards = Array.from(
      scroller.querySelectorAll<HTMLElement>('[data-insight-card]'),
    )

    if (cards.length === 0) {
      return
    }

    const scrollerLeft = scroller.getBoundingClientRect().left
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - scrollerLeft)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setCurrentIndex(closestIndex)
  }

  const scheduleIndexUpdate = () => {
    if (frameRef.current !== null) {
      return
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null
      updateCurrentIndex()
    })
  }

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current
    const target = scroller?.querySelectorAll<HTMLElement>(
      '[data-insight-card]',
    )[index]

    if (!target) {
      return
    }

    const targetLeft =
      target.getBoundingClientRect().left -
      scroller.getBoundingClientRect().left +
      scroller.scrollLeft

    scroller.scrollTo({
      left: targetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    },
    [],
  )

  if (items.length === 0) {
    return null
  }

  return (
    <>
      <div className="mt-10 lg:hidden">
        <div
          ref={scrollerRef}
          onScroll={scheduleIndexUpdate}
          className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4779bf] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="세무 인사이트 글 목록"
          aria-roledescription="캐러셀"
          role="region"
          tabIndex={0}
        >
          {items.map((item, index) => (
            <div
              key={item.title}
              data-insight-card
              className="w-[calc(100vw-4rem)] max-w-[32rem] flex-none snap-start sm:w-96"
              aria-label={`${index + 1} / ${items.length}`}
              aria-roledescription="슬라이드"
              role="group"
            >
              <InsightCard item={item} className="min-h-[290px]" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span
              className="w-10 flex-none text-xs font-bold tabular-nums text-[#315f9f]"
              aria-live="polite"
            >
              {currentIndex + 1} / {items.length}
            </span>
            <div
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200"
              aria-hidden="true"
            >
              <span
                className="block h-full origin-left bg-[#4779bf] transition-[width] duration-200 motion-reduce:transition-none"
                style={{
                  width: `${((currentIndex + 1) / items.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-none gap-2">
            <button
              type="button"
              onClick={() => scrollToIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-[#315f9f] transition hover:border-[#8aa9d2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4779bf] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="이전 인사이트"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(currentIndex + 1)}
              disabled={currentIndex === items.length - 1}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-[#315f9f] transition hover:border-[#8aa9d2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4779bf] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="다음 인사이트"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 hidden gap-5 lg:grid lg:grid-cols-3">
        {items.map((item) => (
          <InsightCard key={item.title} item={item} className="min-h-[285px]" />
        ))}
      </div>
    </>
  )
}
