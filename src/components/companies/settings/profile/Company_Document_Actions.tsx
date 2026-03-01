'use client'

import { useRef } from 'react'
import type { CompanyBusinessLicenseDocState } from './Company_Document_State'

type Props = {
  doc: CompanyBusinessLicenseDocState
}

export default function Company_Document_Actions({ doc }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const isEmpty = doc.status === 'empty'
  const isReady = doc.status === 'ready'

  const onPickFile = () => {
    inputRef.current?.click()
  }

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // 같은 파일 재선택 가능하도록 value 초기화
    e.target.value = ''
    if (!file) return
    await doc.upload(file)
  }

  const onDelete = async () => {
    await doc.remove()
  }

  const primaryLabel = isReady ? '변경' : '등록'

  return (
    <div className="mt-3 flex items-center justify-end gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={onChangeFile}
      />

      <button
        type="button"
        onClick={onPickFile}
        disabled={doc.isBusy}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {doc.isBusy ? '처리중...' : primaryLabel}
      </button>

      <button
        type="button"
        onClick={onDelete}
        disabled={doc.isBusy || isEmpty}
        className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
      >
        삭제
      </button>
    </div>
  )
}