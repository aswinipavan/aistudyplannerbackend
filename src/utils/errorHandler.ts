import axios from 'axios';

export class AppError extends Error {
  constructor(
    message: string,
    public code: 'NETWORK' | 'AUTH' | 'PREMIUM' | 'VALIDATION' | 'SERVER',
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const parseApiError = (error: unknown): AppError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401) return new AppError('Authentication failed', 'AUTH', 401);
    if (status === 403) return new AppError('Premium subscription required', 'PREMIUM', 403);
    if (status === 422) return new AppError('Validation failed', 'VALIDATION', 422);
    if (!error.response) return new AppError('Network connection timeout. Check your internet.', 'NETWORK');
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 'SERVER');
  }

  return new AppError('An unexpected server error occurred.', 'SERVER');
};
