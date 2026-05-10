import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Gardener Visit — GharKaMali | ₹349 per Visit',
  description: 'Book a professional mali visit starting ₹349. Choose your date, plants, and location. Expert gardeners in Noida & Greater Noida.',
  keywords: ['book gardener noida', 'mali booking', 'plant care visit', 'book gardening service'],
  alternates: { canonical: 'https://gharkamali.com/book' },
  openGraph: {
    title: 'Book a Gardener Visit — GharKaMali ₹349',
    description: 'Professional plant care at your doorstep. Book in 60 seconds.',
    url: 'https://gharkamali.com/book',
    images: [{ url: 'https://gharkamali.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
