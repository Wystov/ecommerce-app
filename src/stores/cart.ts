import { defineStore } from 'pinia';
import type { LineItem, MyCartUpdateAction } from '@commercetools/platform-sdk';
import api from '@/utils/api/client';
import type { StateCart } from '@/types/types';

export const useCartStore = defineStore('cart', {
  state: (): StateCart => ({
    cart: undefined,
    fetching: false,
  }),
  getters: {
    cartId(): string {
      return this.cart?.id ?? '';
    },
    cartVersion(): number | undefined {
      return this.cart?.version;
    },
    products(): LineItem[] | [] {
      return this.cart?.lineItems ?? [];
    },
  },
  actions: {
    async initializationCart() {
      this.fetching = true;
      const cart = await api.call().me().activeCart().get().execute();
      if (cart.statusCode === 200) this.cart = cart.body;
      this.fetching = false;
    },
    async createCart() {
      const queryArgs = { body: { country: 'US', currency: 'USD' } };
      this.fetching = true;
      const data = await api.call().me().carts().post(queryArgs).execute();
      this.fetching = false;
      this.cart = data.body;
    },

    hasProductInCart(productKey: string): Boolean {
      return this.products.some((product) => product.productKey === productKey);
    },

    async addProductToCart(sku: string) {
      const action: MyCartUpdateAction = {
        action: 'addLineItem',
        sku,
      };
      if (this.cart && typeof this.cartVersion === 'number') {
        const queryArgs = {
          body: {
            version: this.cartVersion,
            actions: [action],
          },
        };
        this.fetching = true;
        const cart = await api.call().me().carts().withId({ ID: this.cartId })
          .post(queryArgs).execute();
        this.cart = cart.body;
        this.fetching = false;
      }
    },

    getCountProduct(keyProduct: string) {
      const product = this.products.find((productData) => productData.productKey === keyProduct);
      return product ? product.quantity : 0;
    },

    async updateQuantity(keyProduct: string, count: number) {
      const product = this.products.find((productData) => productData.productKey === keyProduct);
      const action: MyCartUpdateAction = {
        action: 'changeLineItemQuantity',
        lineItemId: product?.id,
        quantity: count,
      };
      if (this.cart && typeof this.cartVersion === 'number') {
        const queryArgs = {
          body: {
            version: this.cartVersion,
            actions: [action],
          },
        };
        this.fetching = true;
        const cart = await api.call().me().carts()
          .withId({ ID: this.cartId }).post(queryArgs).execute();
        this.fetching = false;
        this.cart = cart.body;
      }
    },
  },
});