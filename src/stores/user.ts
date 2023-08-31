import { defineStore } from 'pinia';
import type { ClientResponse } from '@commercetools/platform-sdk';
import api from '@/utils/api/client';
import { initErrorHandler } from '@/utils/api/error-handler';
import { LocalStorageKeys } from '@/types/enums';
import type { Country, StateUser, Address } from '@/types/types';

export const useUserStore = defineStore('user', {
  state: (): StateUser => ({
    authorized: false,
    fetching: true,
    data: {
      country: localStorage.getItem(LocalStorageKeys.Country) ?? 'US',
      cart: {
        product: [],
      },
    },
    customerData: {} as ClientResponse,
  }),
  getters: {
    getAllAddresses(): Address[] {
      return this.customerData.body.addresses;
    },
    getShippingAddressesIds(): string[] {
      return this.customerData.body.shippingAddressIds;
    },
    shippingAddresses(): Address[] {
      const noDefaultAddresses = this.getAllAddresses
        .filter((el) => el.id !== this.getDefaultShippingAddressId);
      return noDefaultAddresses.filter((el) => this.getShippingAddressesIds
        .includes(el.id));
    },
    getDefaultShippingAddressId(): string {
      return this.customerData.body.defaultShippingAddressId ?? '';
    },
    defaultShippingAddress(): string {
      const address = (this.getAllAddresses
        .filter((el) => el.id === this.getDefaultShippingAddressId))[0];
      return `${address.streetName}, ${address.city}, ${address.country}, ${address.postalCode}`;
    },
    getBillingAddressesIds(): string[] {
      return this.customerData.body.billingAddressIds;
    },
    billingAddresses(): Address[] {
      const noDefaultAddress = this.getAllAddresses
        .filter((el) => el.id !== this.getDefaultBillingAddressId);
      return noDefaultAddress.filter((el) => this.getBillingAddressesIds
        .includes(el.id));
    },
    getDefaultBillingAddressId(): string {
      return this.customerData.body.defaultBillingAddressId;
    },
    defaultBillingAddress(): string {
      const address = (this.getAllAddresses
        .filter((el) => el.id === this.getDefaultBillingAddressId))[0];
      return `${address.streetName}, ${address.city}, ${address.country}, ${address.postalCode}`;
    },
  },
  actions: {
    async init() {
      try {
        const response = await api.call().me().get().execute();
        if (response.statusCode === 200) this.loginUser(response);
      } catch (error) {
        this.logoutUser();
        initErrorHandler(error);
      } finally {
        this.fetching = false;
      }
    },
    loginUser(response: ClientResponse) {
      this.authorized = true;
      this.setCustomerData(response);
    },
    logoutUser() {
      this.authorized = false;
    },
    changeCountry(country: Country) {
      this.data.country = country;
      localStorage.setItem(LocalStorageKeys.Country, this.data.country);
    },
    hasProductInCart(keyProduct: number): Boolean {
      return this.data.cart.product.includes(keyProduct);
    },
    addProductToCart(keyProduct: number) {
      this.data.cart.product.push(keyProduct);
    },
    removeProductFromCart(keyProduct: number) {
      const index = this.data.cart.product.findIndex(((product) => product === keyProduct));
      this.data.cart.product.splice(index, 1);
    },
    setCustomerData(data: ClientResponse): void {
      this.customerData = data;
    },
  },
});
