import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.JUDGE0_API_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}/challenge/get`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch from Golang' },
      { status: 500 }
    );
  }
}
