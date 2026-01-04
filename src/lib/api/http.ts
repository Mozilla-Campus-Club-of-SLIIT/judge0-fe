import { AppErrorClass } from './errors';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HttpOptions<TBody = unknown> = {
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: {
    revalidate?: number;
  };
};

const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export async function http<TResponse, TBody = unknown>(
  url: string,
  options: HttpOptions<TBody> = {}
): Promise<TResponse> {
  const { method = 'GET', body, headers, cache = 'no-store', next } = options;

  const res = await fetch(url, {
    method,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  if (!res.ok) {
    let details = '';
    try {
      details = await res.text();
    } catch {}

    let kind: AppErrorClass['kind'] = 'http';
    if (res.status === 401) kind = 'unauthorized';
    else if (res.status === 403) kind = 'forbidden';
    else if (res.status === 404) kind = 'not_found';

    throw new AppErrorClass(
      kind,
      `Request failed (${res.status})`,
      res.status,
      url,
      method,
      details
    );
  }

  return (await res.json()) as TResponse;
}
