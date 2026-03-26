import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://accounts.sliitmozilla.org/api';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (refreshToken) {
      await fetch(`${API_BASE}/logout`, { method: 'POST' }).catch((err) => {
        console.error('Error calling external logout API:', err);
      });
    }

    cookieStore.delete('auth_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
