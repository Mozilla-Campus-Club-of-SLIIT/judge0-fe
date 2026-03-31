import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const authApi = process.env.AUTH_API;

  if (!authApi) {
    return NextResponse.json(
      { ok: false, message: 'AUTH_API is not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await axios.post(
      `${authApi.replace(/\/$/, '')}/token/refresh`,
      {},
      {
        headers: {
          cookie: request.headers.get('cookie') ?? '',
        },
        timeout: 10000,
        withCredentials: true,
      }
    );

    const token = response.data?.data?.token;

    if (!token) {
      return NextResponse.json(
        { ok: false, message: 'token missing in refresh response' },
        { status: 502 }
      );
    }

    const nextResponse = NextResponse.json(
      {
        accessToken: token,
      },
      { status: 200 }
    );

    return nextResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      const data = error.response?.data;

      return NextResponse.json(
        {
          ok: false,
          message: 'refresh request failed',
          error: data ?? error.message,
        },
        { status }
      );
    }

    return NextResponse.json(
      { ok: false, message: 'unexpected refresh error' },
      { status: 500 }
    );
  }
}
