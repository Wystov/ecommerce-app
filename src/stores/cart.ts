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
    getCartId(): string {
      return this.cart?.id ?? '';
    },
    getCartVersion(): number | undefined {
      return this.cart?.version;
    },
    getProducts(): LineItem[] | [] {
      return this.cart?.lineItems ?? [];
    },
    fetchingCart(): boolean {
      return this.fetching;
    },
  },
  actions: {
    async createCart() {
      const queryArgs = { body: { country: 'US', currency: 'USD' } };
      this.fetching = true;
      const data = await api.call().me().carts().post(queryArgs).execute();
      this.fetching = false;
      this.cart = data.body;
    },

    hasProductInCart(productKey: string): Boolean {
      return this.getProducts.some((product) => product.productKey === productKey);
    },

    async addProductToCart(productKey: string, skuProduct: string) {
      if (this.hasProductInCart(productKey)) {
        const index = this.getProducts.findIndex((product) => product.productKey === productKey);
        await this.increaseCount(index);
      } else {
        await this.sendProduct(skuProduct);
      }
    },

    async removeProductFromCart(productKey: string, all = false) {
      const index = this.getProducts.findIndex((product) => product.productKey === productKey);
      const product = this.getProducts[index];
      if (this.hasProductInCart(productKey) && product.quantity > 1 && !all) {
        this.decreaseCount(index);
      } else {
        await this.updateQuantity(index, 0);
      }
    },

    async increaseCount(index: number) {
      const product = this.getProducts[index];
      if (product) {
        const count = product.quantity;
        await this.updateQuantity(index, count + 1);
      }
    },

    async decreaseCount(index: number) {
      const product = this.getProducts[index];
      if (product) {
        const count = product.quantity;
        await this.updateQuantity(index, count - 1);
      }
    },

    getCountProduct(keyProduct: string) {
      const product = this.getProducts.find((productData) => productData.productKey === keyProduct);
      return product ? product.quantity : 0;
    },

    async sendProduct(sku: string) {
      const action: MyCartUpdateAction = {
        action: 'addLineItem',
        sku,
      };
      if (this.cart && typeof this.getCartVersion === 'number') {
        const queryArgs = {
          body: {
            version: this.getCartVersion,
            actions: [action],
          },
        };
        this.fetching = true;
        const cart = await api.call().me().carts().withId({ ID: this.getCartId })
          .post(queryArgs).execute();
        this.cart = cart.body;
        this.fetching = false;
      }
    },

    async updateQuantity(indexProduct: number, count: number) {
      const action: MyCartUpdateAction = {
        action: 'changeLineItemQuantity',
        lineItemId: this.getProducts[indexProduct].id,
        quantity: count,
      };
      if (this.cart && typeof this.getCartVersion === 'number') {
        const queryArgs = {
          body: {
            version: this.getCartVersion,
            actions: [action],
          },
        };
        this.fetching = true;
        const cart = await api.call().me().carts()
          .withId({ ID: this.getCartId }).post(queryArgs).execute();
        this.fetching = false;
        this.cart = cart.body;
      }
    },
  },
});
