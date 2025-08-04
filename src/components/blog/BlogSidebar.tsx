// BlogSidebar.tsx
'use client';

import { useState, useMemo } from 'react';
import type { BlogPost } from '@/data/blogContents';

export default function BlogSidebar({ postList }: { postList: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPosts = useMemo(() => {
    return postList.filter(post =>
      post.title.includes(searchQuery) ||
      (post.summary?.includes(searchQuery) ?? false)
    );
  }, [postList, searchQuery]);

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
        {filteredPosts.map(post => (
          <li key={post.id}>
            <a
              href={`/blog/${post.id}`}
              className="block bg-white shadow-sm border rounded-md p-4 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-800 text-sm truncate">{post.title}</h3>
              {post.summary && (
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{post.summary}</p>
              )}
              {post.date && (
                <p className="text-gray-400 text-xs mt-2">{post.date}</p>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}