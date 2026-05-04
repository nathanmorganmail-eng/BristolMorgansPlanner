import { categoryColours } from './categories';
import { saturdaysInYear, ymd, addDays, monthName, isInRange, weekdaysBefore, weekdayPrefix } from './dateUtils';
import { expandEvents, groupByDate } from './expand';
import type { DisplayEvent, Event, SchoolHoliday } from './types';
import type { Theme } from './theme';

interface Props {
  year: number;
  events: Event[];
  schoolHolidays: SchoolHoliday[];
  theme: Theme;
  onAddClick: (date: string) => void;
  onEventClick: (id: string) => void;
}

interface RenderEvent extends DisplayEvent {
  prefix?: string; // M/T/W/Th/F if a weekday rolled into this weekend
}

export function YearGrid({ year, events, schoolHolidays, theme, onAddClick, onEventClick }: Props) {
  const colours = categoryColours(theme);
  const sats = saturdaysInYear(year);
  const perQuarter = Math.ceil(sats.length / 4);
  const quarters = [0, 1, 2, 3].map((q) => sats.slice(q * perQuarter, (q + 1) * perQuarter));

  const byDate = groupByDate(expandEvents(events));

  // Build per-Saturday display events: own events + weekday events from preceding Mon-Fri (with prefix).
  const buildSatDisplay = (sat: Date): RenderEvent[] => {
    const own: RenderEvent[] = (byDate[ymd(sat)] ?? []).map((e) => ({ ...e }));
    const weekday: RenderEvent[] = [];
    for (const d of weekdaysBefore(sat)) {
      const prefix = weekdayPrefix(d);
      for (const e of byDate[ymd(d)] ?? []) {
        weekday.push({ ...e, prefix });
      }
    }
    return [...weekday, ...own];
  };

  const isSchoolHoliday = (d: string) => schoolHolidays.some((h) => isInRange(d, h.start, h.end));

  return (
    <div className="hidden md:grid grid-cols-4 gap-3 p-3 text-[11px] leading-tight">
      {quarters.map((quarter, qi) => (
        <div
          key={qi}
          className="rounded"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div
            className="grid grid-cols-[2.5rem_1fr_1fr] font-semibold text-center sticky z-10"
            style={{
              top: 'var(--header-h, 56px)',
              background: 'var(--surface-2)',
              borderBottom: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <div className="px-1 py-1">Wk</div>
            <div className="py-1">Sat</div>
            <div className="py-1">Sun</div>
          </div>
          {quarter.map((sat, idx) => {
            const sun = addDays(sat, 1);
            const satKey = ymd(sat);
            const sunKey = ymd(sun);
            const prevSat = idx > 0 ? quarter[idx - 1] : null;
            const monthChanged = !prevSat || prevSat.getMonth() !== sat.getMonth();
            const satEvents = buildSatDisplay(sat);
            const sunEvents: RenderEvent[] = (byDate[sunKey] ?? []).map((e) => ({ ...e }));
            return (
              <div
                key={satKey}
                className="grid grid-cols-[2.5rem_1fr_1fr] min-h-[44px]"
                style={{
                  borderTop: monthChanged
                    ? '2px solid var(--text-muted)'
                    : '1px solid var(--border)',
                }}
              >
                <div
                  className="px-1 py-1 text-center flex flex-col items-center justify-center"
                  style={{
                    color: 'var(--text-muted)',
                    background: monthChanged ? 'var(--surface-2)' : 'transparent',
                    borderRight: '1px solid var(--border)',
                  }}
                >
                  {monthChanged && (
                    <div className="font-semibold text-[11px]" style={{ color: 'var(--text)' }}>
                      {monthName(sat.getMonth(), true)}
                    </div>
                  )}
                  <div className="text-[10px]">{sat.getDate()}</div>
                </div>
                <DayCell
                  day={sat}
                  dateKey={satKey}
                  events={satEvents}
                  isHoliday={isSchoolHoliday(satKey)}
                  colours={colours}
                  onAddClick={onAddClick}
                  onEventClick={onEventClick}
                />
                <DayCell
                  day={sun}
                  dateKey={sunKey}
                  events={sunEvents}
                  isHoliday={isSchoolHoliday(sunKey)}
                  colours={colours}
                  onAddClick={onAddClick}
                  onEventClick={onEventClick}
                  isLast
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function multiDayLabel(e: RenderEvent): string {
  if (!e.isMultiDay) return '';
  const total = e.rangeLength ?? 1;
  const idx = (e.rangeIndex ?? 0) + 1;
  return `${idx}/${total}`;
}

function DayCell({
  day,
  dateKey,
  events,
  isHoliday,
  colours,
  onAddClick,
  onEventClick,
  isLast,
}: {
  day: Date;
  dateKey: string;
  events: RenderEvent[];
  isHoliday: boolean;
  colours: ReturnType<typeof categoryColours>;
  onAddClick: (date: string) => void;
  onEventClick: (id: string) => void;
  isLast?: boolean;
}) {
  return (
    <div
      onClick={() => onAddClick(dateKey)}
      role="button"
      tabIndex={0}
      className="text-left px-1 py-1 cursor-pointer hover:opacity-90 transition-opacity"
      style={{
        background: isHoliday ? 'var(--school-holiday)' : 'transparent',
        borderRight: isLast ? 'none' : '1px solid var(--border)',
      }}
    >
      <div style={{ color: 'var(--text-muted)' }} className="text-[10px]">{day.getDate()}</div>
      <div className="space-y-0.5 mt-0.5">
        {events.map((e, i) => {
          const c = colours[e.category];
          return (
            <div
              key={`${e.id}-${i}`}
              onClick={(ev) => {
                ev.stopPropagation();
                onEventClick(e.id);
              }}
              style={{
                background: c.bg,
                color: c.text,
                borderLeft: `${e.isMultiDay ? '4px double' : '2px solid'} ${c.border}`,
              }}
              className="px-1 py-0.5 rounded-sm truncate cursor-pointer hover:brightness-110"
              title={`${e.prefix ? e.prefix + ' ' : ''}${e.title}${e.isMultiDay ? ` (day ${multiDayLabel(e)})` : ''}${e.time ? ' · ' + e.time : ''}${e.location ? ' · ' + e.location : ''}`}
            >
              {e.prefix && (
                <span style={{ color: 'var(--weekday-prefix)' }} className="font-semibold mr-1">
                  {e.prefix}
                </span>
              )}
              {e.isMultiDay && <span className="mr-1 opacity-60">↔</span>}
              {e.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
