import { useState } from 'react';
import { FIXTURES, fixtureKey } from './iceFixtures';
import type { Fixture } from './iceFixtures';

const dmy = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1];
  return `${String(d).padStart(2, '0')}-${mon}-${String(y).slice(2)}`;
};

const monthKey = (iso: string) => iso.slice(0, 7);

type FilterKey = 'SD-Home' | 'SD-Away' | 'Pups-Home' | 'Pups-Away';
const filterKey = (f: Fixture): FilterKey => `${f.team}-${f.ha}` as FilterKey;

interface Props {
  going: Set<string>;
  onToggleGoing: (key: string) => void;
}

export function IcePage({ going, onToggleGoing }: Props) {
  const [filters, setFilters] = useState<Set<FilterKey>>(new Set());
  const [onlyGoing, setOnlyGoing] = useState(false);

  const toggleFilter = (k: FilterKey) =>
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const filtered = FIXTURES.filter((f) => {
    if (filters.size > 0 && !filters.has(filterKey(f))) return false;
    if (onlyGoing && !going.has(fixtureKey(f))) return false;
    return true;
  });

  const awayMiles = FIXTURES.filter((f) => f.ha === 'Away').reduce((s, f) => s + (f.miles ?? 0), 0);
  const awayDriveMin = FIXTURES.filter((f) => f.ha === 'Away').reduce((s, f) => {
    if (!f.drive) return s;
    const m = f.drive.match(/(\d+)h\s*(\d+)m/);
    return s + (m ? Number(m[1]) * 60 + Number(m[2]) : 0);
  }, 0);
  const totalMiles = awayMiles * 2;
  const totalHours = Math.round((awayDriveMin * 2) / 60);

  return (
    <div className="p-4 max-w-5xl mx-auto text-sm" style={{ color: 'var(--text)' }}>
      <h2 className="text-2xl font-semibold mb-1">Snowdogs & Pups</h2>
      <p className="mb-3" style={{ color: 'var(--text-muted)' }}>
        2026–27 fixtures. Distances and drive times are typical off-peak from home. Home rink: Cribbs Causeway (BS10 7SR).
      </p>
      <div className="mb-3 text-xs flex flex-wrap gap-3 items-center" style={{ color: 'var(--text-muted)' }}>
        {(['SD-Home','SD-Away','Pups-Home','Pups-Away'] as FilterKey[]).map((k) => (
          <FilterChip
            key={k}
            label={{
              'SD-Home':   'SD Home',
              'SD-Away':   'SD Away',
              'Pups-Home': 'Pups Home',
              'Pups-Away': 'Pups Away',
            }[k]}
            active={filters.has(k)}
            dimmed={filters.size > 0 && !filters.has(k)}
            style={chipStyleFor(k)}
            onClick={() => toggleFilter(k)}
          />
        ))}
        <button
          type="button"
          onClick={() => setOnlyGoing((v) => !v)}
          className="text-[11px] px-2 py-0.5 rounded border"
          style={{
            background: onlyGoing ? 'var(--primary)' : 'transparent',
            color: onlyGoing ? 'var(--primary-fg)' : 'var(--text)',
            borderColor: 'var(--border)',
            fontWeight: 600,
          }}
        >
          Only Y
        </button>
        {(filters.size > 0 || onlyGoing) && (
          <button
            type="button"
            onClick={() => { setFilters(new Set()); setOnlyGoing(false); }}
            className="text-[11px] px-2 py-0.5 underline"
            style={{ color: 'var(--text-muted)' }}
          >
            Clear
          </button>
        )}
        <span className="ml-auto">
          ↔ <b style={{ color: 'var(--text)' }}>{totalMiles.toLocaleString()}</b> away miles &nbsp;·&nbsp;
          ↔ <b style={{ color: 'var(--text)' }}>{totalHours}h</b> driving
        </span>
      </div>
      <div
        className="rounded overflow-auto"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          maxHeight: 'calc(100vh - var(--header-h, 56px) - 180px)',
        }}
      >
        <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)' }}>
              {['Day', 'Date', 'Time', 'Who', 'Vs', 'H/A', 'Postcode', 'Miles', 'Drive', 'Y'].map((h) => (
                <th
                  key={h}
                  className="text-left px-2 py-1.5 font-semibold uppercase tracking-wide text-[10px] sticky top-0 z-10"
                  style={{
                    background: 'var(--surface-2)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => {
              const next = filtered[i + 1];
              const monthEnd = !next || monthKey(next.date) !== monthKey(f.date);
              const row = rowStyle(f);
              const key = fixtureKey(f);
              const isGoing = going.has(key);
              return (
                <tr
                  key={key}
                  style={{
                    background: row.bg,
                    color: row.fg,
                    borderBottom: monthEnd ? '3px solid var(--text)' : '1px solid var(--border)',
                  }}
                >
                  <td className="px-2 py-1">{f.day}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{dmy(f.date)}</td>
                  <td className="px-2 py-1 tabular-nums">{f.time}</td>
                  <td className="px-2 py-1 font-semibold">{f.team}</td>
                  <td className="px-2 py-1">{f.vs}</td>
                  <td className="px-2 py-1 font-semibold uppercase text-[10px] tracking-wide" style={{ color: row.tagFg }}>
                    {f.ha}
                  </td>
                  <td className="px-2 py-1 tabular-nums">{f.postcode ?? '—'}</td>
                  <td className="px-2 py-1 tabular-nums">{f.miles ?? '—'}</td>
                  <td className="px-2 py-1 tabular-nums">{f.drive ?? '—'}</td>
                  <td className="px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={isGoing}
                      onChange={() => onToggleGoing(key)}
                      style={{ cursor: 'pointer', accentColor: row.tagFg }}
                      aria-label={`Going to ${f.team} vs ${f.vs}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  dimmed,
  style,
  onClick,
}: {
  label: string;
  active: boolean;
  dimmed: boolean;
  style: { bg: string; bd: string; fg: string };
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: style.bg,
        border: `1px solid ${style.bd}`,
        color: style.fg,
        outline: active ? '2px solid var(--text)' : 'none',
        outlineOffset: 1,
        opacity: dimmed ? 0.4 : 1,
        filter: dimmed ? 'grayscale(0.5)' : 'none',
      }}
      className="text-[11px] px-2 py-0.5 rounded transition-opacity"
    >
      {label}
    </button>
  );
}

function chipStyleFor(k: FilterKey): { bg: string; bd: string; fg: string } {
  switch (k) {
    case 'SD-Home':   return { bg: '#d6efd0', bd: '#7fb377', fg: '#2a5a26' };
    case 'SD-Away':   return { bg: '#fbf1c2', bd: '#d6b64a', fg: '#7a5f0e' };
    case 'Pups-Home': return { bg: '#c94a7a', bd: '#8a2352', fg: '#fff' };
    case 'Pups-Away': return { bg: '#fbd9e6', bd: '#db7ca4', fg: '#8a2352' };
  }
}

function rowStyle(f: Fixture): { bg: string; fg: string; tagFg: string } {
  if (f.team === 'SD' && f.ha === 'Home')  return { bg: '#d6efd0', fg: '#14202b', tagFg: '#2a5a26' };
  if (f.team === 'SD' && f.ha === 'Away')  return { bg: '#fbf1c2', fg: '#14202b', tagFg: '#7a5f0e' };
  if (f.team === 'Pups' && f.ha === 'Home') return { bg: '#c94a7a', fg: '#fff',    tagFg: '#fff' };
  return { bg: '#fbd9e6', fg: '#14202b', tagFg: '#8a2352' };
}
