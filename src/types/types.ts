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

export type {
  ButtonClasses, BaseMessageClasses, TokenResponse, UserSignUp, UserAddress, DefaultAddressProps,
};
