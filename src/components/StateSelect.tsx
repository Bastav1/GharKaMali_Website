'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { INDIAN_STATES } from '@/lib/indianStates';

type Props = {
  value: string;
  onChange: (state: string) => void;
  placeholder?: string;
  /** Styles applied to the text input so it can match the surrounding form. */
  inputStyle?: React.CSSProperties;
  /** Accent/border colour used on focus + active option. */
  accent?: string;
  id?: string;
};

/**
 * Searchable Indian-state picker. Renders a text input with a type-ahead
 * dropdown of all states & union territories. Typing filters the list;
 * clicking (or Enter) selects. Used everywhere a state field is needed.
 */
export default function StateSelect({
  value,
  onChange,
  placeholder = 'Type to search state…',
  inputStyle,
  accent = 'var(--forest)',
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the visible text in sync when the value changes from outside.
  useEffect(() => { setQuery(value || ''); }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // When the box shows the already-selected value, list everything so the
    // user can browse; otherwise filter by what they've typed.
    if (!q || q === (value || '').toLowerCase()) return INDIAN_STATES;
    return INDIAN_STATES.filter(s => s.toLowerCase().includes(q));
  }, [query, value]);

  // Close on outside click.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value || ''); // revert any half-typed text
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [value]);

  const select = (s: string) => {
    onChange(s);
    setQuery(s);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHighlight(h => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (open && filtered[highlight]) select(filtered[highlight]); }
    else if (e.key === 'Escape') { setOpen(false); setQuery(value || ''); }
  };

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[highlight] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlight, open]);

  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 13px',
    borderRadius: 11,
    border: '1.5px solid var(--border)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.88rem',
    background: '#fff',
    outline: 'none',
    color: 'var(--forest)',
    boxSizing: 'border-box',
    fontWeight: 600,
    ...inputStyle,
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        value={query}
        placeholder={placeholder}
        onChange={e => { setQuery(e.target.value); setOpen(true); setHighlight(0); }}
        onFocus={e => { setOpen(true); setHighlight(0); e.currentTarget.select(); e.currentTarget.style.borderColor = accent; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        onKeyDown={onKeyDown}
        style={baseInputStyle}
      />
      {open && (
        <div
          ref={listRef}
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            maxHeight: 240, overflowY: 'auto',
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: 11,
            boxShadow: '0 12px 40px rgba(3,65,26,0.15)', zIndex: 4000,
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '11px 14px', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
              No state found
            </div>
          ) : filtered.map((s, i) => {
            const isSel = s === value;
            const isHi = i === highlight;
            return (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={isSel}
                onMouseDown={(e) => { e.preventDefault(); select(s); }}
                onMouseEnter={() => setHighlight(i)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 14px', border: 'none', cursor: 'pointer',
                  background: isHi ? 'rgba(3,65,26,0.07)' : 'transparent',
                  color: 'var(--forest)',
                  fontWeight: isSel ? 800 : 600,
                  fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
