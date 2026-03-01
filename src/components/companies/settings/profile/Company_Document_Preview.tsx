'use client'

import { companyDocUtils, type CompanyBusinessLicenseDocState } from './Company_Document_State'

type Props = {
  doc: CompanyBusinessLicenseDocState
}

export default function Company_Document_Preview({ doc }: Props) {
  const { status, previewUrl, fileName, errorMessage } = doc
  const isPdf = companyDocUtils.isPdfFileName(fileName)

  return (
    <div className="flex flex-col rounded-xl border border-neutral-200 bg-white shadow-sm">

      <div className="relative flex-1 min-h-[520px] bg-neutral-50">
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-neutral-500">불러오는 중...</p>
          </div>
        )}

        {status === 'empty' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-neutral-500">파일등록 전입니다</p>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-sm text-neutral-700">미리보기를 불러올 수 없습니다.</p>
            {errorMessage && <p className="text-xs text-neutral-500">{errorMessage}</p>}
          </div>
        )}

        {status === 'ready' && previewUrl && (
          <div className="h-full w-full">
            {isPdf ? (
              <iframe
                // NOTE: Many browser PDF viewers ignore zoom fragments in cross-origin iframes.
                // Keep it minimal and allow the viewer to scroll normally.
                title="business-license-preview"
                src={`${previewUrl}#toolbar=0`}
                className="h-[520px] w-full"
              />
            ) : (
              // 이미지면 img로
              // (pdf 외 타입은 img로 시도)
              <img src={previewUrl} alt="business-license-preview" className="h-full w-full object-contain" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}