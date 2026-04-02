import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const backendApi = process.env.BACKEND_API;

  if (!backendApi) {
    return NextResponse.json(
      { ok: false, message: 'BACKEND_API is not configured' },
      { status: 500 }
    );
  }

  const url = `${backendApi.replace(/\/$/, '')}/challenge/submit/dsa`;

  try {
    const body = await request.arrayBuffer();

    const requestHeaders: Record<string, string> = {};
    const allowedHeaders = new Set(['content-type', 'authorization']);

    for (const [key, value] of request.headers.entries()) {
      if (allowedHeaders.has(key.toLowerCase())) {
        requestHeaders[key] = value;
      }
    }

    const response = await axios.request<ArrayBuffer>({
      url,
      method: 'POST',
      headers: requestHeaders,
      data: body.byteLength > 0 ? body : undefined,
      responseType: 'arraybuffer',
      validateStatus: () => true,
    });

    const responseHeaders = new Headers();

    Object.entries(response.headers).forEach(([key, value]) => {
      if (!value) return;

      if (Array.isArray(value)) {
        value.forEach((v) => responseHeaders.append(key, String(v)));
      } else {
        responseHeaders.set(key, String(value));
      }
    });

    return new NextResponse(response.data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: 'backend submit request failed' },
      { status: 502 }
    );
  }
}
