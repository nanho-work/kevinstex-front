// 상태 타입 (백엔드 Literal과 매칭)
export type StatusType = 'draft' | 'published' | 'archived';

// 블로그 카테고리
export interface BlogCategoryResponse {
  id: number;
  name: string | null;
  slug: string;
  created_at: string; // datetime → string
  updated_at: string;
  post_count: number;
}

// 키워드(태그)
export interface KeywordResponse {
  id: number;
  name: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

// 블로그 포스트 (응답)
export interface BlogPostResponse {
  id: number;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  content_md: string;
  thumbnail_url?: string | null;
  author_name?: string | null;
  category_id: number;
  slug?: string | null;
  status: StatusType;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  category?: BlogCategoryResponse | null;
  keywords: KeywordResponse[];
}

// 블로그 포스트 리스트 응답
export interface BlogListResponse {
  items: BlogPostResponse[];
  total: number;
  page: number;
  page_size: number;
}