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

export interface CategoryColour {
  bg: string;
  text: string;
  border: string;
}

export const CATEGORY_COLOURS_LIGHT: Record<Category, CategoryColour> = {
  All:      { bg: '#d1d5db', text: '#111827', border: '#9ca3af' },
  Mum:      { bg: '#fbcfe8', text: '#831843', border: '#f472b6' },
  Dad:      { bg: '#fed7aa', text: '#7c2d12', border: '#fb923c' },
  Alice:    { bg: '#e9d5ff', text: '#581c87', border: '#c084fc' },
  Delilah:  { bg: '#bfdbfe', text: '#1e3a8a', border: '#60a5fa' },
  Possible: { bg: '#ddd6fe', text: '#4c1d95', border: '#a78bfa' },
  Interest: { bg: '#bbf7d0', text: '#14532d', border: '#4ade80' },
  Holiday:  { bg: '#e7d3b3', text: '#5a3a1a', border: '#c9a875' },
};

export const CATEGORY_COLOURS_DARK: Record<Category, CategoryColour> = {
  All:      { bg: 'rgba(156,163,175,0.20)', text: '#E5E7EB', border: '#9CA3AF' },
  Mum:      { bg: 'rgba(244,114,182,0.18)', text: '#FBCFE8', border: '#EC4899' },
  Dad:      { bg: 'rgba(251,146,60,0.18)',  text: '#FED7AA', border: '#FB923C' },
  Alice:    { bg: 'rgba(192,132,252,0.18)', text: '#E9D5FF', border: '#C084FC' },
  Delilah:  { bg: 'rgba(96,165,250,0.18)',  text: '#BFDBFE', border: '#60A5FA' },
  Possible: { bg: 'rgba(167,139,250,0.18)', text: '#DDD6FE', border: '#A78BFA' },
  Interest: { bg: 'rgba(74,222,128,0.18)',  text: '#BBF7D0', border: '#4ADE80' },
  Holiday:  { bg: 'rgba(201,168,117,0.18)', text: '#E7D3B3', border: '#C9A875' },
};

export function categoryColours(theme: 'light' | 'dark'): Record<Category, CategoryColour> {
  return theme === 'dark' ? CATEGORY_COLOURS_DARK : CATEGORY_COLOURS_LIGHT;
}
