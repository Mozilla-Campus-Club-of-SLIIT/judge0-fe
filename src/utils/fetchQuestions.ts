import { Question, QuestionCardPreview } from '@/types/types';

export interface ChallengesResponse {
  challenges: QuestionCardPreview[];
  currentPage: number;
  totalPages: number;
}

export async function fetchQuestionsPreview(): Promise<ChallengesResponse> {
  const res = await fetch(`/api/challenges/preview`);
  if (!res.ok) {
    throw new Error('Failed to fetch questions preview');
  }
  return res.json();
}

export async function fetchQuestion(id: string): Promise<Question> {
  const res = await fetch(`/api/questions/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch question');
  }
  return res.json();
}
