import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const normalizeBackendApi = (value: string) => {
  const trimmed = value.trim().replace(/\/$/, '');

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `http://${trimmed}`;
};

export async function GET(request: NextRequest) {
  const backendApi = process.env.BACKEND_API;

  if (!backendApi) {
    return NextResponse.json(
      { ok: false, message: 'BACKEND_API is not configured' },
      { status: 500 }
    );
  }

  const page = request.nextUrl.searchParams.get('page') ?? '1';
  const pageSize = request.nextUrl.searchParams.get('pageSize') ?? '10';

  const url = `${normalizeBackendApi(backendApi)}/admin/dsa/challenges`;

  try {
    const authHeader = request.headers.get('Authorization');

    const response = await axios.get(url, {
      params: { page, pageSize },
      headers: {
        Accept: 'application/json',
        Authorization: authHeader || '',
      },
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;

      return NextResponse.json(
        {
          ok: false,
          message: 'admin dsa challenges fetch failed',
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

export async function DELETE(request: NextRequest) {
  const backendApi = process.env.BACKEND_API;

  if (!backendApi) {
    return NextResponse.json(
      { ok: false, message: 'BACKEND_API is not configured' },
      { status: 500 }
    );
  }

  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { ok: false, message: 'id is required' },
      { status: 400 }
    );
  }

  const url = `${normalizeBackendApi(backendApi)}/admin/challenges/${id}`;

  try {
    const authHeader = request.headers.get('Authorization');

    const response = await axios.delete(url, {
      headers: {
        Accept: 'application/json',
        Authorization: authHeader || '',
      },
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;

      return NextResponse.json(
        {
          ok: false,
          message: 'admin dsa challenge delete failed',
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
