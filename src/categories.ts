export const CATEGORIES = [
  'All',
  'Mum',
  'Dad',
  'Alice',
  'Delilah',
  'Possible',
  'Interest',
  'Holiday',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLOURS: Record<Category, { bg: string; text: string; border: string }> = {
  All:      { bg: '#d1d5db', text: '#111827', border: '#9ca3af' },
  Mum:      { bg: '#fbcfe8', text: '#831843', border: '#f472b6' },
  Dad:      { bg: '#fed7aa', text: '#7c2d12', border: '#fb923c' },
  Alice:    { bg: '#e9d5ff', text: '#581c87', border: '#c084fc' },
  Delilah:  { bg: '#bfdbfe', text: '#1e3a8a', border: '#60a5fa' },
  Possible: { bg: '#ddd6fe', text: '#4c1d95', border: '#a78bfa' },
  Interest: { bg: '#bbf7d0', text: '#14532d', border: '#4ade80' },
  Holiday:  { bg: '#e7d3b3', text: '#5a3a1a', border: '#c9a875' },
};
