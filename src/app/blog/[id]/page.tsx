import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { fetchBlogBySlug, fetchBlogList } from '@/service/blog';
import type { BlogPostResponse } from '@/types/blog';

// (선택) 정적 생성이 필요하면 slugs를 미리 받아오도록 변경 가능
// export async function generateStaticParams() {
//   const data = await fetchBlogList({ page: 1, page_size: 50, status: 'published' });
//   return (data.items || [])
//     .filter((p) => !!p.slug)
//     .map((p) => ({ id: p.slug as string }));
// }

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  // 현재 라우트 폴더가 [id]이므로, params.id를 slug로 사용
  const slug = params.id;

  let post: BlogPostResponse | null = null;
  try {
    post = await fetchBlogBySlug(slug);
  } catch (e) {
    // 404 등 오류 시
    return notFound();
  }
  if (!post) return notFound();

  // 사이드바용 최신 글 몇 개 로드 (UI/UX는 그대로, 데이터만 엔드포인트 기반)
  let sidebarList: BlogPostResponse[] = [];
  try {
    const list = await fetchBlogList({ page: 1, page_size: 10 });
    sidebarList = Array.isArray(list.items) ? list.items : [];
  } catch {}

  const dateObj = new Date(post.published_at ?? post.created_at);
  const date = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
  const author = post.author_name || '';
  const subtitle = post.subtitle || '';
  const image = post.thumbnail_url || null;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-12">
      <main className="flex-1 md:pr-8">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{author} · {date}</p>

        {image ? (
          <Image
            src={image}
            alt={post.title}
            width={1200}
            height={630}
            className="rounded-lg shadow-md w-full object-cover mb-6"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-lg mb-6 border" />
        )}

        {subtitle ? <h2 className="text-xl text-gray-700 mb-4">{subtitle}</h2> : null}

        <div className="prose max-w-none text-gray-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.content_md || ''}
          </ReactMarkdown>
        </div>
      </main>

     <aside className="w-full md:w-72 border-l p-4 fixed right-4 top-24">
        <BlogSidebar postList={sidebarList} />
        
        
      </aside>
    </div>
  );
}