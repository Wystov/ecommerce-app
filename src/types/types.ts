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
interface InputComponent {
  inputValue: string;
}
interface DataLogin {
  emailValue: string;
  passValue: string;
  passInputType: string;
  emailMessageShown: boolean;
  passMessageShown: boolean;
  // messageTitle: string;
  emailMessageText: string;
  passMessageText: string;
}
export type {
  ButtonClasses,
  BaseMessageClasses,
  AuthorizationList,
  DataAuthorization,
  DataNavigation,
  TokenResponse,
  InputComponent,
  DataLogin,
};
