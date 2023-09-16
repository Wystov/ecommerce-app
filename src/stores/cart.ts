import { defineStore } from 'pinia';
import type { LineItem, MyCartUpdate, MyCartUpdateAction } from '@commercetools/platform-sdk';
import api from '@/utils/api/client';
import type { StateCart } from '@/types/types';
import { useUserStore } from '@/stores/user';

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
    totalPrice(): number {
      return this.cart?.totalPrice.centAmount ?? 0;
    },
  },
  actions: {
    async initializationCart() {
      this.fetching = true;
      try {
        const response = await api.call().me().activeCart().get().execute();
        this.cart = response.body;
      } catch {
        this.cart = undefined;
      } finally {
        this.fetching = false;
      }
    },
    async createCart() {
      const { country } = useUserStore().data;
      const queryArgs = { body: { country, currency: country === 'US' ? 'USD' : 'GBP' } };
      this.fetching = true;
      const data = await api.call().me().carts().post(queryArgs).execute();
      this.fetching = false;
      this.cart = data.body;
    },

    hasProductInCart(productKey: string): Boolean {
      return this.products.some((product) => product.productKey === productKey);
    },

    async addProductToCart(sku: string[]) {
      const actions = sku.map((productSku) => {
        const action: MyCartUpdateAction = {
          action: 'addLineItem',
          sku: productSku,
        };
        return action;
      });
      if (this.cart && typeof this.cartVersion === 'number') {
        const queryArgs = {
          body: {
            version: this.cartVersion,
            actions,
          },
        };
        this.fetching = true;
        const cart = await api
          .call()
          .me()
          .carts()
          .withId({ ID: this.cartId })
          .post(queryArgs)
          .execute();
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
        const cart = await api
          .call()
          .me()
          .carts()
          .withId({ ID: this.cartId })
          .post(queryArgs)
          .execute();
        this.cart = cart.body;
        this.fetching = false;
      }
    },

    async updateCountryCart() {
      const lineItemsSku = this.cart?.lineItems.map((item) => item.variant.sku ?? '');
      await this.removeCart();
      await this.createCart();
      if (lineItemsSku) await this.addProductToCart(lineItemsSku);
    },

    async removeCart(): Promise<void> {
      await api
        .call()
        .me()
        .carts()
        .withId({ ID: this.cartId })
        .delete({ queryArgs: { version: this.cartVersion ?? 0 } })
        .execute();
      this.cart = undefined;
    },

    async applyPromo(code: string): Promise<void> {
      const body: MyCartUpdate = {
        version: this.cartVersion ?? 0,
        actions: [
          {
            action: 'addDiscountCode',
            code,
          },
        ],
      };
      const response = await api
        .call()
        .me()
        .carts()
        .withId({ ID: this.cartId })
        .post({ body })
        .execute();
      this.cart = response.body;
    },
  },
});
