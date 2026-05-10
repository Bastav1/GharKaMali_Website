import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — GharKaMali | Talk to Our Gardening Experts',
  description: 'Get in touch with GharKaMali. Chat on WhatsApp, call, or email. We serve Noida, Greater Noida, and NCR.',
  keywords: ['contact gharkamali', 'gardening service contact', 'mali contact noida'],
  alternates: { canonical: 'https://gharkamali.com/contact' },
  openGraph: {
    title: 'Contact GharKaMali — We Are Here to Help',
    description: 'Reach out to our team for bookings, queries, or support.',
    url: 'https://gharkamali.com/contact',
    images: [{ url: 'https://gharkamali.com/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
