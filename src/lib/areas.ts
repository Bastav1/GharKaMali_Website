// Single source of truth for "Where we serve" — used by the About page pills,
// the dynamic /[area] location pages, and the sitemap.

export type ServingArea = {
  slug: string;
  name: string;
  city: 'Noida' | 'Greater Noida';
  // optional override / extra blurb shown on the dedicated page
  blurb?: string;
};

export const SERVING_AREAS: ServingArea[] = [
  { slug: 'ats-pristine',         name: 'ATS Pristine',         city: 'Noida' },
  { slug: 'gaur-city',            name: 'Gaur City',            city: 'Greater Noida' },
  { slug: 'supertech-capetown',   name: 'Supertech Capetown',   city: 'Noida' },
  { slug: 'godrej-properties',    name: 'Godrej Properties',    city: 'Noida' },
  { slug: 'mahagun-moderne',      name: 'Mahagun Moderne',      city: 'Noida' },
  { slug: 'sikka-karmic-greens',  name: 'Sikka Karmic Greens',  city: 'Greater Noida' },
  { slug: 'amrapali-silicon-city',name: 'Amrapali Silicon City',city: 'Noida' },
  { slug: 'sector-62',            name: 'Sector 62',            city: 'Noida' },
  { slug: 'sector-78',            name: 'Sector 78',            city: 'Noida' },
  { slug: 'sector-137',           name: 'Sector 137',           city: 'Noida' },
  { slug: 'sector-150',           name: 'Sector 150',           city: 'Noida' },
  { slug: 'sector-93',            name: 'Sector 93',            city: 'Noida' },
  { slug: 'sector-128',           name: 'Sector 128',           city: 'Noida' },
  { slug: 'noida-extension',      name: 'Noida Extension',      city: 'Greater Noida' },
];

export const getArea = (slug: string): ServingArea | undefined =>
  SERVING_AREAS.find(a => a.slug === slug);
