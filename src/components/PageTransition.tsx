'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function PageTransition() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  // 'idle' → 'loading' (overlay shown, spinner spinning)
  // → 'done' (fade out begins) → 'idle' (unmounted)
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle');
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Intercept every internal link click and programmatic navigation ──
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      // Skip external links, hash links, download links
      if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('#') || anchor.hasAttribute('download') || anchor.target === '_blank') return;
      // Same page
      if (href === pathname || href === window.location.pathname) return;
      // Show loader immediately on click
      if (doneTimer.current) clearTimeout(doneTimer.current);
      setPhase('loading');
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname]);

  // ── When pathname actually changes → new page is mounted → hide overlay ──
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    // Small delay so the new page has painted before we fade out
    doneTimer.current = setTimeout(() => {
      setPhase('done');
      // Remove after fade completes
      setTimeout(() => setPhase('idle'), 420);
    }, 120);

    return () => { if (doneTimer.current) clearTimeout(doneTimer.current); };
  }, [pathname]);

  if (phase === 'idle') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        opacity: phase === 'done' ? 0 : 1,
        transition: 'opacity 0.38s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: phase === 'done' ? 'none' : 'all',
      }}
    >
      {/* Logo */}
      <Image
        src="/logo-dark.png"
        alt="GharKaMali"
        width={110}
        height={110}
        priority
        style={{ objectFit: 'contain', marginBottom: 32 }}
      />

      {/* Circular spinner */}
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        {/* Track */}
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(3,65,26,0.1)" strokeWidth="4" />
        </svg>
        {/* Spinning arc */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          style={{ position: 'absolute', inset: 0, animation: 'ptSpin 0.8s linear infinite', transformOrigin: 'center' }}
        >
          <defs>
            <linearGradient id="ptSpinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#03411a" />
              <stop offset="100%" stopColor="#c9a84c" />
            </linearGradient>
          </defs>
          <circle
            cx="28" cy="28" r="22"
            fill="none"
            stroke="url(#ptSpinGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="138"
            strokeDashoffset="100"
            style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
          />
        </svg>
        {/* Center leaf */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#03411a" stroke="none">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes ptSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
