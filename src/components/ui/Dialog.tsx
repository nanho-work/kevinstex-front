'use client'

import * as React from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

// 모달에 필요한 props 정의: open 상태, 닫기 함수, children 컴포넌트
interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

// 모달 본체를 렌더링하는 Dialog 컴포넌트
// Headless UI의 Dialog와 Transition을 활용하여 애니메이션과 접근성 제공
export function Dialog({ open, onClose, children }: DialogProps) {
  return (
    // 모달이 열릴 때의 진입/퇴장 애니메이션 효과 설정
    <Transition appear show={open} as={Fragment}>
      {/* Headless UI의 Dialog 컴포넌트를 사용하여 모달 접근성과 focus trap 기능 제공 */}
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
        {/* 배경 오버레이 애니메이션 설정 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* 반투명 검정 배경 */}
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* 모달 창에 대한 진입/퇴장 애니메이션 */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* 실제 모달 UI 영역 */}
              <HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* 자식 컴포넌트 삽입 위치 */}
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}

// 모달 제목을 표시하는 Header 컴포넌트
export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-lg font-semibold mb-4 ${className ?? ''}`}>{children}</div>
}

// 모달 본문 내용을 표시하는 Content 컴포넌트
export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-6 text-sm text-gray-600 ${className ?? ''}`}>{children}</div>
}

// 모달 하단 버튼 등을 배치하는 Footer 컴포넌트
export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex justify-end gap-2 ${className ?? ''}`}>{children}</div>
}