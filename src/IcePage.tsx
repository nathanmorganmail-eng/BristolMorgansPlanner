import { FIXTURES } from './iceFixtures';

const dmy = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1];
  return `${String(d).padStart(2, '0')}-${mon}-${String(y).slice(2)}`;
};

const monthKey = (iso: string) => iso.slice(0, 7);

export function IcePage() {
  // Totals: away only, one-way ×2 for return
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
        <LegendChip label="SD Home"   bg="#d6efd0" bd="#7fb377" fg="#2a5a26" />
        <LegendChip label="SD Away"   bg="#fbf1c2" bd="#d6b64a" fg="#7a5f0e" />
        <LegendChip label="Pups Home" bg="#c94a7a" bd="#8a2352" fg="#fff" />
        <LegendChip label="Pups Away" bg="#fbd9e6" bd="#db7ca4" fg="#8a2352" />
        <span className="ml-auto">
          ↔ <b style={{ color: 'var(--text)' }}>{totalMiles.toLocaleString()}</b> away miles &nbsp;·&nbsp;
          ↔ <b style={{ color: 'var(--text)' }}>{totalHours}h</b> driving
        </span>
      </div>
      <div
        className="rounded overflow-x-auto"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
              {['Day', 'Date', 'Time', 'Who', 'Vs', 'H/A', 'Postcode', 'Miles', 'Drive', 'Y/N'].map((h) => (
                <th key={h} className="text-left px-2 py-1.5 font-semibold uppercase tracking-wide text-[10px]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIXTURES.map((f, i) => {
              const next = FIXTURES[i + 1];
              const monthEnd = !next || monthKey(next.date) !== monthKey(f.date);
              const row = rowStyle(f);
              return (
                <tr
                  key={`${f.date}-${f.team}-${f.vs}`}
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
                  <td className="px-2 py-1"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LegendChip({ label, bg, bd, fg }: { label: string; bg: string; bd: string; fg: string }) {
  return (
    <span
      style={{ background: bg, border: `1px solid ${bd}`, color: fg }}
      className="text-[11px] px-2 py-0.5 rounded"
    >
      {label}
    </span>
  );
}

function rowStyle(f: Fixture): { bg: string; fg: string; tagFg: string } {
  if (f.team === 'SD' && f.ha === 'Home')  return { bg: '#d6efd0', fg: '#14202b', tagFg: '#2a5a26' };
  if (f.team === 'SD' && f.ha === 'Away')  return { bg: '#fbf1c2', fg: '#14202b', tagFg: '#7a5f0e' };
  if (f.team === 'Pups' && f.ha === 'Home') return { bg: '#c94a7a', fg: '#fff',    tagFg: '#fff' };
  return { bg: '#fbd9e6', fg: '#14202b', tagFg: '#8a2352' };
}

type Fixture = (typeof FIXTURES)[number];
