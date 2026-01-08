// Error normalization
// The shared http() client throws AppErrorClass, UI layers can safely handle errors without guessing

export type AppErrorKind =
  | 'network'
  | 'http'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'unknown';

export type AppError = {
  kind: AppErrorKind;
  message: string;
  status?: number;
  url?: string;
  method?: string;
  details?: string;
};

export function normalizeError(
  error: unknown,
  info?: { url?: string; method?: string }
): AppError {
  if (error instanceof AppErrorClass) {
    return error.toJSON();
  }

  if (error instanceof TypeError) {
    return {
      kind: 'network',
      message: 'Network error. Please check your connection.',
      ...info,
    };
  }

  return {
    kind: 'unknown',
    message: 'Something went wrong',
    details: String(error),
    ...info,
  };
}

export class AppErrorClass extends Error {
  constructor(
    public kind: AppErrorKind,
    public message: string,
    public status?: number,
    public url?: string,
    public method?: string,
    public details?: string
  ) {
    super(message);
  }

  toJSON(): AppError {
    return {
      kind: this.kind,
      message: this.message,
      status: this.status,
      url: this.url,
      method: this.method,
      details: this.details,
    };
  }
}
