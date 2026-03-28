export type DSAChallengeType = {
  created_at: string;
  description: string;
  id: number;
  marks: number;
  note: string;
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
