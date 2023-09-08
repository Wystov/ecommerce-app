import { defineStore } from 'pinia';
import type { LineItem, MyCartUpdateAction } from '@commercetools/platform-sdk';
import api from '@/utils/api/client';
import type { ProductCart, StateCart } from '@/types/types';

export const useCartStore = defineStore('cart', {
  state: (): StateCart => ({
    products: [],
    cartId: '',
    cartVersion: undefined,
  }),
  getters: {
    getCartId(): string {
      return this.cartId;
    },
    getCartVersion(): number | undefined {
      return this.cartVersion;
    },
  },
  actions: {

    async createCart() {
      const queryArgs = { body: { country: 'US', currency: 'USD' } };
      const data = await api.call().me().carts().post(queryArgs).execute();
      this.cartId = data.body.id;
      this.cartVersion = data.body.version;
    },

    hasProductInCart(keyProduct: number): Boolean {
      return this.products.some((product) => product.keyProduct === keyProduct);
    },

    async addProductToCart(keyProduct: number, skuProduct: string) {
      if (this.hasProductInCart(keyProduct)) {
        const index = this.products.findIndex((product) => product.keyProduct === keyProduct);
        this.increaseCount(index);
        await this.updateQuantity(index);
      } else {
        const product: ProductCart = { keyProduct, count: 1, sku: skuProduct };
        this.products.push(product);
        await this.sendProduct(product);
      }
    },

    async removeProductFromCart(keyProduct: number, all = false) {
      const index = this.products.findIndex((product) => product.keyProduct === keyProduct);
      if (this.hasProductInCart(keyProduct) && this.products[index].count > 1 && !all) {
        this.decreaseCount(index);
        await this.updateQuantity(index);
      } else {
        await this.deleteProduct(index);
        this.products.splice(index, 1);
      }
    },

    increaseCount(index: number) {
      this.products[index].count += 1;
    },

    decreaseCount(index: number) {
      this.products[index].count -= 1;
    },

    getCountProduct(keyProduct: number) {
      const product = this.products.find((productData) => productData.keyProduct === keyProduct);
      return product ? product.count : 0;
    },

    async sendProduct(productCart: ProductCart) {
      const findProduct = (p: ProductCart): boolean => p.keyProduct === productCart.keyProduct;
      const index = this.products.findIndex(findProduct);
      const action: MyCartUpdateAction = {
        action: 'addLineItem',
        sku: this.products[index].sku,
      };
      const queryArgs = {
        body: {
          version: this.cartVersion || 1,
          actions: [action],
        },
      };
      const cart = await api.call().me().carts().withId({ ID: this.cartId })
        .post(queryArgs).execute();
      const keyProduct = this.products[index].keyProduct.toString();
      const findLineItem = (item: LineItem): boolean => item.productKey === keyProduct;
      const lineItem = cart.body.lineItems.find(findLineItem);
      this.products[index].lineItemId = lineItem?.id;
      this.cartVersion = cart.body.version;
    },

    async updateQuantity(indexProduct: number) {
      const action: MyCartUpdateAction = {
        action: 'changeLineItemQuantity',
        lineItemId: this.products[indexProduct].lineItemId,
        quantity: this.products[indexProduct].count,
      };
      const queryArgs = {
        body: {
          version: this.cartVersion || 1,
          actions: [action],
        },
      };
      const cart = await api.call().me().carts()
        .withId({ ID: this.cartId }).post(queryArgs).execute();
      this.cartVersion = cart.body.version;
    },

    async deleteProduct(indexProduct: number) {
      const action: MyCartUpdateAction = {
        action: 'removeLineItem',
        lineItemId: this.products[indexProduct].lineItemId,
      };
      const queryArgs = {
        body: {
          version: this.cartVersion || 1,
          actions: [action],
        },
      };
      const cart = await api.call().me().carts()
        .withId({ ID: this.cartId }).post(queryArgs).execute();
      this.cartVersion = cart.body.version;
    },

    async deleteCart() {
      await api.call().me().carts().withId({ ID: this.cartId })
        .delete({ queryArgs: { version: 1 } }).execute();
    },
  },
});
