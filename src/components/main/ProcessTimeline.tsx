'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type ProcessStep = {
  number: string
  title: string
  description: string
}

type ProcessTimelineProps = {
  steps: readonly ProcessStep[]
}

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const mobileListRef = useRef<HTMLOListElement>(null)
  const frameRef = useRef<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  const updateProgress = useCallback(() => {
    const list = mobileListRef.current

    if (!list || list.offsetParent === null) {
      return
    }

    const anchors = Array.from(
      list.querySelectorAll<HTMLElement>('[data-timeline-anchor]'),
    )

    if (anchors.length < 2) {
      setProgress(anchors.length === 1 ? 1 : 0)
      return
    }

    const firstY =
      anchors[0].getBoundingClientRect().top + window.scrollY + 8
    const lastY =
      anchors[anchors.length - 1].getBoundingClientRect().top +
      window.scrollY +
      8
    const readingLineY = window.scrollY + window.innerHeight * 0.6
    const nextProgress = clamp((readingLineY - firstY) / (lastY - firstY))

    setProgress((current) =>
      Math.abs(current - nextProgress) > 0.002 ? nextProgress : current,
    )
  }, [])

  useEffect(() => {
    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    const syncMotionPreference = () =>
      setReduceMotion(motionPreference.matches)

    const scheduleUpdate = () => {
      if (frameRef.current !== null) {
        return
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        updateProgress()
      })
    }

    syncMotionPreference()
    scheduleUpdate()

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    motionPreference.addEventListener('change', syncMotionPreference)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      motionPreference.removeEventListener('change', syncMotionPreference)

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [updateProgress])

  const segmentScale = progress * Math.max(steps.length - 1, 1)
  const currentStepIndex = Math.min(
    steps.length - 1,
    Math.max(0, Math.floor(segmentScale)),
  )

  return (
    <>
      <ol
        ref={mobileListRef}
        className="mt-10 lg:hidden"
        aria-label="세무 업무 진행 과정"
      >
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex
          const currentSegmentProgress = clamp(segmentScale - index)
          const isLast = index === steps.length - 1

          return (
            <li
              key={step.number}
              className={`grid grid-cols-[1rem_1fr] gap-5 ${
                isLast ? '' : 'pb-11'
              }`}
              aria-current={currentStepIndex === index ? 'step' : undefined}
            >
              <div
                data-timeline-anchor
                className="relative flex justify-center"
                aria-hidden="true"
              >
                <span
                  className={`relative z-10 mt-1 block rounded-full border-2 bg-white ${
                    reduceMotion ? '' : 'transition-all duration-200'
                  } ${
                    isActive
                      ? 'h-3.5 w-3.5 border-[#4779bf] shadow-[0_0_0_5px_rgba(71,121,191,0.12)]'
                      : 'h-3 w-3 border-slate-300'
                  }`}
                />

                {!isLast ? (
                  <>
                    <span className="absolute left-1/2 top-5 bottom-[-2.75rem] w-0.5 -translate-x-1/2 bg-slate-200" />
                    <span
                      className={`absolute left-1/2 top-5 bottom-[-2.75rem] w-[3px] origin-top -translate-x-1/2 bg-[#4779bf] ${
                        reduceMotion
                          ? ''
                          : 'transition-transform duration-150 ease-out'
                      }`}
                      style={{
                        transform: `translateX(-50%) scaleY(${currentSegmentProgress})`,
                      }}
                    />
                  </>
                ) : null}
              </div>

              <div className="-mt-0.5 pb-1">
                <p
                  className={`text-xs font-bold tracking-[0.18em] ${
                    reduceMotion ? '' : 'transition-colors duration-200'
                  } ${isActive ? 'text-[#4779bf]' : 'text-slate-400'}`}
                >
                  {step.number}
                </p>
                <h3
                  className={`mt-3 text-xl font-bold ${
                    reduceMotion ? '' : 'transition-colors duration-200'
                  } ${isActive ? 'text-[#10243f]' : 'text-slate-500'}`}
                >
                  {step.title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <ol className="mt-14 hidden grid-cols-4 lg:grid" aria-label="세무 업무 진행 과정">
        {steps.map((step, index) => (
          <li
            key={step.number}
            className={`relative border-t border-slate-300 pt-7 lg:px-7 ${
              index === 0 ? 'lg:pl-0' : ''
            } ${index === steps.length - 1 ? 'lg:pr-0' : ''}`}
          >
            <span
              className={`absolute -top-[5px] h-2.5 w-2.5 rounded-full bg-[#4779bf] ${
                index === 0 ? 'left-0' : 'left-7'
              }`}
              aria-hidden="true"
            />
            <p className="text-xs font-bold tracking-[0.18em] text-[#4779bf]">
              {step.number}
            </p>
            <h3 className="mt-4 text-xl font-bold text-[#10243f]">
              {step.title}
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </>
  )
}
