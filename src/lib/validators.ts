// Frontend validators — mirror the strict server-side rules in
// GharKaMali_Backend/src/middleware/validators.js. Single source of truth.
//
// Pattern in components:
//   const errs = validateAll([
//     v.phone(form.phone),
//     v.email(form.email, { optional: true }),
//     v.name(form.name),
//   ]);
//   if (errs.length) { toast.error(errs[0].message); return; }
//   // ...submit

export type V = { ok: true } | { ok: false; field: string; message: string };

// ── Atoms ───────────────────────────────────────────────────────────────────
export const v = {
  phone(value: any, opts: { field?: string; optional?: boolean } = {}): V {
    const field = opts.field ?? 'phone';
    const s = String(value ?? '').replace(/[\s-]/g, '').replace(/^(\+?91|0)/, '');
    if (!s) return opts.optional ? { ok: true } : { ok: false, field, message: 'Phone is required' };
    if (!/^[6-9]\d{9}$/.test(s)) return { ok: false, field, message: 'Enter a valid 10-digit Indian mobile number' };
    return { ok: true };
  },

  otp(value: any, opts: { field?: string } = {}): V {
    const field = opts.field ?? 'otp';
    const s = String(value ?? '').trim();
    if (!s) return { ok: false, field, message: 'OTP is required' };
    if (!/^\d{4,6}$/.test(s)) return { ok: false, field, message: 'OTP must be 4-6 digits' };
    return { ok: true };
  },

  email(value: any, opts: { field?: string; optional?: boolean } = {}): V {
    const field = opts.field ?? 'email';
    const s = String(value ?? '').trim().toLowerCase();
    if (!s) return opts.optional ? { ok: true } : { ok: false, field, message: 'Email is required' };
    if (s.length > 120) return { ok: false, field, message: 'Email is too long' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return { ok: false, field, message: 'Enter a valid email' };
    return { ok: true };
  },

  name(value: any, opts: { field?: string; min?: number; max?: number; optional?: boolean } = {}): V {
    const field = opts.field ?? 'name';
    const min = opts.min ?? 2, max = opts.max ?? 80;
    const s = String(value ?? '').trim();
    if (!s) return opts.optional ? { ok: true } : { ok: false, field, message: `${cap(field)} is required` };
    if (s.length < min || s.length > max) return { ok: false, field, message: `${cap(field)} must be ${min}–${max} characters` };
    if (!/^[A-Za-zऀ-ॿ .'\-]+$/.test(s)) return { ok: false, field, message: `${cap(field)} contains invalid characters` };
    return { ok: true };
  },

  pincode(value: any, opts: { field?: string; optional?: boolean } = {}): V {
    const field = opts.field ?? 'pincode';
    const s = String(value ?? '').trim();
    if (!s) return opts.optional ? { ok: true } : { ok: false, field, message: 'Pincode is required' };
    if (!/^[1-9][0-9]{5}$/.test(s)) return { ok: false, field, message: 'Enter a valid 6-digit pincode' };
    return { ok: true };
  },

  gstin(value: any, opts: { field?: string; optional?: boolean } = {}): V {
    const field = opts.field ?? 'billing_gstin';
    const s = String(value ?? '').trim().toUpperCase();
    if (!s) return opts.optional ? { ok: true } : { ok: false, field, message: 'GSTIN is required' };
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(s))
      return { ok: false, field, message: 'Invalid GSTIN — must be 15 characters in the official format' };
    return { ok: true };
  },

  amount(value: any, opts: { field: string; min?: number; max?: number; optional?: boolean }): V {
    const { field } = opts;
    const min = opts.min ?? 1, max = opts.max ?? 1_000_000;
    if (value === '' || value == null) return opts.optional ? { ok: true } : { ok: false, field, message: `${cap(field)} is required` };
    const n = Number(value);
    if (!Number.isFinite(n)) return { ok: false, field, message: `${cap(field)} must be a number` };
    if (n < min || n > max) return { ok: false, field, message: `${cap(field)} must be between ${min} and ${max}` };
    return { ok: true };
  },

  integer(value: any, opts: { field: string; min?: number; max?: number; optional?: boolean }): V {
    const { field } = opts;
    const min = opts.min ?? 0, max = opts.max ?? 1_000_000;
    if (value === '' || value == null) return opts.optional ? { ok: true } : { ok: false, field, message: `${cap(field)} is required` };
    const n = Number(value);
    if (!Number.isInteger(n)) return { ok: false, field, message: `${cap(field)} must be a whole number` };
    if (n < min || n > max) return { ok: false, field, message: `${cap(field)} must be between ${min} and ${max}` };
    return { ok: true };
  },

  text(value: any, opts: { field: string; min?: number; max?: number; optional?: boolean }): V {
    const { field } = opts;
    const min = opts.min ?? 0, max = opts.max ?? 5000;
    const s = String(value ?? '').trim();
    if (!s) return opts.optional ? { ok: true } : { ok: false, field, message: `${cap(field)} is required` };
    if (s.length < min) return { ok: false, field, message: `${cap(field)} must be at least ${min} characters` };
    if (s.length > max) return { ok: false, field, message: `${cap(field)} must be at most ${max} characters` };
    return { ok: true };
  },

  enumIn(value: any, allowed: readonly string[], opts: { field: string; optional?: boolean }): V {
    const { field } = opts;
    const s = String(value ?? '');
    if (!s) return opts.optional ? { ok: true } : { ok: false, field, message: `${cap(field)} is required` };
    if (!allowed.includes(s)) return { ok: false, field, message: `${cap(field)} must be one of: ${allowed.join(', ')}` };
    return { ok: true };
  },

  isoDate(value: any, opts: { field: string; futureOnly?: boolean; optional?: boolean }): V {
    const { field } = opts;
    if (!value) return opts.optional ? { ok: true } : { ok: false, field, message: `${cap(field)} is required` };
    const d = new Date(value);
    if (isNaN(d.getTime())) return { ok: false, field, message: `${cap(field)} must be a valid date` };
    if (opts.futureOnly && d.getTime() < Date.now() - 24 * 3600_000) return { ok: false, field, message: `${cap(field)} cannot be in the past` };
    return { ok: true };
  },

  password(value: any, opts: { field?: string } = {}): V {
    const field = opts.field ?? 'password';
    const s = String(value ?? '');
    if (!s) return { ok: false, field, message: 'Password is required' };
    if (s.length < 8 || s.length > 64) return { ok: false, field, message: 'Password must be 8–64 characters' };
    if (!/[A-Za-z]/.test(s) || !/\d/.test(s)) return { ok: false, field, message: 'Password must contain a letter and a number' };
    return { ok: true };
  },
};

// Helpers
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' '); }

// Aggregate: returns array of failing results
export function validateAll(checks: V[]): { field: string; message: string }[] {
  return checks.filter((c): c is Extract<V, { ok: false }> => !c.ok).map(c => ({ field: c.field, message: c.message }));
}

// Convenience: first-error-as-message, returns null if all pass
export function firstError(checks: V[]): string | null {
  const fails = validateAll(checks);
  return fails.length ? fails[0].message : null;
}

// Normalize phone for submission (matches backend sanitizer)
export const normalizePhone = (raw: any): string =>
  String(raw ?? '').replace(/[\s-]/g, '').replace(/^(\+?91|0)/, '');
