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

export interface DSAChallengeSubmissionResponse {
  id: number;
  created_at: string;
  submission_id: string;
  challenge_id: number;
  user_id: string;
  test_count: number;
  pass_count: number;
  fail_count: number;
  evaluation_status: number;
}

export interface LeaderboardUser {
  user_id: string;
  name: string;
  xp: number;
}

export interface LeaderboardResponse {
  currentPage: number;
  totalPages: number;
  users: LeaderboardUser[];
}

export interface AdminDSASubmissionResult {
  id: number;
  created_at: string;
  submission_id: string;
  challenge_id: number;
  user_id: string;
  name: string;
  status: number;
  token: string;
}

export interface AdminDSASubmissionResultsResponse {
  currentPage: number;
  totalPages: number;
  submissions: AdminDSASubmissionResult[];
}

export interface Judge0SubmissionStatus {
  id: number;
  description: string;
}

export interface Judge0SubmissionDetails {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
  stdout: string;
  stderr: string | null;
  status: Judge0SubmissionStatus;
}
