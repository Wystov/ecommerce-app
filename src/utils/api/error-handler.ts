import type { ApiResponse } from '@/types/types';

const authErrors: Record<string, string> = {
  'Customer account with the given credentials not found.':
    "Sorry, we couldn't find an account with the email and password you entered. Please double-check it, or register for a new account if you don't have one yet.",

  'email not available':
    'Account with this email address already exists. Please try again with a different email.',

  'Failed to fetch':
    'Server doesn\'t respond. Check your internet connection or try later',
};

export const authErrorHandler = (error: unknown): ApiResponse => {
  const response: ApiResponse = { ok: false };
  if (error instanceof Error) {
    const message = authErrors[error.message];
    response.message = message ?? error.message;
    return response;
  }
  response.message = 'Unexpected error occurred';
  return response;
};
