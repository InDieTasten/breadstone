export interface Circuit {
  id: number;
  name: string;
}

export interface Version {
  name: string;
  version: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function getVersion(): Promise<Version> {
  return request<Version>('/api/version');
}

export function listCircuits(): Promise<Circuit[]> {
  return request<{ circuits: Circuit[] }>('/api/circuits').then((b) => b.circuits);
}

export function createCircuit(name: string): Promise<Circuit> {
  return request<Circuit>('/api/circuits', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}
