'use client';

import { useState, useMemo } from 'react';
import type { BlogPostResponse } from '@/types/blog';

// HTML 태그 제거 및 문자열 자르기
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

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

export default function BlogSidebar({ postList }: { postList: BlogPostResponse[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return postList.filter((post) => {
      const title = post.title.toLowerCase();
      const content = stripHtml(post.content_md ?? '').toLowerCase();
      return title.includes(q) || content.includes(q);
    });
  }, [postList, searchQuery]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(start, start + itemsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">다른 글 보기</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="검색어 입력"
        className="w-full mb-4 px-3 py-2 border rounded text-sm"
      />
      <ul className="space-y-4">
        {paginatedPosts.map((post) => {
          const content = truncate(stripHtml(post.content_md ?? ''), 20);
          const href = `/blog/${post.slug ?? post.id}`;
          return (
            <li key={post.id}>
              <a
                href={href}
                className="block shadow-sm border rounded-md p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-800 text-sm truncate">{post.title}</h3>
                {content && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{content}</p>}
                {post.keywords && post.keywords.length > 0 && (
                  <ul className="text-gray-400 text-xs mt-2 flex flex-wrap gap-1">
                    {post.keywords.map((kw) => (
                      <li key={kw.id} className="bg-gray-100 px-2 py-1 rounded">
                        {kw.name}
                      </li>
                    ))}
                  </ul>
                )}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded text-sm ${
              page === currentPage ? 'bg-gray-200 font-bold' : ''
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}