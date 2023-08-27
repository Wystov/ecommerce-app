import type { ProductData } from '@commercetools/platform-sdk';
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
  outline: boolean;
}
interface SelectClasses {
  'dark-theme-input': boolean;
  'valid-focus-decorator': boolean;
  'invalid-focus-decorator': boolean;
  'plain-input': boolean;
}
interface BaseMessageClasses {
  primary: boolean;
  danger: boolean;
  warning: boolean;
  success: boolean;
  rounded: boolean;
  absolute: boolean;
  arrowTop: boolean;
}
interface TokenResponse {
  refresh_token?: string;
}
interface SelectOptions {
  text: string;
  value: string;
}
interface AuthorizationList {
  name: NamePages;
  authorization?: boolean;
  class?: string;
  icon?: {};
}
interface DataAuthorization {
  authorizationList: AuthorizationList[];
}
interface BaseDataAuthorization extends DataAuthorization {
  country: SelectOptions[];
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
interface UserSignUpMain {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
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
interface RegistrationMainData {
  label: string;
  type?: string;
  value?: string;
  placeholder?: string;
  pattern?: RegExp;
  valid?: 'valid' | 'invalid' | '';
  invalidMessage?: string;
  showMessage: boolean;
}
interface RegistrationAddressData {
  fields: {
    label: string;
    type?: string;
    value?: string;
    placeholder?: string;
    pattern?: RegExp;
    valid?: 'valid' | 'invalid' | '';
    invalidMessage?: string;
    showMessage: boolean;
  }[];
  countryField: {
    label: string;
    options: { text: string; value: string; placeholder: string }[];
    defaultSelectedCountry: string;
    valid?: 'valid' | 'invalid' | '';
    value: string;
  };
}
type Country = 'US' | 'GB';

interface StateUser {
  authorized: boolean;
  fetching: boolean;
  data: {
      country: string;
      cart: {
          product: number[];
      };
  };
}
type Attribute = { name: string; value: string };
interface AppProduct {
  fetching: boolean;
  productData: null | ProductData;
  product: {
    name: string[];
    attributes?: Attribute[];
    description: string;
    images: string[];
  };
}

export type {
  ButtonClasses,
  SelectClasses,
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
  SelectOptions,
  RegistrationMainData,
  RegistrationAddressData,
  UserSignUpMain,
  BaseDataAuthorization,
  Country,
  StateUser,
  AppProduct,
};
