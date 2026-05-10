import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monthly Plant Care Plans — GharKaMali | Starting ₹349',
  description: 'Choose from flexible monthly gardening subscription plans. Regular mali visits, plant health reports, and 24/7 support. Starting ₹349.',
  keywords: ['monthly gardening plan', 'plant care subscription', 'mali subscription noida', 'gardening package'],
  alternates: { canonical: 'https://gharkamali.com/plans' },
  openGraph: {
    title: 'Monthly Plant Care Plans — GharKaMali',
    description: 'Affordable monthly plans for professional home garden care. Book your first visit today.',
    url: 'https://gharkamali.com/plans',
    images: [{ url: 'https://gharkamali.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
