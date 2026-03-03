import { ImageResponse } from 'next/og';
import { getBlogPost, getAllBlogPosts } from '@content/blog-posts';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  const categoryColors: Record<string, string> = {
    writing: '#a78bfa',
    speaking: '#38bdf8',
    reading: '#2dd4bf',
    listening: '#fb923c',
    general: '#94a3b8',
    tips: '#f472b6',
  };

  const color = categoryColors[post?.category || 'general'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '100px',
              background: `${color}20`,
              border: `1px solid ${color}40`,
              color: color,
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            {post?.category?.toUpperCase() || 'BLOG'}
          </div>
          <div style={{ color: '#64748b', fontSize: '18px' }}>
            {post?.readTime}
          </div>
        </div>

        <div
          style={{
            fontSize: '52px',
            fontWeight: 800,
            color: '#f1f5f9',
            lineHeight: 1.15,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          {post?.title || 'CELPIP AI Coach Blog'}
        </div>

        <div
          style={{
            fontSize: '22px',
            color: '#94a3b8',
            lineHeight: 1.4,
            maxWidth: '800px',
            marginBottom: '40px',
          }}
        >
          {post?.description?.slice(0, 120)}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#ff3b3b',
            }}
          >
            🍁 CELPIP AI Coach
          </div>
          <div style={{ color: '#475569', fontSize: '18px' }}>
            — celpipaicoach.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
