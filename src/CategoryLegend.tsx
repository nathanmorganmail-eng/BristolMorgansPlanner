import { CATEGORIES, categoryColours } from './categories';
import type { Category } from './categories';
import type { Theme } from './theme';

interface Props {
  theme: Theme;
  selected: Set<Category>; // empty = no filter, show all
  onToggle: (cat: Category) => void;
  showSchoolHolidays: boolean;
  onToggleSchoolHolidays: () => void;
  onClear: () => void;
}

export function CategoryLegend({
  theme,
  selected,
  onToggle,
  showSchoolHolidays,
  onToggleSchoolHolidays,
  onClear,
}: Props) {
  const colours = categoryColours(theme);
  const filterActive = selected.size > 0;

  const dimmedStyle = (active: boolean): React.CSSProperties =>
    filterActive && !active
      ? { opacity: 0.35, filter: 'grayscale(0.6)' }
      : {};

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {CATEGORIES.map((cat) => {
        const c = colours[cat];
        const active = selected.has(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onToggle(cat)}
            style={{
              background: c.bg,
              color: c.text,
              borderLeft: `3px solid ${c.border}`,
              outline: active ? '2px solid var(--text)' : 'none',
              outlineOffset: 1,
              ...dimmedStyle(active),
            }}
            className="text-[11px] px-2 py-0.5 rounded transition-opacity"
            title={`Filter to ${cat}`}
          >
            {cat}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onToggleSchoolHolidays}
        className="text-[11px] px-2 py-0.5 rounded transition-opacity"
        style={{
          background: 'var(--school-holiday)',
          color: 'var(--text)',
          opacity: showSchoolHolidays ? 1 : 0.35,
          outline: showSchoolHolidays ? '2px solid var(--text)' : 'none',
          outlineOffset: 1,
        }}
        title="Toggle school holiday shading"
      >
        School holiday
      </button>
      <span
        className="text-[11px] px-2 py-0.5 rounded"
        style={{ color: 'var(--weekday-prefix)', border: '1px dashed var(--weekday-prefix)' }}
      >
        M/T/W/Th/F = weekday
      </span>
      {filterActive && (
        <button
          type="button"
          onClick={onClear}
          className="text-[11px] px-2 py-0.5 underline"
          style={{ color: 'var(--text-muted)' }}
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
