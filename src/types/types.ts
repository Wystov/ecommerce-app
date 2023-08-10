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
interface AuthorizationList {
  name: NamePages;
  authorization: Boolean;
  icon: {};
}
interface DataHeader {
  navigation: NamePages[];
  authorizationList: AuthorizationList[];
  authorized: Boolean;
}
export type {
  ButtonClasses, BaseMessageClasses, AuthorizationList, DataHeader,
};
