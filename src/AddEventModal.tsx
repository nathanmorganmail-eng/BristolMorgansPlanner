import { useState, useEffect } from 'react';
import { CATEGORIES, CATEGORY_COLOURS } from './categories';
import type { Category } from './categories';
import type { Event } from './types';

interface Props {
  initialDate: string;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
}

export function AddEventModal({ initialDate, onClose, onSave }: Props) {
  const [date, setDate] = useState(initialDate);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => setDate(initialDate), [initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      date,
      title: title.trim(),
      category,
      time: time || undefined,
      location: location || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 p-0 md:p-4" onClick={onClose}>
      <div
        className="bg-white w-full md:max-w-md md:rounded-lg rounded-t-2xl shadow-xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Add event</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((c) => {
                const col = CATEGORY_COLOURS[c];
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
                    }}
                    className={`px-2 py-1.5 rounded text-sm border-2 ${selected ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Time (optional)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Location (optional)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
