'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { verifyOtp } from '@/lib/api';
import { useAuth } from '@/store/auth';

// OTP is temporarily disabled for launch — customers log in with just their phone
// number. 123456 is used as the OTP internally (the backend accepts it). The full
// OTP flow (phone → OTP → name) lives in git history; restore it to re-enable.
function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') ?? '/dashboard';
  const { login, isAuthenticated, isLoading } = useAuth();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!isLoading && isAuthenticated) router.replace(redirect); }, [isAuthenticated, isLoading]);

  const getLocation = () => new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  const handleLogin = async () => {
    const c = phone.replace(/\D/g, '');
    if (c.length !== 10) { toast.error('Enter a valid 10-digit number'); return; }
    setLoading(true);
    let location: { lat: number; lng: number } | null = null;
    try { location = await getLocation(); } catch { /* location optional */ }
    try {
      const res: any = await verifyOtp(c, '123456', undefined, location?.lat, location?.lng);
      login(res.user, res.token);
      toast.success('Welcome to GharKaMali!');
      router.replace(redirect);
    } catch (e: any) {
      toast.error(e?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100svh', background: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', position: 'relative', overflow: 'hidden' }}>
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-5%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,122,88,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460, animation: 'fade-up 0.5s var(--ease) both' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 36, textDecoration: 'none' }}>
          <img src="/logo.png" alt="GharKaMali" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
        </Link>

        {/* Card */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 28, padding: 'clamp(28px,5vw,40px)', boxShadow: 'var(--sh-xl)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: 6, letterSpacing: '-0.02em' }}>Sign In</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.9rem' }}>Enter your phone number to continue</p>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ display: 'flex', border: '1.5px solid var(--border-mid)', borderRadius: 'var(--r)', overflow: 'hidden', background: 'var(--bg)', transition: 'all 0.2s' }}
              onFocusCapture={e => { (e.currentTarget as any).style.borderColor = 'var(--forest)'; (e.currentTarget as any).style.boxShadow = '0 0 0 4px rgba(11,61,46,0.10)'; }}
              onBlurCapture={e => { (e.currentTarget as any).style.borderColor = 'var(--border-mid)'; (e.currentTarget as any).style.boxShadow = 'none'; }}>
              <div style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-2)', borderRight: '1.5px solid var(--border-mid)', background: 'var(--cream)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>🇮🇳 +91</div>
              <input ref={inputRef} type="tel" inputMode="numeric" maxLength={10} value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="98765 43210" autoFocus
                style={{ flex: 1, padding: '12px 14px', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '1rem', letterSpacing: '0.05em', color: 'var(--text)' }} />
            </div>
          </div>
          <button onClick={handleLogin} disabled={loading || phone.replace(/\D/g, '').length !== 10}
            className="btn btn-forest w-full" style={{ justifyContent: 'center', padding: '14px' }}>
            {loading ? <div className="btn-spinner" style={{ borderTopColor: '#fff' }} /> : 'Continue →'}
          </button>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.78rem', color: 'var(--text-faint)' }}>
            By continuing you agree to our <Link href="/terms" style={{ color: 'var(--forest)', fontWeight: 600 }}>Terms</Link> &amp; <Link href="/privacy" style={{ color: 'var(--forest)', fontWeight: 600 }}>Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div style={{ minHeight: '100svh', background: 'var(--forest)' }} />}><LoginForm /></Suspense>;
}
