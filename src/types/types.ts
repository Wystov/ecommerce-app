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

interface InputComponent {
  inputValue: string;
}
interface DataLogin {
  emailValue: string;
  passValue: string;
  passInputType: string;
  emailMessageShown: boolean;
  passMessageShown: boolean;
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
  UserSignUp,
  UserAddress,
  DefaultAddressProps,
  ApiResponse,
  InputComponent,
  DataLogin,
};
