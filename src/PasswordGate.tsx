import { useState } from 'react';
import { login } from './api';

interface Props {
  onSuccess: () => void;
}

export function PasswordGate({ onSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(password);
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg)' }}
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-lg shadow-md p-6 w-full max-w-sm space-y-4"
        style={{ background: 'var(--surface)', color: 'var(--text)' }}
      >
        <h1 className="text-xl font-semibold">Weekends</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Enter the family password.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded px-3 py-2"
          style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
          autoFocus
          autoComplete="current-password"
          required
        />
        {error && <div className="text-sm" style={{ color: '#DC2626' }}>{error}</div>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded py-2 disabled:opacity-50"
          style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
        >
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
