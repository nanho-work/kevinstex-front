'use client';

import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const categoryColors: { [key: string]: string } = {
  '재밌는 세금 이야기': 'bg-yellow-100 text-yellow-800',
  '세무 정보': 'bg-blue-100 text-blue-800',
  '법인사업자': 'bg-purple-100 text-purple-800',
  '개인사업자': 'bg-green-100 text-green-800',
  '종합소득세': 'bg-pink-100 text-pink-800',
  '부가가치세': 'bg-indigo-100 text-indigo-800',
  '연말정산': 'bg-red-100 text-red-800',
  '부동산': 'bg-gray-100 text-gray-800',
};

interface BlogCardProps {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  author: string;
  keywords?: string[];
  category: string;
}

export default function BlogCard({ id, title, summary, image, date, author, keywords, category }: BlogCardProps) {
  return (
    <Link href={`/blog/${id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer border">
        <div className="relative w-full h-48">
          <span className={`absolute top-2 left-2 z-10 text-xs font-semibold px-2 py-0.5 rounded-full ${
            categoryColors[category] || 'bg-gray-200 text-gray-800'
          }`}>
            {category}
          </span>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
        <div className="p-3 bg-neutral-200">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{date}</span>
            <span>작성자: {author}</span>
          </div>
          {/* <div className="mb-1">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
              categoryColors[category] || 'bg-gray-200 text-gray-800'
            }`}>
              {category}
            </span>
          </div> */}
          <div className="relative group mb-2">
            <h3 className="text-lg font-semibold line-clamp-1 group-hover:line-clamp-none transition-all">
              {title}
            </h3>
          </div>
          <div className="relative group">
            <div className="text-gray-700 text-sm line-clamp-1 group-hover:line-clamp-none transition-all">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-1 overflow-x-auto">
            {keywords?.map((keyword, index) => (
              <span
                key={index}
                className="inline-block text-xs font-semibold bg-blue-200 text-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}