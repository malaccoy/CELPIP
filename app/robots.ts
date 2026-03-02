import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/profile', '/progress', '/weakness-report'],
      },
    ],
    sitemap: 'https://celpipaicoach.com/sitemap.xml',
  };
}
