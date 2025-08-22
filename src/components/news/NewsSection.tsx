'use client';

import { useState, useEffect } from 'react';
import NewsTabBar from './NewsTabBar';
import NewsList from './NewsList';
import { fetchNews } from '@/service/newsService';

// 1. NewsItem 타입 정의 (중복 방지를 위해 별도 파일로 분리해도 좋음)
interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
}

export default function NewsSection() {
    const [selectedTopic, setSelectedTopic] = useState('종합소득세');
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]); // 여기도 타입 지정

    useEffect(() => {
        fetchNews(selectedTopic).then((data) => {
            const filteredItems = (data.items as NewsItem[]).filter((item) =>
                !item.title.includes('세무법인') &&
                !item.description.includes('세무법인')
            );
            setNewsItems(filteredItems);
        });
    }, [selectedTopic]);

    return (
        <section className="py-12 ">
            <div className=" mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">최신 세무 뉴스</h2>
                <NewsTabBar selectedQuery={selectedTopic} setSelectedQuery={setSelectedTopic} />
                <div className="mt-6">
                    <NewsList newsItems={newsItems} />
                </div>
            </div>
        </section>
    );
}