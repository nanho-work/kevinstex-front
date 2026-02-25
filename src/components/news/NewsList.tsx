interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

interface NewsListProps {
  newsItems: NewsItem[];
}

export default function NewsList({ newsItems }: NewsListProps) {
  return (
    <ul className="space-y-6">
      {newsItems.map((item, index) => (
        <li
          key={index}
          className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition"
        >
          {/* 배지 */}
          <p className="text-xs tracking-widest text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded mb-3">
            TAX ISSUE
          </p>

          {/* 제목 */}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-lg font-semibold text-gray-900 hover:underline"
            dangerouslySetInnerHTML={{ __html: item.title }}
          />

          {/* 설명 */}
          <div
            className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />

          {/* 날짜 + 출처 */}
          <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
            <span>
              {new Date(item.pubDate).toLocaleDateString()}
            </span>
            <span className="text-gray-600 hover:text-gray-900">
              출처 보기 →
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}