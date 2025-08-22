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
                <li key={index} className="border-b pb-4">
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-700 hover:underline"
                        dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                        {new Date(item.pubDate).toLocaleDateString()}
                    </p>
                    <div
                        className="text-gray-700 text-sm mt-2 break-words line-clamp-2 max-w-4xl"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                </li>
            ))}
        </ul>
    );
}