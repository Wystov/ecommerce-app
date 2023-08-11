const authErrors: Record<string, string> = {
  'Customer account with the given credentials not found.':
  "Sorry, we couldn't find an account with the email and password you entered. Please double-check it, or register for a new account if you don't have one yet.",

  'email not available':
  'Account with this email address already exists. Please try again with a different email.',
};

export const authErrorHandler = (error: unknown): string => {
  if (error instanceof Error) {
    const message = authErrors[error.message];
    return message ?? error.message;
  }
  return 'Unexpected error occured';
};
