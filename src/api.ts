import type { Event, SchoolHoliday } from './types';
import type { Category } from './categories';

interface EventRow {
  id: string;
  date: string;
  end_date: string | null;
  title: string;
  category: Category;
  time: string | null;
  location: string | null;
  link: string | null;
}

function rowToEvent(r: EventRow): Event {
  return {
    id: r.id,
    date: r.date,
    endDate: r.end_date ?? undefined,
    title: r.title,
    category: r.category,
    time: r.time ?? undefined,
    location: r.location ?? undefined,
    link: r.link ?? undefined,
  };
}

interface HolidayRow {
  id: string;
  start_date: string;
  end_date: string;
  label: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: 'include', ...init });
  if (res.status === 401) {
    throw new UnauthorisedError();
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export class UnauthorisedError extends Error {
  constructor() {
    super('Unauthorised');
    this.name = 'UnauthorisedError';
  }
}

export async function login(password: string): Promise<void> {
  const res = await fetch('/api/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Login failed');
  }
}

export async function fetchEvents(): Promise<Event[]> {
  const rows = await request<EventRow[]>('/api/events');
  return rows.map(rowToEvent);
}

export async function fetchSchoolHolidays(): Promise<SchoolHoliday[]> {
  const rows = await request<HolidayRow[]>('/api/school_holidays');
  return rows.map((r) => ({
    id: r.id,
    start: r.start_date,
    end: r.end_date,
    label: r.label,
  }));
}

export async function deleteEvent(id: string): Promise<void> {
  await request(`/api/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function addEvent(e: Omit<Event, 'id'>): Promise<Event> {
  const r = await request<EventRow>('/api/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(e),
  });
  return rowToEvent(r);
}

export async function updateEvent(id: string, e: Omit<Event, 'id'>): Promise<Event> {
  const r = await request<EventRow>(`/api/events?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(e),
  });
  return rowToEvent(r);
}
