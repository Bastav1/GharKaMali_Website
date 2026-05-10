import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plantopedia — Plant Encyclopedia & Care Guide | GharKaMali',
  description: 'Explore our complete plant encyclopedia. Learn how to grow, water, and care for hundreds of indoor and outdoor plants.',
  keywords: ['plant encyclopedia india', 'plant care guide', 'plantopedia', 'how to grow plants'],
  alternates: { canonical: 'https://gharkamali.com/plantopedia' },
  openGraph: {
    title: 'Plantopedia — Plant Care Encyclopedia by GharKaMali',
    description: 'Your complete guide to growing and caring for plants at home.',
    url: 'https://gharkamali.com/plantopedia',
    images: [{ url: 'https://gharkamali.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function PlantopediaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
