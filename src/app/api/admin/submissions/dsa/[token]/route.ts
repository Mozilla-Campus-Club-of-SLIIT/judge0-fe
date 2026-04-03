import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const normalizeBackendApi = (value: string) => {
  const trimmed = value.trim().replace(/\/$/, '');

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `http://${trimmed}`;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const backendApi = process.env.BACKEND_API;

  if (!backendApi) {
    return NextResponse.json(
      { ok: false, message: 'BACKEND_API is not configured' },
      { status: 500 }
    );
  }

  const { token } = await params;

  if (!token) {
    return NextResponse.json(
      { ok: false, message: 'token is required' },
      { status: 400 }
    );
  }

  const url = `${normalizeBackendApi(backendApi)}/admin/submissions/dsa/${token}/details`;

  try {
    const authHeader = request.headers.get('Authorization');

    const response = await axios.get(url, {
      params: {
        base64_encoded: 'true',
        fields:
          'source_code,stdin,expected_output,stdout,stderr,status,language_id',
      },
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
          message: 'submission details fetch failed',
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
