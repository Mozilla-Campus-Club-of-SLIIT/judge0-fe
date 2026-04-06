export const CHALLENGE_TYPE_ID = {
  DSA: 1,
} as const;

export const CHALLENGE_STATUS_ID = {
  INACTIVE: 1,
  ACTIVE: 2,
} as const;

export const challengeTypeOptions = [
  { id: CHALLENGE_TYPE_ID.DSA, label: 'DSA' },
] as const;

export const challengeStatusOptions = [
  { id: CHALLENGE_STATUS_ID.INACTIVE, label: 'Inactive' },
  { id: CHALLENGE_STATUS_ID.ACTIVE, label: 'Active' },
] as const;

export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
export type ChallengeDifficultyColor = `#${string}`;

const MARKS_TO_DIFFICULTY: Record<number, ChallengeDifficulty> = {
  5: 'EASY',
  10: 'MEDIUM',
  15: 'HARD',
  25: 'EXTREME',
};

export const CHALLENGE_DIFFICULTY_COLORS: Record<
  ChallengeDifficulty,
  ChallengeDifficultyColor
> = {
  EASY: '#40FD51',
  MEDIUM: '#40FD51',
  HARD: '#40FD51',
  EXTREME: '#40FD51',
};

export function getChallengeDifficultyByMarks(
  marks: number
): ChallengeDifficulty {
  const difficulty = MARKS_TO_DIFFICULTY[marks];
  if (!difficulty) {
    throw new Error(`Invalid challenge marks value: ${marks}`);
  }

  return difficulty;
}

export function getChallengeDifficultyColorByMarks(
  marks: number
): ChallengeDifficultyColor {
  const difficulty = getChallengeDifficultyByMarks(marks);
  return CHALLENGE_DIFFICULTY_COLORS[difficulty];
}

export function getChallengeXpFromMarks(marks: number): number {
  return marks;
}
