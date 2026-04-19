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

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';

    const url = `${normalizeBackendApi(backendApi)}/admin/linux/challenges?page=${page}&pageSize=${pageSize}`;
    const authHeader = request.headers.get('Authorization');

    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: authHeader || '',
      },
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
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

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { ok: false, message: 'Challenge ID is required' },
        { status: 400 }
      );
    }

    const url = `${normalizeBackendApi(backendApi)}/admin/challenges/${id}`;
    const authHeader = request.headers.get('Authorization');

    const response = await axios.delete(url, {
      headers: {
        Accept: 'application/json',
        Authorization: authHeader || '',
      },
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
