import type { Category } from './categories';

// What the renderers receive: one entry per displayed day.
// For single-day events, this is the original Event with `displayDate` === `date`.
// For multi-day events, the source row is exploded into one DisplayEvent per day in the range.
export interface DisplayEvent {
  id: string;             // source row id (same across all days of a range)
  displayDate: string;    // the day this entry should show on
  startDate: string;      // original start
  endDate?: string;       // original end (if multi-day)
  isMultiDay: boolean;
  rangeIndex?: number;    // 0 = first day, length-1 = last
  rangeLength?: number;
  title: string;
  category: Category;
  time?: string;
  location?: string;
  link?: string;
}

export interface Event {
  id: string;
  date: string; // YYYY-MM-DD — start date
  endDate?: string; // YYYY-MM-DD — end date (inclusive); same as date for single-day
  title: string;
  category: Category;
  time?: string;
  location?: string;
  link?: string;
}

export interface SchoolHoliday {
  id: string;
  start: string;
  end: string;
  label: string;
}
