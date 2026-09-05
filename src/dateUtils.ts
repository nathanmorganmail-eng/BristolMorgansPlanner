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

export function currentQuarterStart(today = new Date()): Date {
  const q = Math.floor(today.getMonth() / 3);
  return new Date(today.getFullYear(), q * 3, 1);
}

// 4 quarters of Saturdays starting at quarterStart. Each quarter is the
// Saturdays whose date falls inside that 3-month calendar span.
export function rollingQuarters(quarterStart: Date): Date[][] {
  const quarters: Date[][] = [];
  for (let qi = 0; qi < 4; qi++) {
    const qStart = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + qi * 3, 1);
    const qEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + qi * 3 + 3, 0);
    const sats: Date[] = [];
    const d = new Date(qStart);
    while (d.getDay() !== 6) d.setDate(d.getDate() + 1);
    while (d <= qEnd) {
      sats.push(new Date(d));
      d.setDate(d.getDate() + 7);
    }
    quarters.push(sats);
  }
  return quarters;
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

// Generate every YYYY-MM-DD in [start, end] inclusive.
export function datesInRange(start: string, end: string): string[] {
  const out: string[] = [];
  const s = parseYmd(start);
  const e = parseYmd(end);
  for (let d = new Date(s); d <= e; d = addDays(d, 1)) out.push(ymd(d));
  return out;
}
