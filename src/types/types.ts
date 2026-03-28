export type DSAChallengeType = {
  created_at: string;
  description: string;
  id: number;
  marks: number;
  note: string | null;
  sample_input: string;
  sample_output: string;
  status: string;
  status_id: number;
  title: string;
  type: string;
  type_id: number;
};

export type DSAChallengeTestResponseType = {
  stdout: string;
  stderr: string;
  token: string;
  compile_output: string;
  message: string;
  status: {
    id: number;
    description: string;
  };
};

export interface Challenge {
  id: number;
  created_at: string;
  title: string;
  description: string;
  type_id: number;
  status_id: number;
  type: string;
  status: string;
  marks: number;
  sample_input?: string;
  sample_output?: string;
  note?: string | null;
}

export interface ChallengesResponse {
  currentPage: number;
  totalPages: number;
  challenges: Challenge[];
}

export interface ChallengeResponse {
  challenge: Challenge;
}
