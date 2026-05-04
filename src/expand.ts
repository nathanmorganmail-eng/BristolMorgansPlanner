import type { DisplayEvent, Event } from './types';
import { datesInRange } from './dateUtils';

export function expandEvents(events: Event[]): DisplayEvent[] {
  const out: DisplayEvent[] = [];
  for (const e of events) {
    if (e.endDate && e.endDate > e.date) {
      const days = datesInRange(e.date, e.endDate);
      days.forEach((d, i) => {
        out.push({
          id: e.id,
          displayDate: d,
          startDate: e.date,
          endDate: e.endDate,
          isMultiDay: true,
          rangeIndex: i,
          rangeLength: days.length,
          title: e.title,
          category: e.category,
          time: e.time,
          location: e.location,
          link: e.link,
        });
      });
    } else {
      out.push({
        id: e.id,
        displayDate: e.date,
        startDate: e.date,
        isMultiDay: false,
        title: e.title,
        category: e.category,
        time: e.time,
        location: e.location,
        link: e.link,
      });
    }
  }
  return out;
}

// Group display events by date, with multi-day events sorted first.
export function groupByDate(events: DisplayEvent[]): Record<string, DisplayEvent[]> {
  const map: Record<string, DisplayEvent[]> = {};
  for (const e of events) {
    (map[e.displayDate] ??= []).push(e);
  }
  for (const k of Object.keys(map)) {
    map[k].sort((a, b) => {
      if (a.isMultiDay && !b.isMultiDay) return -1;
      if (!a.isMultiDay && b.isMultiDay) return 1;
      return 0;
    });
  }
  return map;
}
