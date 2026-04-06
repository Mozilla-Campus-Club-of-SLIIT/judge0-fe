import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

async function _getTokens(code: string) {
  const authApi = process.env.AUTH_API;

  if (!authApi) {
    throw NextResponse.json(
      { ok: false, message: 'AUTH_API is not configured' },
      { status: axios.HttpStatusCode.InternalServerError }
    );
  }

  try {
    const response = await axios.post(
      authApi + '/token',
      {},
      {
        params: {
          code,
        },
      }
    );

    const refreshTokenCookie = response.headers['set-cookie'];
    const refreshTokenHeader = Array.isArray(refreshTokenCookie)
      ? refreshTokenCookie.find((cookie) => cookie.startsWith('refreshToken='))
      : refreshTokenCookie;

    let refreshToken = null;
    if (refreshTokenHeader)
      refreshToken = refreshTokenHeader
        .split(';')[0]
        .replace('refreshToken=', '');

    return { accessToken: response.data.data.token, refreshToken };
  } catch (err) {
    console.error({ err });
    throw err;
  }
}

async function _getAccountsUser(token: string) {
  const authApi = process.env.AUTH_API;

  if (!authApi) {
    throw NextResponse.json(
      { ok: false, message: 'AUTH_API is not configured' },
      { status: axios.HttpStatusCode.InternalServerError }
    );
  }

  const response = await axios.get(authApi + '/users/me', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });

  return response.data.data;
}

async function _registerUser(user: {
  name: string;
  email: string;
  id: string;
}) {
  const backendApi = process.env.BACKEND_API;

  if (!backendApi) {
    throw NextResponse.json(
      { ok: false, message: 'BACKEND_API is not configured' },
      { status: axios.HttpStatusCode.InternalServerError }
    );
  }

  try {
    const response = await axios.post(backendApi + '/user/register', {
      user_id: user.id,
      name: user.name,
      email: user.email,
    });
    console.log(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.status === 409) {
        return console.info('user already registered');
      }
    }
    console.error({ error });
    throw error;
  }
}

async function _login(token: string) {
  const nextResponse = NextResponse.json(
    {
      accessToken: token,
    },
    { status: axios.HttpStatusCode.Ok }
  );

  return nextResponse;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code)
    return NextResponse.json(
      { ok: false, message: 'code is required' },
      { status: axios.HttpStatusCode.BadRequest }
    );

  try {
    const { accessToken, refreshToken } = await _getTokens(code);
    const user = await _getAccountsUser(accessToken);
    _registerUser(user);

    const response = NextResponse.json({ accessToken });
    if (refreshToken)
      response.cookies.set({
        name: 'refreshToken',
        value: refreshToken,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

    return response;
  } catch (errResponse) {
    if (errResponse instanceof NextResponse) return errResponse;
    if (axios.isAxiosError(errResponse)) {
      const axiosError = errResponse as AxiosError;
      const status = axiosError.response?.status ?? 502;
      const data = axiosError.response?.data;

      return NextResponse.json(
        {
          ok: false,
          message: 'request failed',
          error: data ?? axiosError.message,
        },
        { status }
      );
    }
    console.error(errResponse);
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: axios.HttpStatusCode.InternalServerError }
    );
  }
}
