// services/kakaoService.ts
import { OFFICE_ADDRESS } from '@/constants/siteConfig'

function getApiBaseUrl() {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
  return (
    env?.NEXT_PUBLIC_API_BASE_URL ||
    env?.NEXT_PUBLIC_SERVER_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '')
}

export const fetchAddressCoords = async () => {
  const query = OFFICE_ADDRESS
  const baseUrl = getApiBaseUrl()
  const res = await fetch(`${baseUrl}/kakao/search-address?query=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('주소 검색 실패')
  const data = await res.json()
  console.log('전체 응답 data:', data)
  return data.documents[0]; // 가장 첫 결과 사용
};
