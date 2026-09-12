import type { Iceberg, VesselInfo } from '@/types';

export interface DashboardResponse {
  timestamp: string;
  vessel: VesselInfo & { source?: string; live?: boolean };
  ocean: { available?: boolean; source?: string; u?: number; v?: number; reason?: string };
  icebergs: { source?: string; live?: boolean; items?: Iceberg[]; message?: string };
  sources: Record<string, boolean>;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function fetchDashboard(signal?: AbortSignal): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE}/api/dashboard`, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`POLARIS data gateway returned ${response.status}`);
  return response.json() as Promise<DashboardResponse>;
}

export async function fetchHealth(signal?: AbortSignal) {
  const response = await fetch(`${API_BASE}/api/health`, { signal });
  if (!response.ok) throw new Error('POLARIS backend is unavailable');
  return response.json() as Promise<{ ok: boolean; timestamp: string }>;
}

export { API_BASE };
