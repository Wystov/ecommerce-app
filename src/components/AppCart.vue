<template>
  <div
    v-if="products && products.length"
    class="wrapper w-100">
    <AppCartHeader />
    <div class="cart">
      <ul class="cart-item-list">
        <li
          v-for="item in products"
          :key="item.id"
          class="cart-item">
          <AppCartItem
            :item="item"
            :prices="buildPrices(item)"
            :disableButtons="disableButtons" />
        </li>
      </ul>
      <AppCartInfo
        :cartSubtotal="formattedPrice(cartSubtotal)"
        :promocodeValue="promocodeValue"
        :totalPrice="formattedPrice(totalPrice)" />
    </div>
  </div>
  <div v-else>
    <div class="empty-cart-info">
      <h3>Cart is empty. Let's fill it with crunches!</h3>
      <RouterLink
        :to="{ name: 'Catalog' }"
        class="continue-btn">
        Continue shopping
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import type { LineItem } from '@commercetools/platform-sdk';
import AppCartItem from '@/components/AppCartItem.vue';
import AppCartInfo from '@/components/AppCartInfo.vue';
import AppCartHeader from '@/components/AppCartHeader.vue';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import type { CartItemPrices } from '@/types/types';

export default {
  components: {
    AppCartHeader,
    AppCartItem,
    AppCartInfo,
  },
  computed: {
    ...mapState(useUserStore, ['currencyTag']),
    ...mapState(useCartStore, ['fetching', 'products', 'totalPrice', 'cartVersion']),
    cartSubtotal(): number {
      const items = [...this.products];
      return items.reduce((acc: number, item: LineItem) => this.getItemTotal(item) + acc, 0) ?? 0;
    },
    promocodeValue(): string {
      const value = this.totalPrice - this.cartSubtotal;
      return this.formattedPrice(value);
    },
    disableButtons(): boolean {
      return this.fetching && this.cartVersion !== undefined;
    },
  },
  methods: {
    formattedPrice(price: number): string {
      return `${this.currencyTag}${(price / 100).toFixed(2)}`;
    },
    getItemTotal(item: LineItem): number {
      const discounted = item.price.discounted?.value.centAmount;
      const normal = item.price.value.centAmount;
      return (discounted ?? normal) * item.quantity;
    },
    buildPrices(item: LineItem): CartItemPrices {
      const prices: CartItemPrices = {
        price: this.formattedPrice(item.price.value.centAmount),
        itemTotal: this.formattedPrice(this.getItemTotal(item)),
      };
      if (item.price.discounted) {
        prices.oldPrice = this.formattedPrice(item.price.value.centAmount);
        prices.newPrice = this.formattedPrice(item.price.discounted.value.centAmount);
      }
      return prices;
    },
  },
};
</script>

<style scoped>
.cart {
  display: flex;
  gap: 1rem;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
}
.empty-cart-info {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 2rem;
  text-align: center;
  height: 100%;
}
.cart-item-list {
  flex-grow: 1;
}
.cart-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 1rem;
  padding-right: 6rem;
  gap: 1rem;
  margin-bottom: 1.25rem;
  border: 1px solid #e9e9e9;
  border-radius: 10px;

  @media (max-width: 600px) {
    padding-right: 4rem;
  }
}
.cart-item:last-child {
  margin-bottom: 0;
}
.continue-btn {
  font-size: 1.5rem;
  padding: 1rem 2rem;
  color: white;
  background-color: var(--main-color);
  border-radius: 10px;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
}
</style>
