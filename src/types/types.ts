import { NamePages } from './enums';

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
interface SelectClasses {
  'dark-theme-input': boolean;
  'valid-focus-decorator': boolean;
  'invalid-focus-decorator': boolean;
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
interface AuthorizationList {
  name: NamePages;
  authorization: Boolean;
  icon: {};
}
interface DataAuthorization {
  authorizationList: AuthorizationList[];
}
interface DataNavigation {
  navigation: NamePages[];
}
interface SelectOptions {
  text: string;
  value: string;
}
export type {
  ButtonClasses,
  SelectClasses,
  BaseMessageClasses,
  AuthorizationList,
  DataAuthorization,
  DataNavigation,
  TokenResponse,
  SelectOptions,
};
