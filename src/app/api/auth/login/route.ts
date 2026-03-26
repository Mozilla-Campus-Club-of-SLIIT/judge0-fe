import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { LoginResponse, UserResponse } from '@/types/types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://accounts.sliitmozilla.org/api';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call login API
    const loginResponse = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: 'Login failed',
          message: errorData.message || 'Invalid credentials',
        },
        { status: loginResponse.status }
      );
    }

    const loginData = (await loginResponse.json()) as LoginResponse;
    const accessToken = loginData.data.token;

    // Extract refreshToken from Set-Cookie header
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    let refreshToken: string | null = null;

    if (setCookieHeader) {
      // Parse Set-Cookie header to extract refreshToken value
      const match = setCookieHeader.match(/refreshToken=([^;]+)/);
      if (match) {
        refreshToken = match[1];
      }
    }

    // Fetch user
    const userResponse = await fetch(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    const userData = (await userResponse.json()) as UserResponse;

    // Set cookies
    const cookieStore = await cookies();

    // Set access token
    cookieStore.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    // Set refresh token if available
    if (refreshToken) {
      cookieStore.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }

    // Return user data and access token (for client-side context)
    return NextResponse.json({
      success: true,
      data: {
        user: userData.data,
        token: accessToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
