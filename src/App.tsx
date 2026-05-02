import { useEffect, useState } from 'react';
import { YearGrid } from './YearGrid';
import { MonthView } from './MonthView';
import { AddEventModal } from './AddEventModal';
import { EventModal } from './EventModal';
import { PasswordGate } from './PasswordGate';
import { CategoryLegend } from './CategoryLegend';
import { ymd } from './dateUtils';
import { fetchEvents, fetchSchoolHolidays, addEvent, deleteEvent, UnauthorisedError } from './api';
import { useTheme } from './theme';
import type { Event, SchoolHoliday } from './types';
import './App.css';

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [schoolHolidays, setSchoolHolidays] = useState<SchoolHoliday[]>([]);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [viewEvent, setViewEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const displayYear = today.getFullYear() < 2026 ? 2026 : today.getFullYear();

  const loadData = () =>
    Promise.all([fetchEvents(), fetchSchoolHolidays()])
      .then(([ev, hol]) => {
        setEvents(ev);
        setSchoolHolidays(hol);
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
      const saved = await addEvent(e);
      setEvents((prev) => [...prev, saved]);
      setModalDate(null);
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

  if (authed === null)
    return <div className="p-6 text-center" style={{ color: 'var(--text-muted)' }}>Loading…</div>;
  if (authed === false) return <PasswordGate onSuccess={loadData} />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header
        className="px-4 py-3 sticky top-0 z-20 md:static"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Weekends {displayYear}</h1>
          <div className="hidden md:block flex-1 px-4">
            <CategoryLegend theme={theme} />
          </div>
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
            <button
              onClick={() => setModalDate(ymd(today))}
              className="rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
              aria-label="Add event"
            >
              +
            </button>
          </div>
        </div>
        <div className="md:hidden mt-2 overflow-x-auto">
          <CategoryLegend theme={theme} />
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        {error && (
          <div className="p-6 text-center" style={{ color: '#DC2626' }}>
            <div className="font-semibold">Couldn't load data</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        )}
        {!error && (
          <>
            <YearGrid
              year={displayYear}
              events={events}
              schoolHolidays={schoolHolidays}
              theme={theme}
              onAddClick={(d) => setModalDate(d)}
              onEventClick={(e) => setViewEvent(e)}
            />
            <MonthView
              year={displayYear}
              events={events}
              schoolHolidays={schoolHolidays}
              theme={theme}
              onAddClick={(d) => setModalDate(d)}
              onEventClick={(e) => setViewEvent(e)}
            />
          </>
        )}
      </main>
      {modalDate && (
        <AddEventModal
          initialDate={modalDate}
          theme={theme}
          onClose={() => setModalDate(null)}
          onSave={handleSave}
        />
      )}
      {viewEvent && (
        <EventModal
          event={viewEvent}
          theme={theme}
          onClose={() => setViewEvent(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
