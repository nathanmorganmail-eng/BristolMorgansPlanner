import { useState, useEffect } from 'react';
import { CATEGORIES, categoryColours } from './categories';
import type { Category } from './categories';
import type { Event } from './types';
import type { Theme } from './theme';

interface Props {
  initialDate: string;
  initialEvent?: Event;
  theme: Theme;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
}

export function AddEventModal({ initialDate, initialEvent, theme, onClose, onSave }: Props) {
  const colours = categoryColours(theme);
  const isEdit = !!initialEvent;
  const [date, setDate] = useState(initialEvent?.date ?? initialDate);
  const [endDate, setEndDate] = useState(initialEvent?.endDate ?? '');
  const [title, setTitle] = useState(initialEvent?.title ?? '');
  const [category, setCategory] = useState<Category>(initialEvent?.category ?? 'All');
  const [time, setTime] = useState(initialEvent?.time ?? '');
  const [location, setLocation] = useState(initialEvent?.location ?? '');
  const [link, setLink] = useState(initialEvent?.link ?? '');

  useEffect(() => {
    if (!initialEvent) setDate(initialDate);
  }, [initialDate, initialEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    // Only treat as multi-day if endDate is set and after start
    const validEnd = endDate && endDate > date ? endDate : undefined;
    onSave({
      date,
      endDate: validEnd,
      title: title.trim(),
      category,
      time: time || undefined,
      location: location || undefined,
      link: link || undefined,
    });
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--surface-2)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-md md:rounded-lg rounded-t-2xl shadow-xl p-5"
        style={{ background: 'var(--surface)', color: 'var(--text)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">{isEdit ? 'Edit event' : 'Add event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>From</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded px-3 py-2"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>To (optional)</label>
              <input
                type="date"
                value={endDate}
                min={date}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded px-3 py-2"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded px-3 py-2"
              style={inputStyle}
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((c) => {
                const col = colours[c];
                const selected = c === category;
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      background: col.bg,
                      color: col.text,
                      borderColor: selected ? col.border : 'transparent',
                      outline: selected ? '3px solid var(--text)' : 'none',
                      outlineOffset: 2,
                      fontWeight: selected ? 700 : 400,
                    }}
                    className="px-2 py-1.5 rounded text-sm border-2"
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Time (optional)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded px-3 py-2"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Location (optional)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded px-3 py-2"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Link (optional)</label>
            <input
              type="text"
              inputMode="url"
              placeholder="https://…"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded px-3 py-2"
              style={inputStyle}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2" style={{ color: 'var(--text-muted)' }}>
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              {isEdit ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
