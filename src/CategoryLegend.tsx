import { CATEGORIES, categoryColours } from './categories';
import type { Theme } from './theme';

export function CategoryLegend({ theme }: { theme: Theme }) {
  const colours = categoryColours(theme);
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {CATEGORIES.map((cat) => {
        const c = colours[cat];
        return (
          <span
            key={cat}
            style={{ background: c.bg, color: c.text, borderLeft: `3px solid ${c.border}` }}
            className="text-[11px] px-2 py-0.5 rounded"
          >
            {cat}
          </span>
        );
      })}
      <span className="text-[11px] px-2 py-0.5 rounded" style={{ background: 'var(--school-holiday)', color: 'var(--text)' }}>
        School holiday
      </span>
      <span className="text-[11px] px-2 py-0.5 rounded" style={{ color: 'var(--weekday-prefix)', border: '1px dashed var(--weekday-prefix)' }}>
        M/T/W/Th/F = weekday
      </span>
    </div>
  );
}
