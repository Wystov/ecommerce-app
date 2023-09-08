import { defineStore } from 'pinia';
import type { LineItem } from '@commercetools/platform-sdk';
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
      const data = await api.call().me().carts().post({ body: { country: 'US', currency: 'USD' } }).execute();
      this.cartId = data.body.id;
      this.cartVersion = data.body.version;
      api.call().me().carts().get().execute().then((res) => console.log('create cart', res));
    },
    hasProductInCart(keyProduct: number): Boolean {
      return this.products.some((product) => product.keyProduct === keyProduct);
    },
    async addProductToCart(keyProduct: number, skuProduct: string) {
      if (this.hasProductInCart(keyProduct)) {
        const index = this.products.findIndex((product) => product.keyProduct === keyProduct);
        console.log('product has');
        this.increaseCount(index);
        console.log('increase complete');
        await this.updateQuantity(index);
        console.log('update quantity complete');
      } else {
        const product: ProductCart = { keyProduct, count: 1, sku: skuProduct };
        this.products.push(product);
        console.log('product push', skuProduct, this.cartVersion);
        await this.sendProduct(product);
        console.log('product send');
      }
    },
    removeProductFromCart(keyProduct: number, all = false) {
      const index = this.products.findIndex((product) => product.keyProduct === keyProduct);
      if (this.hasProductInCart(keyProduct) && this.products[index].count > 1 && !all) {
        this.decreaseCount(index);
      } else {
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
      console.log(this.products[index], index);
      const cart = await api.call().me().carts().withId({ ID: this.cartId }).post({ body: {
        version: this.cartVersion || 1,
        actions: [
          {
            action: 'addLineItem',
            sku: this.products[index].sku,
          },
        ],
      } }).execute();
      const keyProduct = this.products[index].keyProduct.toString();
      const findLineItem = (item: LineItem): boolean => item.productKey === keyProduct;
      const lineItem = cart.body.lineItems.find(findLineItem);
      this.products[index].lineItemId = lineItem?.id;
      this.cartVersion = cart.body.version;
      console.log('add prod', cart, this.cartVersion);
    },
    async updateQuantity(indexProduct: number) {
      const cart = await api.call().me().carts().withId({ ID: this.cartId }).post({ body: {
        version: this.cartVersion || 1,
        actions: [
          {
            action: 'changeLineItemQuantity',
            lineItemId: this.products[indexProduct].lineItemId,
            quantity: this.products[indexProduct].count,
          },
        ],
      } }).execute();
      console.log('update prod', cart);
    },
    async deleteCart() {
      await api.call().me().carts().withId({ ID: this.cartId })
        .delete({ queryArgs: { version: 1 } }).execute();
    },
  },
});
