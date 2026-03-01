/**
 * 회사 포털(홈페이지) 전용 서비스 파일
 * - POST /company/login 에서 발급받은 Bearer access token 사용
 * - access token은 브라우저 localStorage에 저장
 * - 현재 사용하는 백엔드 엔드포인트:
 *   - POST /company/login
 *   - GET  /company/session
 */

// (선택) 공통 API 클라이언트(axios/fetch 래퍼)가 있다면 그쪽으로 리팩토링해도 됩니다.
// 이 파일은 결합도를 낮추기 위해 native fetch를 사용합니다.

import type {
  CompanyLoginRequest,
  CompanyLoginResponse,
  CompanySession,
  CompanyChangePasswordRequest,
  CompanyChangePasswordResponse,
} from '@/types/company'

const TOKEN_KEY = 'company_access_token'

function getBaseUrl() {
  // Prefer a dedicated env var. Fallbacks are safe for local dev.
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '')
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

function setToken(token: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_KEY, token)
}

function clearToken() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json()
    // FastAPI typical error format: { detail: "..." }
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
 * POST /company/login
 * Returns access_token and stores it in localStorage by default.
 */
export async function companyLogin(
  payload: CompanyLoginRequest,
  opts?: { persistToken?: boolean }
): Promise<CompanyLoginResponse> {
  const baseUrl = getBaseUrl()

  const res = await fetch(`${baseUrl}/company/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(await parseError(res))
  }

  const data = (await res.json()) as CompanyLoginResponse

  // persist by default
  if (opts?.persistToken !== false) {
    if (data?.access_token) setToken(data.access_token)
  }

  return data
}

/**
 * GET /company/session
 * Requires Authorization: Bearer <token>
 */
export async function getCompanySession(): Promise<CompanySession> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/company/session`, {
    method: 'GET',
    headers: {
      ...authHeaders(),
    },
  })

  if (!res.ok) {
    // If session check fails, token is likely invalid/expired -> clear for safety
    if (res.status === 401) clearToken()
    throw new Error(await parseError(res))
  }

  return (await res.json()) as CompanySession
}

/**
 * PATCH /company/password
 * Authorization: Bearer <token>
 * 현재 비밀번호 확인 후 새 비밀번호로 변경합니다.
 */
export async function changeCompanyPassword(
  payload: CompanyChangePasswordRequest
): Promise<CompanyChangePasswordResponse> {
  const baseUrl = getBaseUrl()

  const res = await fetch(`${baseUrl}/company/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    // 비밀번호 변경 실패(401 포함) 시에는 토큰을 지우지 않습니다.
    // (토큰이 만료된 경우는 /company/session 체크에서 정리)
    throw new Error(await parseError(res))
  }

  return (await res.json()) as CompanyChangePasswordResponse
}

/**
 * Client-side logout (backend has no logout endpoint in MVP).
 */
export function companyLogout() {
  clearToken()
}

/**
 * Utilities exposed for UI/auth guards.
 */
export const companyAuth = {
  getToken,
  setToken,
  clearToken,
}
