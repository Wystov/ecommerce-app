import { defineStore } from 'pinia';
import api from '@/utils/api/client';
import { initErrorHandler } from '@/utils/api/error-handler';
import { LocalStorageKeys } from '@/types/enums';
import type { Country, StateUser } from '@/types/types';
import { useFilterStore } from './filter';

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
  }),
  getters: {
    currency: (state) => (state.data.country === 'US' ? 'USD' : 'GBP'),
  },
  actions: {
    async init() {
      try {
        const response = await api.call().me().get().execute();
        if (response.statusCode === 200) this.loginUser();
      } catch (error) {
        this.logoutUser();
        initErrorHandler(error);
      } finally {
        this.fetching = false;
      }
    },
    loginUser() {
      this.authorized = true;
    },
    logoutUser() {
      this.authorized = false;
    },
    changeCountry(country: Country) {
      const filter = useFilterStore();
      filter.refreshFilter();
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
  },
});
