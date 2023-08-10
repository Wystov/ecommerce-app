import type { UserAuthOptions } from '@commercetools/sdk-client-v2';

interface ButtonClasses {
  'theme-dark': boolean;
  'theme-light': boolean;
  'size-small': boolean;
  'size-medium': boolean;
  'size-large': boolean;
  link: boolean;
  rounded: boolean;
  circle: boolean;
  active: boolean;
  disabled: boolean;
}
interface BaseMessageClasses {
  primary: boolean;
  danger: boolean;
  warning: boolean;
  success: boolean;
  rounded: boolean;
}
interface TokenResponse {
  refresh_token?: string;
}
interface UserSignUp {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  anonymousId?: string;
}
interface UserDataBundle {
  user: UserAuthOptions;
  userFullData: UserSignUp;
}

export type {
  ButtonClasses, BaseMessageClasses, TokenResponse, UserSignUp, UserDataBundle,
};
