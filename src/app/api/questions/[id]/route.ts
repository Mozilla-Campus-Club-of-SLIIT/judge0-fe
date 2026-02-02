import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const baseUrl = process.env.JUDGE0_API_BASE_URL;
  const { id } = params;

  try {
    const res = await fetch(`${baseUrl}/api/questions/${id}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }
}
