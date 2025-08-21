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
  id: number | string;
  slug?: string | null;
  title: string;
  summary?: string | null;
  image?: string | null; // 썸네일 null 허용
  date: string;
  author?: string | null;
  keywords?: string[];
  category?: string | null;
}

export default function BlogCard({
  id,
  slug,
  title,
  summary,
  image,
  date,
  author,
  keywords,
  category,
}: BlogCardProps) {
  // 빈/널 방어로 next/image 경고 방지
  const imgSrc = typeof image === 'string' && image.trim().length > 0 ? image : null;
  // 상세 링크: slug 우선
  const href = `/blog/${slug ?? id}`;

  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow hover:shadow-md hover:scale-[1.02] transform transition duration-200 cursor-pointer border">
        <div className="relative w-full h-48">
          {category ? (
            <span
              className={`absolute top-2 left-2 z-10 text-xs font-semibold px-2 py-0.5 rounded-full ${
                categoryColors[category] || 'bg-gray-200 text-gray-800'
              }`}
            >
              {category}
            </span>
          ) : null}

          {imgSrc ? (
            <Image src={imgSrc} alt={title} fill className="object-cover rounded-t-lg" />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-t-lg border border-gray-200" />
          )}
        </div>

        <div className="p-3 bg-blue-50">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{new Date(date).toLocaleDateString('ko-KR')}</span>
            <span>작성자: {author || ''}</span>
          </div>

          <div className="relative group mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">
              {title}
            </h3>
          </div>

          <div className="relative group">
            <div className="text-gray-700 text-sm line-clamp-1">
              <ReactMarkdown>{summary || ''}</ReactMarkdown>
            </div>
          </div>

          {keywords && keywords.length > 0 ? (
            <div className="mt-2 flex justify-end gap-1 overflow-x-auto">
              {keywords.map((keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  className="inline-block text-xs font-semibold bg-blue-200 text-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}