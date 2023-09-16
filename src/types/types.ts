import type { ProductProjection, ClientResponse, Cart } from '@commercetools/platform-sdk';
import type { Ref } from 'vue';
import type { SwiperModule, Swiper } from 'swiper/types';
import { NamePages } from './enums';

export interface ButtonClasses {
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
export interface SelectClasses {
  'dark-theme-input': boolean;
  'valid-focus-decorator': boolean;
  'invalid-focus-decorator': boolean;
  'plain-input': boolean;
}
export interface BaseMessageClasses {
  primary: boolean;
  danger: boolean;
  warning: boolean;
  success: boolean;
  rounded: boolean;
  absolute: boolean;
  arrowTop: boolean;
}
export interface TokenResponse {
  refresh_token?: string;
}
export interface SelectOptions {
  text: string;
  value: string;
}
export interface AuthorizationList {
  name: NamePages;
  authorization?: boolean;
  class?: string;
  icon?: {};
}
export interface DataAuthorization {
  authorizationList: AuthorizationList[];
}
export interface BaseDataAuthorization extends DataAuthorization {
  country: SelectOptions[];
}
export interface UserAddress {
  country: 'US' | 'GB';
  city: string;
  streetName: string;
  postalCode: string;
}
export interface UserSignUp {
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
export interface UserSignUpMain {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}
export interface UserUpdate {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}
export interface DefaultAddressProps {
  defaultShipping: boolean;
  defaultBilling: boolean;
}
export interface ApiResponse {
  ok: boolean;
  message?: string;
  data?: ClientResponse;
}
export interface DataLogin {
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
export interface BaseInputType {
  inputValue: string;
}
export interface BaseInputProps {
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
export interface RegistrationMainData {
  label: string;
  type?: string;
  value?: string;
  dateValue?: string;
  placeholder?: string;
  pattern?: RegExp;
  valid?: 'valid' | 'invalid' | '';
  invalidMessage?: string;
  showMessage: boolean;
  hidePass?: string;
}
export interface RegistrationAddressData {
  fields: {
    label: string;
    fieldName?: string;
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
export interface AccountInfoData {
  name: string | undefined;
  surname: string | undefined;
  date: string | undefined;
  showPopup: boolean;
  updateInfo: boolean;
  showMessageEditSuccess: boolean;
  createCustomerMessage: { text: string; alert: string; title: string };
}
export interface AccountAddressData {
  showPopup: boolean;
  addressSection: string;
  addressId: string;
  showMessageEditSuccess: boolean;
  createCustomerMessage: { text: string; alert: string; title: string };
}
export interface Address {
  city: string;
  country: string;
  id: string;
  postalCode: string;
  streetName: string;
}
export type Country = 'US' | 'GB';

export interface StateUser {
  authorized: boolean;
  fetching: boolean;
  data: {
    country: string;
  };
  customerData: ClientResponse;
}
export type Attribute = { name: string; value: string };
export interface AppProduct {
  fetching: boolean;
  productData: null | ProductProjection;
  product: {
    name: string[];
    attributes?: Attribute[];
    description: string;
    images: string[];
    keyProduct?: string;
    skuProduct?: string;
  };
}
export type SortBy = 'price desc' | 'price asc' | 'name en';
export interface FacetTerm {
  term: string;
  count: number;
}
export type FilterKey =
  | 'variants.attributes.brand'
  | 'variants.attributes.weight'
  | 'variants.scopedPrice.currentValue.centAmount';
export interface FacetResult {
  terms: FacetTerm[];
  total: number;
  key: FilterKey;
  selected: Set<string> | [number, number];
}
export interface FilterOptions {
  brand: FacetResult;
  weight: FacetResult;
  price: FacetResult;
}
export interface FacetResults {
  [key: string]: FacetResult;
}
export type Filter = 'brand' | 'weight' | 'price';
export interface CategoryMap {
  id: string;
  parentId: string | null;
  name: string;
  routerName: string;
  params: {
    categorySlug: string;
    subcategorySlug?: string;
  };
  children: CategoryMap[];
}
export interface Breadcrumb {
  route: string;
  name: string;
}
export interface ProductFilterType {
  weightRange: [number, number];
  priceRange: [number, number];
  searchValue: string;
  searchTitle: string;
}
export interface ProductListType {
  productList: ProductProjection[];
  init: boolean;
}
export interface SwiperSetup {
  showPopUp: Ref<boolean>;
  currentIndexSlide: Ref<number>;
  openPopUp: (index: number) => void;
  closePopUp: (index: number) => void;
  setImgPlaceholder: ($event: Event) => void;
  thumbsSwiper: Ref<Swiper | null | undefined>;
  mainSwiper: Ref<Swiper | null | undefined>;
  setThumbsSwiper: (swiper: Swiper) => void;
  modules: SwiperModule[];
}
export interface CatalogViewType {
  showSidebar: boolean;
  screenWidth: number;
}
export interface MainFields {
  valid: boolean;
  response: {};
}
export interface AccountEditInfoBlockData {
  mainFields: MainFields;
  fields: RegistrationMainData[];
  placeholders: string[];
}
export interface PasswordEditBlock {
  mainFields: MainFields;
  fields: RegistrationMainData[];
  notMatch: boolean;
  notMatchText: string;
  wrongOldPass: boolean;
  wrongOldPassText: string;
}
export interface StateCart {
  cart?: Cart;
  fetching: boolean;
}

export interface CartInfo {
  showPromoAlert: boolean;
  promoAlertMessage: string;
  promoApplied: boolean;
  promoAlertTimeout: number | null;
}

export interface CartItemPrices {
  price: string;
  itemTotal: string;
  oldPrice?: string;
  newPrice?: string;
}
