import { defineStore } from 'pinia';
import type { StateCart } from '@/types/types';

export const useCartStore = defineStore('cart', {
  state: (): StateCart => ({
    products: [],
  }),
  actions: {
    hasProductInCart(keyProduct: number): Boolean {
      return this.products.some((product) => product.keyProduct === keyProduct);
    },
    addProductToCart(keyProduct: number) {
      if (this.hasProductInCart(keyProduct)) {
        const index = this.products.findIndex((product) => product.keyProduct === keyProduct);
        this.increaseCount(index);
      } else {
        this.products.push({ keyProduct, count: 1 });
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
  },
});
