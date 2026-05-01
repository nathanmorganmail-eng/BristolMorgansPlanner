import type { Category } from './categories';

export interface Event {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: Category;
  time?: string;
  location?: string;
}

export interface SchoolHoliday {
  id: string;
  start: string;
  end: string;
  label: string;
}
