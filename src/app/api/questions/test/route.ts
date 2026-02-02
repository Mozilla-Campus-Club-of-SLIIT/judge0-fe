import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const baseUrl = process.env.JUDGE0_API_BASE_URL;
  const body = await request.json();

  try {
    const res = await fetch(`${baseUrl}/test-endpoint-on-golang`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 });
  }
}
