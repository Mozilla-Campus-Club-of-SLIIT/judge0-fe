import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload;

    if (!body.email || !body.password) {
      return NextResponse.json(
        { ok: false, message: 'email and password are required' },
        { status: 400 }
      );
    }

    const authApi = process.env.AUTH_API;

    if (!authApi) {
      return NextResponse.json(
        { ok: false, message: 'AUTH_API is not configured' },
        { status: 500 }
      );
    }

    const response = await axios.post(
      `${authApi.replace(/\/$/, '')}/login`,
      {
        email: body.email,
        password: body.password,
      },
      {
        timeout: 10000,
        withCredentials: true,
      }
    );

    console.log('AUTH_API /login response:', {
      status: response.status,
      data: response.data.data,
    });

    const nextResponse = NextResponse.json(
      {
        accessToken: response.data.data.token,
      },
      { status: response.status }
    );

    const refreshTokenCookie = response.headers['set-cookie'];
    const refreshTokenHeader = Array.isArray(refreshTokenCookie)
      ? refreshTokenCookie.find((cookie) => cookie.startsWith('refreshToken='))
      : refreshTokenCookie;

    if (refreshTokenHeader) {
      const refreshTokenValue = refreshTokenHeader
        .split(';')[0]
        .replace('refreshToken=', '');

      if (refreshTokenValue) {
        nextResponse.cookies.set({
          name: 'refreshToken',
          value: refreshTokenValue,
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        });
      }
    }

    return nextResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status ?? 502;
      const data = axiosError.response?.data;

      console.log('AUTH_API /login error response:', {
        status,
        data,
      });

      return NextResponse.json(
        {
          ok: false,
          message: 'login request failed',
          error: data ?? axiosError.message,
        },
        { status }
      );
    }

    return NextResponse.json({ message: 'invalid JSON body' }, { status: 400 });
  }
}
