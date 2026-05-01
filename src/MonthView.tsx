import { useState } from 'react';
import { CATEGORY_COLOURS } from './categories';
import { ymd, addDays, monthName, isInRange } from './dateUtils';
import type { Event, SchoolHoliday } from './types';

interface Props {
  year: number;
  events: Event[];
  schoolHolidays: SchoolHoliday[];
  onAddClick: (date: string) => void;
}

export function MonthView({ year, events, schoolHolidays, onAddClick }: Props) {
  const [month, setMonth] = useState(new Date().getFullYear() === year ? new Date().getMonth() : 0);

  const eventsByDate = events.reduce<Record<string, Event[]>>((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});

  const isSchoolHoliday = (d: string) => schoolHolidays.some((h) => isInRange(d, h.start, h.end));

  // Generate all weekend days (+ any weekday with events) for this month
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: Date[] = [];
  for (let d = new Date(first); d <= last; d = addDays(d, 1)) {
    const isWeekend = d.getDay() === 6 || d.getDay() === 0;
    const hasEvent = (eventsByDate[ymd(d)] ?? []).length > 0;
    if (isWeekend || hasEvent) days.push(new Date(d));
  }

  return (
    <div className="md:hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <button
          onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}
          className="px-3 py-1 text-2xl text-gray-600"
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="text-lg font-semibold">{monthName(month)} {year}</h2>
        <button
          onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}
          className="px-3 py-1 text-2xl text-gray-600"
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pb-24">
        {days.map((d) => {
          const key = ymd(d);
          const dayEvents = eventsByDate[key] ?? [];
          const isWeekend = d.getDay() === 6 || d.getDay() === 0;
          const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
          return (
            <button
              key={key}
              onClick={() => onAddClick(key)}
              className={`w-full text-left flex border-b border-gray-100 ${isSchoolHoliday(key) ? 'bg-yellow-50' : ''} ${isWeekend ? '' : 'opacity-75'}`}
            >
              <div className="w-16 p-3 text-center border-r border-gray-100">
                <div className="text-xs text-gray-500">{dayLabel}</div>
                <div className="text-2xl font-light">{d.getDate()}</div>
              </div>
              <div className="flex-1 p-2 space-y-1 min-h-[60px]">
                {dayEvents.length === 0 && (
                  <div className="text-gray-300 text-sm italic">—</div>
                )}
                {dayEvents.map((e) => {
                  const c = CATEGORY_COLOURS[e.category];
                  return (
                    <div
                      key={e.id}
                      style={{ background: c.bg, color: c.text, borderLeft: `3px solid ${c.border}` }}
                      className="px-2 py-1 rounded text-sm"
                    >
                      {e.title}
                    </div>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
