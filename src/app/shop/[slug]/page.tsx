'use client';
import { useParams } from 'next/navigation';
import ProductClient from './ProductClient';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  return <ProductClient slug={slug} />;
}
