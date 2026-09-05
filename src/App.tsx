import { useEffect, useMemo, useRef, useState } from 'react';
import { YearGrid } from './YearGrid';
import { MonthView } from './MonthView';
import { AddEventModal } from './AddEventModal';
import { EventModal } from './EventModal';
import { PasswordGate } from './PasswordGate';
import { CategoryLegend } from './CategoryLegend';
import { IcePage } from './IcePage';
import { BdayPage } from './BdayPage';
import { ymd } from './dateUtils';
import {
  fetchEvents,
  fetchSchoolHolidays,
  fetchBirthdays,
  addEvent,
  updateEvent,
  deleteEvent,
  UnauthorisedError,
  type Birthday,
} from './api';
import { useTheme } from './theme';
import type { Category } from './categories';
import type { Event, SchoolHoliday } from './types';
import './App.css';

type Page = 'calendar' | 'ice' | 'bday';

const pageFromHash = (): Page => {
  const h = window.location.hash.replace('#', '');
  if (h === 'ice' || h === 'bday') return h;
  return 'calendar';
};

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [schoolHolidays, setSchoolHolidays] = useState<SchoolHoliday[]>([]);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewEvent, setViewEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Set<Category>>(new Set());
  const [showSchoolHolidays, setShowSchoolHolidays] = useState(true);
  const [page, setPage] = useState<Page>(pageFromHash());
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goto = (p: Page) => {
    window.location.hash = p === 'calendar' ? '' : p;
    setPage(p);
  };

  const toggleFilter = (cat: Category) => {
    setFilter((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const today = new Date();
  const displayYear = today.getFullYear() < 2026 ? 2026 : today.getFullYear();

  // Materialise birthdays into events for the visible year range (current year and next).
  const birthdayEvents: Event[] = useMemo(() => {
    const years = [displayYear, displayYear + 1];
    const out: Event[] = [];
    for (const b of birthdays) {
      for (const y of years) {
        out.push({
          id: `bday-${b.id}-${y}`,
          date: `${y}-${b.md}`,
          title: `🎂 ${b.name}`,
          category: 'All',
        });
      }
    }
    return out;
  }, [birthdays, displayYear]);

  const allEvents = useMemo(() => [...events, ...birthdayEvents], [events, birthdayEvents]);
  const visibleEvents = filter.size === 0 ? allEvents : allEvents.filter((e) => filter.has(e.category));
  const visibleHolidays = showSchoolHolidays ? schoolHolidays : [];

  useEffect(() => {
    if (!headerRef.current) return;
    const update = () => {
      const h = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    const ro = new ResizeObserver(update);
    ro.observe(headerRef.current);
    update();
    return () => ro.disconnect();
  }, [authed]);

  const loadData = () =>
    Promise.all([fetchEvents(), fetchSchoolHolidays(), fetchBirthdays()])
      .then(([ev, hol, bd]) => {
        setEvents(ev);
        setSchoolHolidays(hol);
        setBirthdays(bd);
        setAuthed(true);
      })
      .catch((e) => {
        if (e instanceof UnauthorisedError) {
          setAuthed(false);
        } else {
          setError(e.message ?? String(e));
          setAuthed(true);
        }
      });

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: Omit<Event, 'id'>) => {
    try {
      if (editingEvent) {
        const saved = await updateEvent(editingEvent.id, e);
        setEvents((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
        setEditingEvent(null);
      } else {
        const saved = await addEvent(e);
        setEvents((prev) => [...prev, saved]);
        setModalDate(null);
      }
    } catch (err) {
      alert(`Failed to save: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setViewEvent(null);
    } catch (err) {
      alert(`Failed to delete: ${(err as Error).message}`);
    }
  };

  const onEventClick = (id: string) => {
    // Birthdays are synthetic; don't open the event modal for them.
    if (id.startsWith('bday-')) return;
    const ev = events.find((x) => x.id === id);
    if (ev) setViewEvent(ev);
  };

  if (authed === null)
    return <div className="p-6 text-center" style={{ color: 'var(--text-muted)' }}>Loading…</div>;
  if (authed === false) return <PasswordGate onSuccess={loadData} />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header
        ref={headerRef}
        className="app-header px-4 py-3 sticky top-0 z-30"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => goto('calendar')}
              className="text-xl font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Weekends
            </button>
            <NavButton active={page === 'ice'} onClick={() => goto('ice')} label="Ice" />
            <NavButton active={page === 'bday'} onClick={() => goto('bday')} label="Bday" />
          </div>
          {page === 'calendar' && (
            <div className="hidden md:block flex-1 px-4">
              <CategoryLegend
                theme={theme}
                selected={filter}
                onToggle={toggleFilter}
                showSchoolHolidays={showSchoolHolidays}
                onToggleSchoolHolidays={() => setShowSchoolHolidays((v) => !v)}
                onClear={() => setFilter(new Set())}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 flex items-center justify-center text-lg"
              style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {page === 'calendar' && (
              <button
                onClick={() => setModalDate(ymd(today))}
                className="rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none"
                style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
                aria-label="Add event"
              >
                +
              </button>
            )}
          </div>
        </div>
        {page === 'calendar' && (
          <div className="md:hidden mt-2 overflow-x-auto">
            <CategoryLegend
              theme={theme}
              selected={filter}
              onToggle={toggleFilter}
              showSchoolHolidays={showSchoolHolidays}
              onToggleSchoolHolidays={() => setShowSchoolHolidays((v) => !v)}
              onClear={() => setFilter(new Set())}
            />
          </div>
        )}
      </header>
      <main className="flex-1">
        {error && (
          <div className="p-6 text-center" style={{ color: '#DC2626' }}>
            <div className="font-semibold">Couldn't load data</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        )}
        {!error && page === 'calendar' && (
          <>
            <YearGrid
              events={visibleEvents}
              schoolHolidays={visibleHolidays}
              theme={theme}
              onAddClick={(d) => setModalDate(d)}
              onEventClick={onEventClick}
            />
            <MonthView
              year={displayYear}
              events={visibleEvents}
              schoolHolidays={visibleHolidays}
              theme={theme}
              onAddClick={(d) => setModalDate(d)}
              onEventClick={onEventClick}
            />
          </>
        )}
        {!error && page === 'ice' && <IcePage />}
        {!error && page === 'bday' && <BdayPage birthdays={birthdays} onChange={setBirthdays} />}
      </main>
      {modalDate && !editingEvent && (
        <AddEventModal
          initialDate={modalDate}
          theme={theme}
          onClose={() => setModalDate(null)}
          onSave={handleSave}
        />
      )}
      {editingEvent && (
        <AddEventModal
          initialDate={editingEvent.date}
          initialEvent={editingEvent}
          theme={theme}
          onClose={() => setEditingEvent(null)}
          onSave={handleSave}
        />
      )}
      {viewEvent && (
        <EventModal
          event={viewEvent}
          theme={theme}
          onClose={() => setViewEvent(null)}
          onDelete={handleDelete}
          onEdit={(ev) => {
            setViewEvent(null);
            setEditingEvent(ev);
          }}
        />
      )}
    </div>
  );
}

function NavButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-2 py-1 rounded"
      style={{
        background: active ? 'var(--primary)' : 'var(--surface-2)',
        color: active ? 'var(--primary-fg)' : 'var(--text)',
        fontWeight: active ? 600 : 500,
      }}
    >
      {label}
    </button>
  );
}
