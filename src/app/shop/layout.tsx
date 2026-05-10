import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plant Store — Buy Plants, Pots & Garden Products | GharKaMali',
  description: 'Shop premium plants, pots, organic fertilizers, and garden tools online. Delivered to your doorstep in Noida & Greater Noida.',
  keywords: ['buy plants online', 'plant store noida', 'garden products', 'pots online', 'organic fertilizer', 'gharkamali shop'],
  alternates: { canonical: 'https://gharkamali.com/shop' },
  openGraph: {
    title: 'GharKaMali Plant Store — Premium Garden Products',
    description: 'Buy plants, pots, tools and garden essentials online. Fast delivery in Noida & Greater Noida.',
    url: 'https://gharkamali.com/shop',
    images: [{ url: 'https://gharkamali.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
