'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import BlogCard from './BlogCard';
import { fetchBlogList } from '@/service/blog';
import type { BlogPostResponse } from '@/types/blog';

// HTML 태그 제거(요약/검색용)
const stripHtml = (html: string) =>
  html
    ? html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    : '';

export default function BlogSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  const [items, setItems] = useState<BlogPostResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 엔드포인트: 목록 호출
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBlogList({ page, page_size: 9, status: 'draft' });
        if (!ignore) {
          setItems((prev) => [...prev, ...(Array.isArray(data.items) ? data.items : [])]);
          if (data.items.length < 9) setHasMore(false);
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message || '블로그 글을 불러오지 못했습니다.');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [page]);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore]);

  const categories = useMemo(() => {
    const names = items
      .map((p) => p.category?.name)
      .filter((n): n is string => typeof n === 'string' && n.length > 0);
    return Array.from(new Set(names));
  }, [items]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    const list = items
      .filter((post) => {
        const inCategory = !selectedCategory || post.category?.name === selectedCategory;
        const inKeyword =
          !selectedKeyword ||
          (post.keywords || []).some((k) => (k?.name || '') === selectedKeyword);

        const summarySource =
          (post as any).summaryHtml ??
          (post as any).contentHtml ??
          post.summary ??
          post.content_md ??
          '';

        const textForSearch = `${post.title} ${
          typeof summarySource === 'string' ? stripHtml(summarySource) : ''
        }`.toLowerCase();

        const inSearch = normalizedSearch.length === 0 || textForSearch.includes(normalizedSearch);
        return inCategory && inKeyword && inSearch;
      })
      .sort((a, b) => {
        const aDate = (a.published_at ?? a.created_at) || '';
        const bDate = (b.published_at ?? b.created_at) || '';
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });

    return list;
  }, [items, normalizedSearch, selectedCategory, selectedKeyword]);

  const filteredKeywords = useMemo(() => {
    const names = filteredPosts.flatMap((post) => (post.keywords || []).map((k) => k?.name || ''));
    const filtered = names.filter((n): n is string => typeof n === 'string' && n.length > 0);
    return Array.from(new Set(filtered));
  }, [filteredPosts]);

  return (
    <section className="max-w-screen-xl mx-auto">
      <div className="mb-4 md:flex md:items-end md:justify-between md:gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Blog</h1>
          <p className="text-lg text-gray-700 mt-2">
            The Kevin’s Tax Lab 블로그입니다. <span className="text-sm text-gray-600 ml-2">현직 세무 전문가가 알려주는 실무 중심의 세금 정보.</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xs border rounded px-4 py-2"
          />
        </div>
      </div>

      <div className="flex gap-3 mb-4 text-sm font-medium text-gray-700">
        <button
          className={`px-4 py-1 border rounded-full ${
            selectedCategory === null ? 'bg-blue-300' : 'hover:bg-gray-100'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          전체
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-1 border rounded-full ${
              selectedCategory === category ? 'bg-blue-300' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6 text-sm text-gray-700">
        {filteredKeywords.map((keyword, idx) => (
          <button
            key={`${keyword}-${idx}`}
            onClick={() => setSelectedKeyword(keyword === selectedKeyword ? null : keyword)}
            className={`px-3 py-1 rounded-full cursor-pointer transition ${
              selectedKeyword === keyword ? 'bg-blue-300 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            #{keyword}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500 mb-4">불러오는 중…</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid md:grid-cols-3 gap-8">
        {filteredPosts.map((post) => {
          const summarySource =
            (post as any).summaryHtml ??
            (post as any).contentHtml ??
            post.summary ??
            post.content_md ??
            '';
          const plainSummary = typeof summarySource === 'string' ? stripHtml(summarySource) : '';

          return (
            <BlogCard
              key={post.id}
              id={post.id}
              slug={post.slug}
              title={post.title}
              summary={plainSummary} // 카드에서는 HTML 제거된 요약 사용
              image={post.thumbnail_url || null}
              date={(post.published_at ?? post.created_at) || post.created_at}
              author={post.author_name || ''}
              keywords={(post.keywords || []).map((k) => k?.name || '').filter(Boolean)}
              category={post.category?.name || ''}
            />
          );
        })}
        <div ref={lastElementRef} />
      </div>

      {/* (선택) 사이드바 같이 쓰는 경우 */}
      {/* <div className="mt-10">
        <BlogSidebar postList={items} />
      </div> */}
    </section>
  );
}