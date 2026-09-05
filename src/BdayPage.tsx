import { useState } from 'react';
import type { Birthday } from './api';
import { addBirthday, deleteBirthday } from './api';

interface Props {
  birthdays: Birthday[];
  onChange: (next: Birthday[]) => void;
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const prettyMd = (md: string) => {
  const [m, d] = md.split('-').map(Number);
  return `${String(d).padStart(2, '0')}-${MONTH_NAMES[m - 1]}`;
};

export function BdayPage({ birthdays, onChange }: Props) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(''); // yyyy-mm-dd from <input type="date">
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setErr(null);
    if (!name.trim() || !date) {
      setErr('Name and date required');
      return;
    }
    const md = date.slice(5); // MM-DD from YYYY-MM-DD
    setBusy(true);
    try {
      const b = await addBirthday(name.trim(), md);
      onChange([...birthdays, b].sort((a, b) => a.md.localeCompare(b.md)));
      setName('');
      setDate('');
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this birthday?')) return;
    try {
      await deleteBirthday(id);
      onChange(birthdays.filter((b) => b.id !== id));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-sm" style={{ color: 'var(--text)' }}>
      <h2 className="text-2xl font-semibold mb-1">Birthdays</h2>
      <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
        Recur every year. Shown on the calendar tagged <b>All</b>.
      </p>

      <form
        onSubmit={submit}
        className="flex flex-wrap gap-2 items-end mb-4 p-3 rounded"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <label className="flex flex-col text-xs" style={{ color: 'var(--text-muted)' }}>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 px-2 py-1 rounded"
            style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
            placeholder="e.g. Grandma"
          />
        </label>
        <label className="flex flex-col text-xs" style={{ color: 'var(--text-muted)' }}>
          Date (year ignored)
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 px-2 py-1 rounded"
            style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="px-3 py-1.5 rounded font-semibold text-sm"
          style={{ background: 'var(--primary)', color: 'var(--primary-fg)', opacity: busy ? 0.6 : 1 }}
        >
          {busy ? 'Adding…' : 'Add'}
        </button>
        {err && <span className="text-xs" style={{ color: '#DC2626' }}>{err}</span>}
      </form>

      {birthdays.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }} className="italic">No birthdays yet.</p>
      ) : (
        <div className="rounded overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                <th className="text-left px-3 py-1.5 text-[10px] uppercase tracking-wide">Name</th>
                <th className="text-left px-3 py-1.5 text-[10px] uppercase tracking-wide">Date</th>
                <th className="px-3 py-1.5"></th>
              </tr>
            </thead>
            <tbody>
              {[...birthdays]
                .sort((a, b) => a.md.localeCompare(b.md))
                .map((b) => (
                  <tr key={b.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-3 py-1.5">{b.name}</td>
                    <td className="px-3 py-1.5 tabular-nums">{prettyMd(b.md)}</td>
                    <td className="px-3 py-1.5 text-right">
                      <button
                        onClick={() => remove(b.id)}
                        className="text-xs underline"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
