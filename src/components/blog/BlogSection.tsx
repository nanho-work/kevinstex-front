'use client';

import { useState } from 'react';
import BlogCard from './BlogCard';
import { samplePosts } from '@/data/blogContents';

export default function BlogSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  const filteredPosts = samplePosts.filter(
    (post) =>
      (!selectedCategory || post.category === selectedCategory) &&
      (!selectedKeyword || (post.keywords || []).includes(selectedKeyword)) &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredKeywords = Array.from(
    new Set(
      filteredPosts.flatMap((post) => post.keywords || [])
    )
  );

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded px-4 py-2"
        />
      </div>
      <div className="flex gap-3 mb-6 text-sm font-medium text-gray-700">
        <button
          className={`px-4 py-1 border rounded-full ${selectedCategory === null ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          onClick={() => setSelectedCategory(null)}
        >
          전체
        </button>
        {Array.from(new Set(samplePosts.map((post) => post.category))).map((category, idx) => (
          <button
            key={idx}
            className={`px-4 py-1 border rounded-full ${
              selectedCategory === category ? 'bg-gray-200' : 'hover:bg-gray-100'
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
            key={idx}
            onClick={() => setSelectedKeyword(keyword === selectedKeyword ? null : keyword)}
            className={`px-3 py-1 rounded-full cursor-pointer transition ${
              selectedKeyword === keyword ? 'bg-blue-300 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            #{keyword}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            title={post.title}
            summary={post.summary}
            image={post.image}
            date={post.date}
            author={post.author}
            keywords={post.keywords}
            category={post.category}
          />
        ))}
      </div>
    </section>
  );
}