// /services/newsService.ts

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

export async function fetchNews(query: string, display: number = 5) {
  const url = `${BASE_URL}/naver/news?query=${encodeURIComponent(query)}&display=${display}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`GET /naver/news failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}