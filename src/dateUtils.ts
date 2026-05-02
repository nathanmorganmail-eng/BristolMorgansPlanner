export function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseYmd(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function saturdaysInYear(year: number): Date[] {
  const sats: Date[] = [];
  const d = new Date(year, 0, 1);
  while (d.getDay() !== 6) d.setDate(d.getDate() + 1);
  while (d.getFullYear() === year) {
    sats.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return sats;
}

export function monthName(m: number, short = false): string {
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return short ? names[m].slice(0, 3) : names[m];
}

export function isInRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}

// Returns 'M' | 'T' | 'W' | 'Th' | 'F' for Mon-Fri, or '' for Sat/Sun.
export function weekdayPrefix(d: Date): string {
  return ['', 'M', 'T', 'W', 'Th', 'F', ''][d.getDay()];
}

// For a given Saturday, return the dates of the preceding Mon-Fri (5 days).
export function weekdaysBefore(saturday: Date): Date[] {
  return [5, 4, 3, 2, 1].map((n) => addDays(saturday, -n));
}
