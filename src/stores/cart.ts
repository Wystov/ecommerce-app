import { defineStore } from 'pinia';
import type { StateCart } from '@/types/types';

export const useCartStore = defineStore('cart', {
  state: (): StateCart => ({
    products: [],
  }),
  getters: {
    countProduct: (state) => (keyProduct: number): number => {
      const product = state.products.find((productData) => productData.keyProduct === keyProduct);
      return product ? product.count : 0;
    },
  },
  actions: {
    hasProductInCart(keyProduct: number): Boolean {
      return this.products.some((product) => product.keyProduct === keyProduct);
    },
    addProductToCart(keyProduct: number) {
      if (this.hasProductInCart(keyProduct)) {
        const index = this.products.findIndex((product) => product.keyProduct === keyProduct);
        this.products[index].count++;
      } else {
        this.products.push({ keyProduct, count: 1 });
      }
    },
    removeProductFromCart(keyProduct: number) {
      const index = this.products.findIndex((product) => product.keyProduct === keyProduct);
      if (this.hasProductInCart(keyProduct)) {
        let { count } = this.products[index];
        count > 1 ? count-- : this.products.splice(index, 1);
      } else {
        this.products.splice(index, 1);
      }
    },
  },
});
