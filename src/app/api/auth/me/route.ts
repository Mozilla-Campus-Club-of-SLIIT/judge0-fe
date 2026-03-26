import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { UserResponse } from '@/types/types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://accounts.sliitmozilla.org/api';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const response = await fetch(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 });
      }
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: response.status }
      );
    }

    const userData = (await response.json()) as UserResponse;

    return NextResponse.json({
      success: true,
      data: {
        user: userData.data,
        token: authToken,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
