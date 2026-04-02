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
