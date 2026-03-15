const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchStress() {
  const res = await fetch(`${API_URL}/api/stress`);
  if (!res.ok) throw new Error('Failed to fetch stress data');
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${API_URL}/api/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}