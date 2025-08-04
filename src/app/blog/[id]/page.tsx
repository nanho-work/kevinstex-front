import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { samplePosts } from '@/data/blogContents';
import BlogSidebar from '@/components/blog/BlogSidebar';

export async function generateStaticParams() {
    return samplePosts.map((post) => ({
        id: post.id,
    }));
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
    const post = samplePosts.find((p) => p.id === params.id);

    if (!post) return notFound();

    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-12">
            <main className="flex-1 md:pr-8">
                <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
                <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="rounded-lg shadow-md w-full object-cover mb-6"
                />
                <h2 className="text-xl text-gray-700 mb-4">{post.subtitle}</h2>
                <p className="text-sm text-gray-500 mb-6 text-right">작성자: {post.author}</p>
                <div className="prose max-w-none text-gray-800">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </main>
            <aside className="w-full md:w-72 bg-gray-50 border-l p-4 sticky top-20 mt-8 md:mt-0 self-start">
                <BlogSidebar postList={samplePosts} />
            </aside>
        </div>
    );
}