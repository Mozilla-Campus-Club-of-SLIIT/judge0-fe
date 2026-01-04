import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/* 
    Instead of calling the backend directly from the browser, the frontend calls Next.js Route Handlers, which then forward the request to the backend server-to-server.
    There was an error when try to access from localhost that's why this was created.
    Add Backend api url as JUDGE0_API_BASE_URL in .env.Local.
*/

const API_BASE = process.env.JUDGE0_API_BASE_URL;

type ProxyOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  addAuth?: boolean;
  cache?: RequestCache;
};

export async function proxyJson(upstreamPath: string, opts: ProxyOptions = {}) {
  const { method = 'GET', body, addAuth = true, cache = 'no-store' } = opts;

  const token = addAuth
    ? (await cookies()).get('access_token')?.value
    : undefined;

  const res = await fetch(`${API_BASE}${upstreamPath}`, {
    method,
    cache,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text().catch(() => '');

  if (!res.ok) {
    return NextResponse.json(
      {
        error: 'Upstream error',
        status: res.status,
        payload,
      },
      { status: res.status }
    );
  }

  return NextResponse.json(payload, { status: res.status });
}
