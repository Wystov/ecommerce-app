import type { ProductProjection, ClientResponse } from '@commercetools/platform-sdk';
import type { Ref } from 'vue';
import type { SwiperModule, Swiper } from 'swiper/types';
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
interface UserUpdate {
  email: string;
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
  data?: ClientResponse;
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
  dateValue?: string;
  placeholder?: string;
  pattern?: RegExp;
  valid?: 'valid' | 'invalid' | '';
  invalidMessage?: string;
  showMessage: boolean;
  hidePass?: string;
}
interface RegistrationAddressData {
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
interface AccountInfoData {
  name: string | undefined;
  surname: string | undefined;
  date: string | undefined;
  showPopup: boolean;
  updateInfo: boolean;
  showMessageEditSuccess: boolean;
  createCustomerMessage: { text: string; alert: string; title: string };
}
interface AccountAddressData {
  showPopup: boolean;
  addressSection: string;
  addressId: string;
  showMessageEditSuccess: boolean;
  createCustomerMessage: { text: string; alert: string; title: string };
}
interface Address {
  city: string;
  country: string;
  id: string;
  postalCode: string;
  streetName: string;
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
  customerData: ClientResponse;
}
type Attribute = { name: string; value: string };
interface AppProduct {
  fetching: boolean;
  productData: null | ProductProjection;
  product: {
    name: string[];
    attributes?: Attribute[];
    description: string;
    images: string[];
    keyProduct?: number;
  };
}
type SortBy = 'price desc' | 'price asc' | 'name en';
interface FacetTerm {
  term: string;
  count: number;
}
type FilterKey =
  | 'variants.attributes.brand'
  | 'variants.attributes.weight'
  | 'variants.scopedPrice.currentValue.centAmount';
interface FacetResult {
  terms: FacetTerm[];
  total: number;
  key: FilterKey;
  selected: Set<string> | [number, number];
}
interface FilterOptions {
  brand: FacetResult;
  weight: FacetResult;
  price: FacetResult;
}
interface FacetResults {
  [key: string]: FacetResult;
}
type Filter = 'brand' | 'weight' | 'price';
interface CategoryMap {
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
interface Breadcrumb {
  route: string;
  name: string;
}
interface ProductFilterType {
  weightRange: [number, number];
  priceRange: [number, number];
  searchValue: string;
  searchTitle: string;
}
interface ProductListType {
  productList: ProductProjection[];
  init: boolean;
  cardsToShow: number;
  cardsLoaded: number;
  total?: number;
  loading: boolean;
  endOfLoading: boolean;
}
interface SwiperSetup {
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
interface CatalogViewType {
  showSidebar: boolean;
  screenWidth: number;
}
interface MainFields {
  valid: boolean;
  response: {};
}
interface AccountEditInfoBlockData {
  mainFields: MainFields;
  fields: RegistrationMainData[];
  placeholders: string[];
}
interface PasswordEditBlock {
  mainFields: MainFields;
  fields: RegistrationMainData[];
  notMatch: boolean;
  notMatchText: string;
  wrongOldPass: boolean;
  wrongOldPassText: string;
}

export type {
  ButtonClasses,
  SelectClasses,
  BaseMessageClasses,
  AuthorizationList,
  DataAuthorization,
  TokenResponse,
  UserSignUp,
  UserUpdate,
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
  SortBy,
  FilterOptions,
  FacetTerm,
  FacetResult,
  FacetResults,
  Filter,
  FilterKey,
  CategoryMap,
  Breadcrumb,
  ProductFilterType,
  ProductListType,
  SwiperSetup,
  AccountInfoData,
  Address,
  CatalogViewType,
  MainFields,
  AccountEditInfoBlockData,
  PasswordEditBlock,
  AccountAddressData,
};
