import { notFound } from 'next/navigation';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { fetchBlogBySlug, fetchBlogList } from '@/service/blog';
import type { BlogPostResponse } from '@/types/blog';
import BlogDetailContent from '@/components/blog/BlogDetail';

export default async function BlogDetailPage(props: { params: Promise<{ id: string }> }) {
  const p = await props.params; // await first
  const slug = p.id;            // then access property

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

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-12">
      <main className="flex-1 md:pr-8">
        <BlogDetailContent post={post} />
      </main>

      <aside className="w-full md:w-72  p-4 fixed right-4 top-24 mr-20">
        <BlogSidebar postList={sidebarList} />
      </aside>
    </div>
  );
}