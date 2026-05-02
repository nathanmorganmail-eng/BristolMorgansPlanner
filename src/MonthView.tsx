import { useState } from 'react';
import { categoryColours } from './categories';
import { ymd, addDays, monthName, isInRange } from './dateUtils';
import type { Event, SchoolHoliday } from './types';
import type { Theme } from './theme';

interface Props {
  year: number;
  events: Event[];
  schoolHolidays: SchoolHoliday[];
  theme: Theme;
  onAddClick: (date: string) => void;
  onEventClick: (e: Event) => void;
}

export function MonthView({ year, events, schoolHolidays, theme, onAddClick, onEventClick }: Props) {
  const colours = categoryColours(theme);
  const [month, setMonth] = useState(new Date().getFullYear() === year ? new Date().getMonth() : 0);

  const eventsByDate = events.reduce<Record<string, Event[]>>((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});

  const isSchoolHoliday = (d: string) => schoolHolidays.some((h) => isInRange(d, h.start, h.end));

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
      <div
        className="flex items-center justify-between p-3 sticky top-0 z-10"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}
          className="px-3 py-1 text-2xl"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{monthName(month)} {year}</h2>
        <button
          onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}
          className="px-3 py-1 text-2xl"
          style={{ color: 'var(--text-muted)' }}
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
            <div
              key={key}
              onClick={() => onAddClick(key)}
              className={`w-full text-left flex cursor-pointer ${isWeekend ? '' : 'opacity-75'}`}
              style={{
                background: isSchoolHoliday(key) ? 'var(--school-holiday)' : 'transparent',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div
                className="w-16 p-3 text-center"
                style={{ borderRight: '1px solid var(--border)' }}
              >
                <div style={{ color: 'var(--text-muted)' }} className="text-xs">{dayLabel}</div>
                <div className="text-2xl font-light" style={{ color: 'var(--text)' }}>{d.getDate()}</div>
              </div>
              <div className="flex-1 p-2 space-y-1 min-h-[60px]">
                {dayEvents.length === 0 && (
                  <div style={{ color: 'var(--text-muted)' }} className="text-sm italic opacity-50">—</div>
                )}
                {dayEvents.map((e) => {
                  const c = colours[e.category];
                  return (
                    <div
                      key={e.id}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onEventClick(e);
                      }}
                      style={{ background: c.bg, color: c.text, borderLeft: `3px solid ${c.border}` }}
                      className="px-2 py-1 rounded text-sm"
                    >
                      {e.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
