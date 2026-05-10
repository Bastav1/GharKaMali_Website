import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gardening Blog — Plant Care Tips & Guides | GharKaMali',
  description: 'Read expert plant care tips, seasonal gardening guides, and home garden advice from GharKaMali\'s certified botanists.',
  keywords: ['gardening tips india', 'plant care guide', 'home garden blog', 'indoor plants care'],
  alternates: { canonical: 'https://gharkamali.com/blogs' },
  openGraph: {
    title: 'GharKaMali Blog — Gardening Tips & Plant Care',
    description: 'Expert advice on growing and maintaining a beautiful home garden.',
    url: 'https://gharkamali.com/blogs',
    images: [{ url: 'https://gharkamali.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
