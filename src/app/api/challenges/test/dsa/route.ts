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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'invalid JSON body' },
      { status: 400 }
    );
  }

  try {
    const authHeader = request.headers.get('Authorization');
    const rep = await axios.post(
      `${backendApi.replace(/\/$/, '')}/challenge/test`,
      body,
      {
        headers: {
          Authorization: authHeader || '',
        },
      }
    );

    return NextResponse.json(rep.data?.result ?? rep.data, {
      status: rep.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;

      return NextResponse.json(
        {
          ok: false,
          message: 'challenge test request failed',
          error: error.response?.data ?? error.message,
        },
        { status }
      );
    }

    return NextResponse.json(
      { ok: false, message: 'unexpected server error' },
      { status: 500 }
    );
  }
}
