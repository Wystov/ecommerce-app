import { defineStore } from 'pinia';
import type { LineItem, MyCartUpdate, MyCartUpdateAction } from '@commercetools/platform-sdk';
import api from '@/utils/api/client';
import type { CartAddItem, StateCart } from '@/types/types';
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
    promocodeId(): string {
      return this.cart?.discountCodes[0]?.discountCode.id ?? '';
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

    async addProductToCart(products: CartAddItem[]) {
      const actions = products.map((item) => {
        const action: MyCartUpdateAction = {
          action: 'addLineItem',
          ...item,
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
      const oldCart = this.cart?.lineItems.map((item) => ({
        sku: item.variant.sku ?? '',
        quantity: item.quantity,
      }));
      const promocode = (await this.getPromocode(this.promocodeId)) ?? '';
      await this.removeCart();
      await this.createCart();
      if (oldCart && oldCart.length) await this.addProductToCart(oldCart);
      if (promocode) await this.applyPromo(promocode);
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

    async getPromocode(id: string) {
      if (!id.length) return null;
      try {
        const response = await api.call().discountCodes().withId({ ID: id }).get().execute();
        return response.body.code;
      } catch {
        return null;
      }
    },

    async removePromocode() {
      const body: MyCartUpdate = {
        version: this.cartVersion ?? 0,
        actions: [
          {
            action: 'removeDiscountCode',
            discountCode: {
              typeId: 'discount-code',
              id: this.promocodeId,
            },
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
