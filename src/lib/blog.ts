import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const blogDir = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  readTime: number;
  image?: string;
  cta: { text: string; href: string };
  content: string;
  htmlContent?: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) return [];
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: file.replace(/\.md$/, ''),
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      updated: data.updated,
      category: data.category || 'General',
      tags: data.tags || [],
      readTime: data.readTime || Math.ceil(content.split(/\s+/).length / 200),
      image: data.image,
      cta: data.cta || { text: 'Start Practicing Free', href: '/map' },
      content,
    } as BlogPost;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(blogDir)) return [];
  return fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(blogDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  
  const result = await remark().use(html, { sanitize: false }).process(content);
  
  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    updated: data.updated,
    category: data.category || 'General',
    tags: data.tags || [],
    readTime: data.readTime || Math.ceil(content.split(/\s+/).length / 200),
    image: data.image,
    cta: data.cta || { text: 'Start Practicing Free', href: '/map' },
    content,
    htmlContent: result.toString(),
  };
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  return [...new Set(posts.map(p => p.category))];
}
