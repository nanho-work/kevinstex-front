// src/service/blog.ts
import type { BlogListResponse, BlogPostResponse } from '@/types/blog';

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

// 공통: 쿼리스트링 빌더
function toQS(params: Record<string, unknown> = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    qs.set(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
}

/** 블로그 목록 조회 (필수) */
export async function fetchBlogList(params: {
  page?: number;
  page_size?: number;
  category_id?: number;
  keyword_id?: number;
  status?: 'draft' | 'published' | 'archived';
  q?: string;
} = {}): Promise<BlogListResponse> {
  const url = `${BASE_URL}/blog/posts${toQS(params)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store', // CSR/MVP는 최신 우선. RSC/ISR 쓰면 제거하고 revalidate 사용
  });
  if (!res.ok) {
    throw new Error(`GET /blog/posts failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<BlogListResponse>;
}

/** (선택) 슬러그로 단건 조회 — 상세 페이지용 */
export async function fetchBlogBySlug(slug: string): Promise<BlogPostResponse> {
  const url = `${BASE_URL}/blog/posts/slug/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`GET /blog/posts/slug/${slug} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<BlogPostResponse>;
}

/** (선택) 카테고리 목록 — 필터 UI에 필요하면 사용 */
export async function fetchBlogCategories(): Promise<
  { id: number; name: string; slug: string; created_at: string; updated_at: string }[]
> {
  const url = `${BASE_URL}/blog/categories`;
  const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`GET /blog/categories failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** (선택) 키워드 목록 — 필터 UI에 필요하면 사용 */
export async function fetchBlogKeywords(): Promise<
  { id: number; name: string; slug: string; created_at: string; updated_at: string }[]
> {
  const url = `${BASE_URL}/blog/keywords`;
  const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`GET /blog/keywords failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}