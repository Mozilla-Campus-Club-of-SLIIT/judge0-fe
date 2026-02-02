export async function fetchQuestionsPreview() {
  const res = await fetch(`/api/challenges/preview`);
  if (!res.ok) {
    throw new Error('Failed to fetch questions preview');
  }
  return res.json();
}

export async function fetchQuestion(id: string) {
  const res = await fetch(`/api/questions/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch question');
  }
  return res.json();
}
