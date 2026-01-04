import type { Question, QuestionCardPreview } from '@/types/types';
import { http } from '@/lib/api/http';

type ChallengeListApiResponse = {
  challenges: Array<{
    id: number;
    title: string;
    description: string;
    sample_input: string;
    sample_output: string;
    created_at: string;
  }>;
  currentPage: number;
  totalPages: number;
};

type ChallengeByIdApiResponse = {
  challenge: {
    id: number;
    title: string;
    description: string;
    sample_input: string;
    sample_output: string;
    created_at: string;
  };
};

// Get all questions
export async function fetchQuestionsPreview(): Promise<QuestionCardPreview[]> {
  const data = await http<ChallengeListApiResponse>('/api/challenge/get', {
    cache: 'no-store',
  });

  return data.challenges.map((q) => ({
    id: q.id,
    title: q.title,
    description: q.description,
  }));
}

// Get question details by id
export async function fetchQuestion(id: string): Promise<Question> {
  const data = await http<ChallengeByIdApiResponse>(`/api/challenge/${id}`);
  const q = data.challenge;

  return {
    id: q.id,
    title: q.title,
    description: q.description,
    sample_input: q.sample_input,
    sample_output: q.sample_output,
  };
}
