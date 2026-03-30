import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const backendApi = process.env.BACKEND_API;

  if (!backendApi) {
    return NextResponse.json(
      { ok: false, message: 'BACKEND_API is not configured' },
      { status: 500 }
    );
  }

  const submissionId = request.nextUrl.searchParams.get('id')?.trim();

  if (!submissionId) {
    return NextResponse.json(
      { ok: false, message: 'id is required' },
      { status: 400 }
    );
  }

  const url = `${backendApi.replace(/\/$/, '')}/challenge/submission/dsa`;

  try {
    const requestHeaders: Record<string, string> = {};
    const allowedHeaders = new Set(['authorization', 'accept']);

    for (const [key, value] of request.headers.entries()) {
      if (allowedHeaders.has(key.toLowerCase())) {
        requestHeaders[key] = value;
      }
    }

    const response = await axios.request<ArrayBuffer>({
      url,
      method: 'GET',
      headers: requestHeaders,
      params: { id: submissionId },
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
      { ok: false, message: 'backend submission fetch failed' },
      { status: 502 }
    );
  }
}
