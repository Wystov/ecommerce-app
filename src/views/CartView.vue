<template>
  <div class="wrapper">
    <h1>Cart ({{ data?.totalLineItemQuantity }})</h1>
    <div
      v-if="data"
      class="cart">
      <ul class="cart-item-list">
        <li
          v-for="item in data.lineItems"
          :key="item.id"
          class="cart-item">
          <RouterLink
            class="item-image"
            :to="{ name: 'Product', params: { slug: item.productSlug?.en } }">
            <img
              :src="item.variant.images?.[0].url ?? imgPlaceholder"
              alt="item image"
              class="item-image" />
          </RouterLink>
          <div class="item-content">
            <div class="item-info">
              <div class="item-name">
                {{ item.name.en }}
              </div>
              <div>
                Price:
                <template v-if="item.price.discounted">
                  <span class="old-price">
                    {{ formattedPrice(item.price.value.centAmount) }}
                  </span>
                  <span class="new-price">
                    {{ formattedPrice(item.price.discounted.value.centAmount) }}
                  </span>
                </template>
                <template v-else>
                  <span class="price">
                    {{ formattedPrice(item.price.value.centAmount) }}
                  </span>
                </template>
              </div>
            </div>
            <div class="item-values">
              <BaseNumberInput
                :value="item.quantity"
                @valueChange="changeQuantity(item, $event)" />
              <div class="item-total">
                {{ formattedPrice(item.totalPrice.centAmount) }}
              </div>
            </div>
          </div>
          <TrashIcon
            class="remove-icon"
            @click="changeQuantity(item, 0)" />
        </li>
      </ul>
      <div class="cart-info">
        <span>Total: {{ formattedPrice(data.totalPrice.centAmount) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Cart, LineItem, MyCartUpdate } from '@commercetools/platform-sdk';
import { mapState } from 'pinia';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useUserStore } from '@/stores/user';
import api from '@/utils/api/client';
import imgPlaceholder from '@/assets/images/no-image-placeholder.svg';
import BaseNumberInput from '@/components/shared/BaseNumberInput.vue';

export default {
  components: {
    BaseNumberInput,
    TrashIcon,
  },
  data(): { imgPlaceholder: string; data: Cart | null } {
    return {
      imgPlaceholder,
      data: null,
    };
  },
  computed: {
    ...mapState(useUserStore, ['currencyTag']),
  },
  methods: {
    async getCart(): Promise<void> {
      const response = await api.call().me().activeCart().get().execute();
      this.data = response.body;
      console.log(response);
    },
    async changeQuantity(item: LineItem, count: number): Promise<void> {
      const body: MyCartUpdate = {
        version: this.data?.version ?? 0,
        actions: [
          {
            action: 'changeLineItemQuantity',
            lineItemId: item.id,
            quantity: count,
          },
        ],
      };
      const response = await api
        .call()
        .me()
        .carts()
        .withId({ ID: this.data?.id ?? '' })
        .post({ body })
        .execute();
      this.data = response.body;
    },
    formattedPrice(price: number): string {
      return `${this.currencyTag}${(price / 100).toFixed(2)}`;
    },
  },
  created(): void {
    this.getCart();
  },
};
</script>

<style>
.wrapper {
  width: 100%;
}
.cart {
  display: flex;
  gap: 1rem;
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
}
.item-image {
  display: block;
  max-width: 120px;
}
.item-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.item-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.old-price {
  text-decoration: line-through;
}
.price,
.new-price {
  font-size: 1rem;
}
.new-price {
  padding-left: 0.5rem;
  color: var(--main-color);
}
.item-values {
  display: flex;
  align-items: center;
}
.item-total {
  font-size: 1.25rem;
  text-align: right;
  min-width: 8rem;
}
.cart-info {
  width: 300px;
  padding: 1rem;
  border: 1px solid #e9e9e9;
  border-radius: 10px;
}
.remove-icon {
  cursor: pointer;
  position: absolute;
  right: 2rem;
  height: 1.5rem;
}
</style>
