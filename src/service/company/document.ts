

/**
 * 회사 포털(홈페이지) 문서(프라이빗) 전용 서비스 파일
 *
 * 백엔드 엔드포인트
 * - GET    /company/documents/types
 * - POST   /company/documents/{doc_type_code}
 * - GET    /company/documents/{doc_type_code}/preview
 * - DELETE /company/documents/{doc_type_code}
 *
 * 인증
 * - Authorization: Bearer <access_token>
 * - access_token은 auth.ts에서 localStorage에 저장/관리
 */

import { companyAuth } from '@/service/company/auth'
import type {
  CompanyDocumentType,
  CompanyDocument,
  CompanyDocumentPreviewResponse,
  CompanyDocumentDeleteResponse,
} from '@/types/company'

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '')
}

function authHeaders(): Record<string, string> {
  const token = companyAuth.getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json()
    if (data?.detail) return String(data.detail)
    return JSON.stringify(data)
  } catch {
    try {
      return await res.text()
    } catch {
      return `HTTP ${res.status}`
    }
  }
}

/**
 * 문서 타입 목록 조회
 * GET /company/documents/types
 */
export async function getCompanyDocumentTypes(): Promise<CompanyDocumentType[]> {
  const baseUrl = getBaseUrl()

  const res = await fetch(`${baseUrl}/company/documents/types`, {
    method: 'GET',
    headers: {
      ...authHeaders(),
    },
  })

  if (!res.ok) {
    if (res.status === 401) companyAuth.clearToken()
    throw new Error(await parseError(res))
  }

  return (await res.json()) as CompanyDocumentType[]
}

/**
 * 문서 업로드
 * POST /company/documents/{doc_type_code}
 */
export async function uploadCompanyDocument(
  docTypeCode: string,
  file: File
): Promise<CompanyDocument> {
  const baseUrl = getBaseUrl()

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${baseUrl}/company/documents/${encodeURIComponent(docTypeCode)}`, {
    method: 'POST',
    headers: {
      // FormData 사용 시 Content-Type을 수동으로 지정하지 않습니다.
      ...authHeaders(),
    },
    body: formData,
  })

  if (!res.ok) {
    if (res.status === 401) companyAuth.clearToken()
    throw new Error(await parseError(res))
  }

  return (await res.json()) as CompanyDocument
}

/**
 * 문서 미리보기 Presigned URL 조회
 * GET /company/documents/{doc_type_code}/preview
 */
export async function getCompanyDocumentPreview(
  docTypeCode: string,
  opts?: { expiresIn?: number }
): Promise<CompanyDocumentPreviewResponse> {
  const baseUrl = getBaseUrl()

  const url = new URL(`${baseUrl}/company/documents/${encodeURIComponent(docTypeCode)}/preview`)
  if (opts?.expiresIn) {
    url.searchParams.set('expires_in', String(opts.expiresIn))
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      ...authHeaders(),
    },
  })

  if (!res.ok) {
    if (res.status === 401) companyAuth.clearToken()
    throw new Error(await parseError(res))
  }

  return (await res.json()) as CompanyDocumentPreviewResponse
}

/**
 * 문서 삭제(소프트 삭제)
 * DELETE /company/documents/{doc_type_code}
 */
export async function deleteCompanyDocument(
  docTypeCode: string
): Promise<CompanyDocumentDeleteResponse> {
  const baseUrl = getBaseUrl()

  const res = await fetch(`${baseUrl}/company/documents/${encodeURIComponent(docTypeCode)}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  })

  if (!res.ok) {
    if (res.status === 401) companyAuth.clearToken()
    throw new Error(await parseError(res))
  }

  return (await res.json()) as CompanyDocumentDeleteResponse
}

/**
 * (옵션) 브라우저에서 새 탭으로 미리보기 열기
 * - presigned url을 받아온 뒤 window.open
 */
export async function openCompanyDocumentPreview(docTypeCode: string) {
  const data = await getCompanyDocumentPreview(docTypeCode)
  if (typeof window !== 'undefined' && data?.preview_url) {
    window.open(data.preview_url, '_blank', 'noopener,noreferrer')
  }
  return data
}