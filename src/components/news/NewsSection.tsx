'use client';

import { useState, useEffect } from 'react';
import NewsTabBar from './NewsTabBar';
import NewsList from './NewsList';
import { fetchNews } from '@/service/newsService';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export default function NewsSection() {
  const [selectedTopic, setSelectedTopic] = useState('종합소득세');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchNews(selectedTopic).then((data) => {
      const filteredItems = (data.items as NewsItem[]).filter(
        (item) =>
          !item.title.includes('세무법인') &&
          !item.description.includes('세무법인')
      );
      setNewsItems(filteredItems);
    });
  }, [selectedTopic]);

  return (
  <section className="bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="mb-10">
          <p className="text-xs tracking-widest text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded">
            INSIGHT
          </p>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
            최신 세무 이슈 브리핑
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            대표 세무사가 선별한 주요 세무 · 조세 관련 이슈를 정리하여 제공합니다.
          </p>
        </div>

        <NewsTabBar
          selectedQuery={selectedTopic}
          setSelectedQuery={setSelectedTopic}
        />

        <NewsList newsItems={newsItems} />
      </div>
    </section>
  );
}