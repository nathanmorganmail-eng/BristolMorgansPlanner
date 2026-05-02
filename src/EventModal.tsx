import { categoryColours } from './categories';
import type { Event } from './types';
import type { Theme } from './theme';
import { parseYmd } from './dateUtils';

interface Props {
  event: Event;
  theme: Theme;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function EventModal({ event, theme, onClose, onDelete }: Props) {
  const colours = categoryColours(theme);
  const c = colours[event.category];
  const dateLabel = parseYmd(event.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDelete = () => {
    if (confirm(`Delete "${event.title}"?`)) {
      onDelete(event.id);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-md md:rounded-lg rounded-t-2xl shadow-xl p-5 space-y-3"
        style={{ background: 'var(--surface)', color: 'var(--text)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">{event.title}</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{dateLabel}</div>
          </div>
          <span
            style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
            className="px-2 py-1 rounded text-xs"
          >
            {event.category}
          </span>
        </div>
        {event.time && (
          <div className="text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Time: </span>
            {event.time}
          </div>
        )}
        {event.location && (
          <div className="text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Location: </span>
            {event.location}
          </div>
        )}
        {event.link && (
          <div className="text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Link: </span>
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
              style={{ color: 'var(--primary)' }}
            >
              {event.link}
            </a>
          </div>
        )}
        <div className="flex justify-between gap-2 pt-2">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded text-sm hover:opacity-80"
            style={{ color: '#DC2626', border: '1px solid #DC2626' }}
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm"
            style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
