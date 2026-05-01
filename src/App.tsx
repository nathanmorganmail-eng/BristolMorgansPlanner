import { useEffect, useState } from 'react';
import { YearGrid } from './YearGrid';
import { MonthView } from './MonthView';
import { AddEventModal } from './AddEventModal';
import { PasswordGate } from './PasswordGate';
import { ymd } from './dateUtils';
import { fetchEvents, fetchSchoolHolidays, addEvent, UnauthorisedError } from './api';
import type { Event, SchoolHoliday } from './types';
import './App.css';

export default function App() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [schoolHolidays, setSchoolHolidays] = useState<SchoolHoliday[]>([]);
  const [modalDate, setModalDate] = useState<string | null>(null);
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

  if (authed === null) return <div className="p-6 text-center text-gray-500">Loading…</div>;
  if (authed === false) return <PasswordGate onSuccess={loadData} />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-20 md:static">
        <h1 className="text-xl font-semibold">Weekends {displayYear}</h1>
        <button
          onClick={() => setModalDate(ymd(today))}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none"
          aria-label="Add event"
        >
          +
        </button>
      </header>
      <main className="flex-1 overflow-auto">
        {error && (
          <div className="p-6 text-center text-red-600">
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
              onAddClick={(d) => setModalDate(d)}
            />
            <MonthView
              year={displayYear}
              events={events}
              schoolHolidays={schoolHolidays}
              onAddClick={(d) => setModalDate(d)}
            />
          </>
        )}
      </main>
      {modalDate && (
        <AddEventModal
          initialDate={modalDate}
          onClose={() => setModalDate(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
