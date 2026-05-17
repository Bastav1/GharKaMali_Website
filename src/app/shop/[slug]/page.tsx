'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/store/cart';
import { getShopProducts } from '@/lib/api';
import toast from 'react-hot-toast';

/* ── ICONS ── */
const IcCart  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const IcStar  = ({ f = true }: { f?: boolean }) => <svg width="14" height="14" viewBox="0 0 24 24" fill={f ? '#C9A84C' : 'none'} stroke="#C9A84C" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcLeaf  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
const IcCheck = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcTruck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IcShield= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcBack  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const IcWA    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

const WA_URL = 'https://wa.me/919876543210?text=Hi%20GharKaMali!%20I%20want%20to%20know%20more%20about%20a%20product.';
const PLACEHOLDER = 'https://images.unsplash.com/photo-1597055110188-591ff1130d2e?w=800&h=800&fit=crop';

export default function ProductDetailPage() {
  const params  = useParams();
  const slug    = params?.slug as string;

  const [product, setProduct]   = useState<any>(null);
  const [related, setRelated]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty]           = useState(1);
  const [zoomed, setZoomed]     = useState(false);
  const [zoomPos, setZoomPos]   = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'faqs' | 'reviews'>('description');
  const imgRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCart();

  /* ── Fetch all products and find match ── */
  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    getShopProducts({ limit: 100 })
      .then((all: any) => {
        const list: any[] = Array.isArray(all) ? all : [];
        // Match by id, slug, or _id
        const found = list.find(
          (p: any) =>
            String(p.id)    === slug ||
            String(p._id)   === slug ||
            String(p.slug)  === slug
        );
        setProduct(found ?? null);
        // Related = same category, excluding current
        if (found) {
          setRelated(
            list
              .filter((p: any) =>
                String(p.id) !== slug &&
                String(p._id) !== slug &&
                p.category?.name === found.category?.name
              )
              .slice(0, 4)
          );
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── GSAP entrance ── */
  useEffect(() => {
    if (!product) return;
    const run = async () => {
      const gsap = (await import('gsap')).default;
      gsap.fromTo('.pdp-gallery', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 });
      gsap.fromTo('.pdp-info',    { opacity: 0, x:  30 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.2 });
    };
    run();
  }, [product]);

  const images: string[] = product?.images?.length
    ? product.images
    : product?.thumbnail ? [product.thumbnail] : [PLACEHOLDER];

  const price = Number(product?.price ?? 0);
  const mrp   = Number(product?.mrp   ?? 0);
  const disc  = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price,
        mrp,
        category: product.category?.name || 'General',
        icon: product.icon_key || 'default',
      });
    }
    toast.success(`${qty}× ${product.name} added!`, { duration: 2000 });
  };

  /* ── Skeleton ── */
  if (loading) return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100svh', background: 'var(--bg)' }}>
        <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
            <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: 28 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[60, 90, 40, 70, 50, 100].map((w, i) => (
                <div key={i} className="skeleton" style={{ height: i === 1 ? 40 : 22, width: `${w}%`, borderRadius: 10 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

  /* ── Not found ── */
  if (!product) return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '80svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', textAlign: 'center', gap: 16, padding: 48 }}>
        <div style={{ color: 'var(--forest)', opacity: 0.3 }}><IcLeaf /></div>
        <h2 style={{ color: 'var(--forest)', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-2)', maxWidth: 400, lineHeight: 1.7 }}>This product may have been removed or the link is incorrect.</p>
        <Link href="/shop" style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'var(--forest)', color: '#fff', borderRadius: 14, fontWeight: 700, textDecoration: 'none' }}>
          <IcBack /> Back to Shop
        </Link>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100svh', background: 'var(--bg)' }}>

        {/* Breadcrumb */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <Link href="/"    style={{ color: 'var(--forest)', fontWeight: 600, textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/shop" style={{ color: 'var(--forest)', fontWeight: 600, textDecoration: 'none' }}>Shop</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{product.name}</span>
          </div>
        </div>

        <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>

          {/* ── MAIN GRID ── */}
          <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'start' }}>

            {/* LEFT — Gallery */}
            <div className="pdp-gallery" style={{ opacity: 0 }}>
              {/* Main image + zoom */}
              <div
                ref={imgRef}
                style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', aspectRatio: '1/1', background: 'var(--bg-elevated)', border: '1.5px solid var(--border-gold)', boxShadow: 'var(--sh-md)', cursor: zoomed ? 'crosshair' : 'zoom-in' }}
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
                onMouseMove={(e) => {
                  if (!imgRef.current) return;
                  const r = imgRef.current.getBoundingClientRect();
                  setZoomPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
                }}
              >
                <img
                  src={images[activeImg] || PLACEHOLDER}
                  alt={product.name}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: zoomed ? 'scale(2)' : 'scale(1)',
                    transition: zoomed ? 'none' : 'transform 0.3s ease',
                    pointerEvents: 'none',
                  }}
                />
                {/* Badges */}
                {product.badge && <div style={{ position: 'absolute', top: 18, left: 18, background: 'var(--forest)', color: '#fff', padding: '7px 18px', borderRadius: 10, fontWeight: 800, fontSize: '0.8rem' }}>{product.badge}</div>}
                {disc > 0 && <div style={{ position: 'absolute', top: 18, right: 18, background: '#16a34a', color: '#fff', padding: '7px 14px', borderRadius: 10, fontWeight: 800, fontSize: '0.8rem' }}>{disc}% OFF</div>}
                {/* Zoom hint */}
                <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: '5px 10px', fontSize: '0.72rem', color: 'var(--forest)', fontWeight: 700, backdropFilter: 'blur(8px)', display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                  🔍 Hover to zoom
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} style={{ flexShrink: 0, width: 76, height: 76, borderRadius: 12, overflow: 'hidden', border: `2.5px solid ${activeImg === i ? 'var(--forest)' : 'var(--border)'}`, padding: 0, background: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 20 }}>
                {[
                  { icon: <IcTruck />,  title: 'Free Delivery',  sub: 'On orders ₹499+' },
                  { icon: <IcShield />, title: '7-Day Return',   sub: 'Easy no-hassle' },
                  { icon: <IcCheck />,  title: 'Certified',      sub: '100% organic' },
                ].map((t) => (
                  <div key={t.title} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--forest)', display: 'flex', justifyContent: 'center', marginBottom: 5 }}>{t.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.77rem', color: 'var(--forest)' }}>{t.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{t.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Info */}
            <div className="pdp-info" style={{ opacity: 0, position: 'sticky', top: 'calc(var(--nav-h) + 20px)' }}>
              {/* Category */}
              <div style={{ color: 'var(--earth)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.75rem', marginBottom: 12 }}>
                {product.category?.name || 'Garden Marketplace'}
              </div>

              {/* Title */}
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.5rem)', color: 'var(--forest)', fontWeight: 900, lineHeight: 1.2, marginBottom: 18 }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, paddingBottom: 22, borderBottom: '1px solid var(--border)' }}>
                {Number(product.rating) > 0 ? (
                  <>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(n => <IcStar key={n} f={n <= Math.round(Number(product.rating))} />)}
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '0.95rem' }}>{Number(product.rating).toFixed(1)}</span>
                    {product.review_count > 0 && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        ({product.review_count} review{product.review_count === 1 ? '' : 's'})
                      </span>
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, fontStyle: 'italic' }}>
                    Not rated yet — be the first to review
                  </span>
                )}
              </div>

              {/* Price + Stock */}
              <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 900, color: 'var(--forest)', lineHeight: 1 }}>
                    ₹{price.toLocaleString('en-IN')}
                  </div>
                  {mrp > price && (
                    <>
                      <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{mrp.toLocaleString('en-IN')}</div>
                      <div style={{ padding: '5px 12px', background: '#dcfce7', color: '#16a34a', borderRadius: 8, fontWeight: 800, fontSize: '0.85rem' }}>{disc}% OFF</div>
                    </>
                  )}
                </div>
                {/* Stock indicator */}
                {(() => {
                  const stock = Number(product.stock_quantity ?? 0);
                  if (stock <= 0) {
                    return (
                      <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#dc2626' }} /> Out of stock
                      </div>
                    );
                  }
                  if (stock <= 5) {
                    return (
                      <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#fef3c7', color: '#92400e', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700 }}>
                        ⚠️ Only {stock} left in stock
                      </div>
                    );
                  }
                  return (
                    <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#dcfce7', color: '#166534', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a' }} /> In stock — ships in 1–2 days
                    </div>
                  );
                })()}
              </div>

              {/* Description */}
              {product.description && (
                <p style={{ color: 'var(--text-2)', fontSize: '0.97rem', lineHeight: 1.8, marginBottom: 24, fontWeight: 500 }}>
                  {product.description}
                </p>
              )}

              {/* Features (if provided by API) */}
              {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  {product.features.map((f: string) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(3,65,26,0.08)', border: '1px solid rgba(3,65,26,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)', flexShrink: 0 }}><IcCheck /></div>
                      <span style={{ color: 'var(--text-2)', fontSize: '0.9rem', fontWeight: 600 }}>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Qty selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <span style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.88rem' }}>Qty:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--border-mid)', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 42, height: 42, border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 900, color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <div style={{ width: 44, textAlign: 'center', fontWeight: 900, color: 'var(--forest)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', lineHeight: '42px' }}>{qty}</div>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: 42, height: 42, border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 900, color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <button
                  onClick={handleAddToCart}
                  style={{ flex: 1, padding: '17px 20px', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: 16, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'var(--font-body)', boxShadow: 'var(--sh-md)', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--forest-light)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--forest)';       e.currentTarget.style.transform = 'none'; }}
                >
                  <IcCart /> Add to Cart
                </button>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ padding: '17px 20px', background: '#25D366', color: '#fff', borderRadius: 16, fontWeight: 800, fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(37,211,102,0.3)', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                >
                  <IcWA /> Ask Expert
                </a>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '14px 18px', background: 'rgba(3,65,26,0.03)', border: '1px solid var(--border)', borderRadius: 14, fontSize: '0.8rem', color: 'var(--text-2)' }}>
                {product.sku && <span><strong>SKU:</strong> {product.sku}</span>}
                <span><strong>Category:</strong> {product.category?.name || '—'}</span>
              </div>
            </div>
          </div>

          {/* ── TABBED PRODUCT INFO ── */}
          {(() => {
            const stock = Number(product.stock_quantity ?? 0);
            const features: string[] = Array.isArray(product.features) ? product.features : [];
            const faqs: { q: string; a: string }[] = Array.isArray(product.faqs) ? product.faqs : [];
            const tabs = [
              { id: 'description', label: 'Description' },
              { id: 'specs', label: 'Specifications' },
              ...(faqs.length ? [{ id: 'faqs', label: `FAQs (${faqs.length})` }] : []),
              { id: 'reviews', label: `Reviews${Number(product.review_count) ? ` (${product.review_count})` : ''}` },
            ] as { id: typeof activeTab; label: string }[];

            const specs: [string, string | number | null][] = [
              ['Category',     product.category?.name || 'General'],
              ['Brand',        product.brand || 'GharKaMali'],
              ['MRP',          mrp > 0 ? `₹${mrp.toLocaleString('en-IN')}` : null],
              ['Selling Price',`₹${price.toLocaleString('en-IN')}`],
              ['GST Rate',     product.gst_rate ? `${product.gst_rate}%` : null],
              ['SKU',          product.sku || product.id ? `GKM-${product.id}` : null],
              ['Stock',        stock > 0 ? `${stock} units available` : 'Out of stock'],
              ['Returns',      '7-day no-hassle return'],
              ['Delivery',     'Free on orders above ₹499'],
            ];

            return (
              <div style={{ marginTop: 60, background: '#fff', borderRadius: 24, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--sh-sm)' }}>
                {/* Tab bar */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto', scrollbarWidth: 'none' }}>
                  {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                      style={{
                        padding: '18px 26px',
                        background: 'none',
                        border: 'none',
                        borderBottom: `3px solid ${activeTab === t.id ? 'var(--forest)' : 'transparent'}`,
                        color: activeTab === t.id ? 'var(--forest)' : 'var(--text-muted)',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                        marginBottom: -1,
                      }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Tab body */}
                <div style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
                  {activeTab === 'description' && (
                    <div>
                      <p style={{ color: 'var(--text-2)', fontSize: '0.96rem', lineHeight: 1.85, fontWeight: 500, marginBottom: features.length ? 24 : 0, whiteSpace: 'pre-wrap' }}>
                        {product.long_description || product.description || 'Quality horticultural product curated by GharKaMali experts. Detailed care information will be added soon.'}
                      </p>
                      {features.length > 0 && (
                        <>
                          <h3 style={{ fontWeight: 800, color: 'var(--forest)', margin: '12px 0 14px', fontSize: '1.05rem' }}>Key features</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                            {features.map((f, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border-gold)' }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(3,65,26,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)', flexShrink: 0 }}><IcCheck /></div>
                                <span style={{ color: 'var(--text-2)', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.5 }}>{f}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4px 28px' }}>
                      {specs.filter(([, v]) => v !== null && v !== '').map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ fontWeight: 700, color: 'var(--forest)', minWidth: 120, fontSize: '0.88rem' }}>{label}</span>
                          <span style={{ color: 'var(--text-2)', fontSize: '0.88rem', fontWeight: 500 }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'faqs' && faqs.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {faqs.map((f, i) => (
                        <details key={i} style={{ padding: 18, background: 'var(--bg-elevated)', borderRadius: 14, border: '1px solid var(--border)', cursor: 'pointer' }}>
                          <summary style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '0.95rem', listStyle: 'none', cursor: 'pointer' }}>Q. {f.q}</summary>
                          <p style={{ marginTop: 10, color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.7 }}>A. {f.a}</p>
                        </details>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      {Number(product.review_count) > 0 ? (
                        <>
                          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--forest)' }}>{Number(product.rating).toFixed(1)}</div>
                          <div style={{ display: 'inline-flex', gap: 4, margin: '8px 0' }}>
                            {[1,2,3,4,5].map(n => <IcStar key={n} f={n <= Math.round(Number(product.rating))} />)}
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Based on {product.review_count} verified review{product.review_count === 1 ? '' : 's'}</p>
                        </>
                      ) : (
                        <>
                          <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: '50%', background: 'rgba(3,65,26,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)' }}><IcStar f={false} /></div>
                          <h3 style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem', marginBottom: 8 }}>No reviews yet</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 360, margin: '0 auto' }}>Be the first to share your experience with this product after you receive it.</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}


          {/* ── RELATED PRODUCTS ── */}
          {related.length > 0 && (
            <div style={{ marginTop: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,2.5vw,1.8rem)', fontWeight: 800, color: 'var(--forest)' }}>You may also like</h2>
                <Link href="/shop" style={{ color: 'var(--forest)', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>View All →</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px,1fr))', gap: 20 }}>
                {related.map((p, i) => (
                  <Link
                    key={p.id || i}
                    href={`/shop/${p.slug || p._id || p.id}`}
                    className="card"
                    style={{ display: 'block', textDecoration: 'none', overflow: 'hidden', borderRadius: 20 }}
                  >
                    <div style={{ height: 170, overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                      <img
                        src={p.images?.[0] || p.thumbnail || PLACEHOLDER}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    </div>
                    <div style={{ padding: '12px 14px 14px' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--earth)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{p.category?.name || 'Care'}</div>
                      <h3 style={{ fontSize: '0.92rem', color: 'var(--forest)', fontWeight: 800, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</h3>
                      <div style={{ fontWeight: 900, color: 'var(--forest)', fontSize: '1rem' }}>₹{Number(p.price).toLocaleString('en-IN')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />

      {/* Sticky mobile bottom bar — Add to Cart always reachable */}
      <div className="pdp-mobile-bar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: '#fff', borderTop: '1px solid var(--border)',
        padding: '10px 14px', display: 'none',
        boxShadow: '0 -6px 20px rgba(0,0,0,0.06)', gap: 10, alignItems: 'center',
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Price</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--forest)', lineHeight: 1 }}>₹{price.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--border-mid)', borderRadius: 10, overflow: 'hidden' }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 36, border: 'none', background: 'none', fontSize: '1.1rem', fontWeight: 900, color: 'var(--forest)', cursor: 'pointer' }}>−</button>
          <div style={{ width: 28, textAlign: 'center', fontWeight: 900, color: 'var(--forest)' }}>{qty}</div>
          <button onClick={() => setQty(q => q + 1)} style={{ width: 32, height: 36, border: 'none', background: 'none', fontSize: '1.1rem', fontWeight: 900, color: 'var(--forest)', cursor: 'pointer' }}>+</button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={Number(product.stock_quantity ?? 1) <= 0}
          style={{ flex: 1, padding: '12px', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: Number(product.stock_quantity ?? 1) <= 0 ? 0.5 : 1 }}>
          <IcCart /> Add to Cart
        </button>
      </div>

      <style jsx global>{`
        @media (max-width: 860px) {
          .pdp-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .pdp-info { position: relative !important; top: auto !important; }
          .pdt-table-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .pdp-mobile-bar { display: flex !important; }
          /* leave room for the sticky bar so footer/content not hidden */
          body { padding-bottom: 80px; }
        }
        @media (max-width: 560px) {
          .pdp-grid > div:last-child > div:nth-child(7) { flex-direction: column; }
        }
      `}</style>
    </>
  );
}
