import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers — Join GharKaMali | Gardening Jobs in Noida',
  description: 'Join the GharKaMali team. We are hiring certified plant experts, customer support, and growth professionals.',
  keywords: ['gardening jobs noida', 'mali jobs', 'gharkamali careers', 'plant expert jobs'],
  alternates: { canonical: 'https://gharkamali.com/careers' },
  openGraph: {
    title: 'Careers at GharKaMali — Grow With Us',
    description: 'Be part of India\'s most trusted home gardening platform.',
    url: 'https://gharkamali.com/careers',
    images: [{ url: 'https://gharkamali.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
