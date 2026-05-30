// Shared slug helpers so link builders and route resolvers always agree.
// Plans/categories have no stored slug, so we derive one from the name.

export const slugify = (s: string): string =>
  (s || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Prefer the stored slug (stable across renames); fall back to deriving from
// the name for rows that haven't been backfilled yet.
export const planSlug = (plan: { slug?: string; name?: string } | null | undefined): string =>
  plan?.slug || slugify(plan?.name || '');

export const categorySlug = (cat: { slug?: string; name?: string } | null | undefined): string =>
  cat?.slug || slugify(cat?.name || '');
