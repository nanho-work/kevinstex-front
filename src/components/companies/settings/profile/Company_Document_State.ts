'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

// ⚠️ 아래 import 경로는 네 프로젝트에서 "문서 서비스 파일" 실제 위치로 맞춰야 함
// (네가 처음 공유한 getCompanyDocumentPreview/uploadCompanyDocument/deleteCompanyDocument 있는 파일)
import {
  getCompanyDocumentPreview,
  uploadCompanyDocument,
  deleteCompanyDocument,
} from '@/service/company/document'

type DocStatus = 'loading' | 'empty' | 'ready' | 'error'

export type CompanyBusinessLicenseDocState = {
  docTypeCode: string
  status: DocStatus
  fileName: string | null
  previewUrl: string | null
  errorMessage: string | null
  isBusy: boolean
  refresh: () => Promise<void>
  upload: (file: File) => Promise<void>
  remove: () => Promise<void>
}

const DOC_TYPE_CODE = 'business_license'

function isPdfFileName(name: string | null) {
  if (!name) return false
  return name.toLowerCase().endsWith('.pdf')
}

export function useCompanyBusinessLicenseDocument(): CompanyBusinessLicenseDocState {
  const [status, setStatus] = useState<DocStatus>('loading')
  const [fileName, setFileName] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  const refresh = useCallback(async () => {
    setErrorMessage(null)
    setStatus('loading')

    try {
      const data = await getCompanyDocumentPreview(DOC_TYPE_CODE)
      setFileName(data.file_name ?? null)
      setPreviewUrl(data.preview_url ?? null)
      setStatus(data.preview_url ? 'ready' : 'empty')
    } catch (e: any) {
      // 문서 없음: 404 + { detail: "등록된 문서가 없습니다." }
      const msg = String(e?.message ?? '')
      if (msg.includes('등록된 문서가 없습니다')) {
        setFileName(null)
        setPreviewUrl(null)
        setStatus('empty')
        return
      }
      setFileName(null)
      setPreviewUrl(null)
      setStatus('error')
      setErrorMessage(msg || '문서 미리보기 조회 중 오류가 발생했습니다.')
    }
  }, [])

  const upload = useCallback(
    async (file: File) => {
      setIsBusy(true)
      setErrorMessage(null)
      try {
        await uploadCompanyDocument(DOC_TYPE_CODE, file)
        await refresh() // 업로드 응답에 preview_url이 없으므로 재조회
      } catch (e: any) {
        setStatus('error')
        setErrorMessage(String(e?.message ?? '문서 업로드 중 오류가 발생했습니다.'))
      } finally {
        setIsBusy(false)
      }
    },
    [refresh]
  )

  const remove = useCallback(async () => {
    setIsBusy(true)
    setErrorMessage(null)
    try {
      await deleteCompanyDocument(DOC_TYPE_CODE)
      // 삭제 후 empty 전환
      setFileName(null)
      setPreviewUrl(null)
      setStatus('empty')
    } catch (e: any) {
      setStatus('error')
      setErrorMessage(String(e?.message ?? '문서 삭제 중 오류가 발생했습니다.'))
    } finally {
      setIsBusy(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return useMemo(
    () => ({
      docTypeCode: DOC_TYPE_CODE,
      status,
      fileName,
      previewUrl,
      errorMessage,
      isBusy,
      refresh,
      upload,
      remove,
    }),
    [status, fileName, previewUrl, errorMessage, isBusy, refresh, upload, remove]
  )
}

export const companyDocUtils = { isPdfFileName }