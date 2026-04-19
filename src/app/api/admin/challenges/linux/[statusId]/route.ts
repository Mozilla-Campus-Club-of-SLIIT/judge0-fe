import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const normalizeBackendApi = (value: string) => {
  const trimmed = value.trim().replace(/\/$/, '');

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `http://${trimmed}`;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ statusId: string }> }
) {
  const backendApi = process.env.BACKEND_API;

  if (!backendApi) {
    return NextResponse.json(
      { ok: false, message: 'BACKEND_API is not configured' },
      { status: 500 }
    );
  }

  const { statusId } = await params;

  if (!statusId) {
    return NextResponse.json(
      { ok: false, message: 'statusId is required' },
      { status: 400 }
    );
  }

  const url = `${normalizeBackendApi(backendApi)}/admin/linux/challenges/${statusId}`;

  try {
    const authHeader = request.headers.get('Authorization');

    const response = await axios.patch(url, null, {
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
