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
  authorization: boolean;
  class?: string;
  icon?: {};
}
interface DataAuthorization {
  authorizationList: AuthorizationList[];
}
interface UserAddress {
  country: 'US' | 'GB';
  city: string;
  streetName: string;
  postalCode: string;
}
interface UserSignUp {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  anonymousId?: string;
  addresses: UserAddress[];
  shippingAddresses?: number[];
  defaultShippingAddress?: number;
  billingAddresses?: number[];
  defaultBillingAddress?: number;
}
interface DefaultAddressProps {
  defaultShipping: boolean;
  defaultBilling: boolean;
}
interface ApiResponse {
  ok: boolean;
  message?: string;
}
interface DataLogin {
  emailValue: string;
  passValue: string;
  passInputType: string;
  hidePass: string;
  emailMessageText: string;
  passMessageText: string;
  wrongData: boolean;
  wrongDataText: string;
  registration: string;
}
interface BaseInputType {
  inputValue: string;
}
interface BaseInputProps {
  label: string;
  type: string;
  id: string;
  isDark: boolean;
  name: string;
  disabled: boolean;
  width: string;
  valid: string;
  hidePass: string;
  inputValue: string;
}
export type {
  ButtonClasses,
  BaseMessageClasses,
  AuthorizationList,
  DataAuthorization,
  TokenResponse,
  UserSignUp,
  UserAddress,
  DefaultAddressProps,
  ApiResponse,
  DataLogin,
  BaseInputType,
  BaseInputProps,
};
