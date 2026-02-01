const baseUrl = process.env.NEXT_PUBLIC_JUDGE0_API_BASE_URL;
console.log(baseUrl);

export async function fetchQuestionsPreview() {
  const res = await fetch(`${baseUrl}/api/challenge/get`);
  if (!res.ok) {
    throw new Error('Failed to fetch questions preview');
  }
  return res.json();
}

export async function fetchQuestion(id: string) {
  const res = await fetch(`${baseUrl}/api/questions/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch question');
  }
  return res.json();
}
