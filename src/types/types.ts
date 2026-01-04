export type QuestionCardPreview = {
  id: number;
  title: string;
  description: string;
};

export type Question = {
  id: number;
  title: string;
  description: string;
  sample_input: string;
  sample_output: string;
  created_at?: string;
};

export type QuestionTest = {
  code: string;
  sample_input: string;
  sample_output: string;
};

export type QuestionByIdApiResponse = {
  challenge: Question;
};

export type QuestionListApiResponse = {
  challenges: Question[];
  currentPage: number;
  totalPages: number;
};
