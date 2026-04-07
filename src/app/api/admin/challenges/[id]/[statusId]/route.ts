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
  { params }: { params: Promise<{ id: string; statusId: string }> }
) {
  const backendApi = process.env.BACKEND_API;

  if (!backendApi) {
    return NextResponse.json(
      { ok: false, message: 'BACKEND_API is not configured' },
      { status: 500 }
    );
  }

  const { id, statusId } = await params;

  if (!id || !statusId) {
    return NextResponse.json(
      { ok: false, message: 'id and statusId are required' },
      { status: 400 }
    );
  }

  const url = `${normalizeBackendApi(backendApi)}/admin/challenges/${id}/${statusId}`;

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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;

      return NextResponse.json(
        {
          ok: false,
          message: 'challenge status update failed',
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
