import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — GharKaMali | Professional Home Gardening',
  description: 'Learn about GharKaMali — our mission to make professional plant care accessible to every home in Noida, Greater Noida, and NCR.',
  keywords: ['about gharkamali', 'home gardening company noida', 'plant care service'],
  alternates: { canonical: 'https://gharkamali.com/about' },
  openGraph: {
    title: 'About GharKaMali — Professional Home Gardening',
    description: 'Our mission: reliable, affordable, expert plant care at your doorstep.',
    url: 'https://gharkamali.com/about',
    images: [{ url: 'https://gharkamali.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
