import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@content/blog-posts';

const BASE_URL = 'https://celpipaicoach.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // High priority - main pages
  const mainPages = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/pricing', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/dashboard', priority: 0.8, changeFrequency: 'daily' as const },
  ];

  // Section hubs
  const sectionPages = [
    { url: '/listening', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/reading', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/writing', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/speaking', priority: 0.9, changeFrequency: 'weekly' as const },
  ];

  // Technique guides (high SEO value - free content)
  const techniquePages = [
    { url: '/listening/technique', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/reading/technique', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/writing/mastery', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/speaking/technique', priority: 0.85, changeFrequency: 'monthly' as const },
  ];

  // Practice pages
  const practicePages = [
    { url: '/reading/practice', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/writing/task-1', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/writing/task-2', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/writing/starters', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/writing/guide', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  // Pro features
  const proPages = [
    { url: '/ai-coach', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/writing/ai-tutor', priority: 0.75, changeFrequency: 'weekly' as const },
    { url: '/mock-exam', priority: 0.75, changeFrequency: 'weekly' as const },
    { url: '/tools/score-calculator', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/tools/practice-timer', priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  // Auth pages
  const authPages = [
    { url: '/auth/login', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/auth/register', priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  const allPages = [...mainPages, ...sectionPages, ...techniquePages, ...practicePages, ...proPages, ...authPages];

  // Blog posts
  const blogPages = getAllBlogPosts().map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Blog index
  const blogIndex = {
    url: `${BASE_URL}/blog`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  };

  return [
    ...allPages.map(page => ({
      url: `${BASE_URL}${page.url}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    blogIndex,
    ...blogPages,
  ];
}
