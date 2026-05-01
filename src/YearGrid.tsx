import { CATEGORY_COLOURS } from './categories';
import { saturdaysInYear, ymd, addDays, monthName, isInRange } from './dateUtils';
import type { Event, SchoolHoliday } from './types';

interface Props {
  year: number;
  events: Event[];
  schoolHolidays: SchoolHoliday[];
  onAddClick: (date: string) => void;
}

export function YearGrid({ year, events, schoolHolidays, onAddClick }: Props) {
  const sats = saturdaysInYear(year);
  // Split into 4 quarters of weeks (~13 weeks each)
  const perQuarter = Math.ceil(sats.length / 4);
  const quarters = [0, 1, 2, 3].map((q) => sats.slice(q * perQuarter, (q + 1) * perQuarter));

  const eventsByDate = events.reduce<Record<string, Event[]>>((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});

  const isSchoolHoliday = (d: string) => schoolHolidays.some((h) => isInRange(d, h.start, h.end));

  return (
    <div className="hidden md:grid grid-cols-4 gap-3 p-3 text-[11px] leading-tight">
      {quarters.map((quarter, qi) => (
        <div key={qi} className="border border-gray-300 rounded">
          <div className="grid grid-cols-[auto_1fr_1fr] bg-gray-100 border-b border-gray-300 font-semibold text-gray-700 text-center">
            <div className="px-1 py-1">Wk</div>
            <div className="py-1">Sat</div>
            <div className="py-1">Sun</div>
          </div>
          {quarter.map((sat) => {
            const sun = addDays(sat, 1);
            const satKey = ymd(sat);
            const sunKey = ymd(sun);
            const monthLabel = sat.getDate() <= 7 ? monthName(sat.getMonth(), true) : '';
            return (
              <div
                key={satKey}
                className="grid grid-cols-[auto_1fr_1fr] border-t border-gray-200 min-h-[44px]"
              >
                <div className="px-1 py-1 text-gray-500 text-center w-8 border-r border-gray-200 flex items-center justify-center">
                  {monthLabel || sat.getDate()}
                </div>
                <DayCell day={sat} dateKey={satKey} events={eventsByDate[satKey] ?? []} isHoliday={isSchoolHoliday(satKey)} onAddClick={onAddClick} />
                <DayCell day={sun} dateKey={sunKey} events={eventsByDate[sunKey] ?? []} isHoliday={isSchoolHoliday(sunKey)} onAddClick={onAddClick} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function DayCell({
  day,
  dateKey,
  events,
  isHoliday,
  onAddClick,
}: {
  day: Date;
  dateKey: string;
  events: Event[];
  isHoliday: boolean;
  onAddClick: (date: string) => void;
}) {
  return (
    <button
      onClick={() => onAddClick(dateKey)}
      className={`text-left px-1 py-1 border-r border-gray-200 last:border-r-0 hover:bg-blue-50 transition-colors ${isHoliday ? 'bg-yellow-100' : ''}`}
    >
      <div className="text-gray-400 text-[10px]">{day.getDate()}</div>
      <div className="space-y-0.5 mt-0.5">
        {events.map((e) => {
          const c = CATEGORY_COLOURS[e.category];
          return (
            <div
              key={e.id}
              style={{ background: c.bg, color: c.text, borderLeft: `2px solid ${c.border}` }}
              className="px-1 py-0.5 rounded-sm truncate"
              title={`${e.title}${e.time ? ' · ' + e.time : ''}${e.location ? ' · ' + e.location : ''}`}
            >
              {e.title}
            </div>
          );
        })}
      </div>
    </button>
  );
}
