import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Garden & Balcony Makeover — GharKaMali | Transform Your Space',
  description: 'Complete garden and balcony makeover services in Noida & Greater Noida. Expert landscape design, plant setup, and ongoing care.',
  keywords: ['balcony makeover noida', 'garden makeover', 'landscape design noida', 'balcony garden setup'],
  alternates: { canonical: 'https://gharkamali.com/green-makeover' },
  openGraph: {
    title: 'Garden Makeover Services — GharKaMali',
    description: 'Transform your balcony or garden with expert design and plant care.',
    url: 'https://gharkamali.com/green-makeover',
    images: [{ url: 'https://gharkamali.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function GreenMakeoverLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
