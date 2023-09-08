<template>
  <Transition mode="out-in">
    <div
      v-if="fetching"
      class="spinner-container">
      <div class="spinner" />
    </div>
    <template v-else>
      <div
        v-if="data && data.lineItems.length"
        class="wrapper">
        <div class="top-container">
          <h1>Cart{{ ` (${data?.totalLineItemQuantity ?? 0}` }})</h1>
          <BaseButton
            class="clear-cart-button"
            size="small"
            @click="showModal = true">
            Clear Shopping Cart
          </BaseButton>
        </div>
        <div class="cart">
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
                    :max="item.variant.availability?.availableQuantity ?? 1"
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
            <span class="info-title">Promocode</span>
            <div class="promo-container">
              <BaseInput
                id="promocode"
                ref="promoInput"
                width="75%"
                @keyup.enter="applyPromo" />
              <BaseButton
                size="small"
                class="promocode-btn"
                @click="applyPromo">
                Apply
              </BaseButton>
            </div>
            <Transition>
              <BaseMessage
                v-if="showPromoAlert"
                absolute
                arrow="top"
                alert="danger">
                {{ promoAlertMessage }}
              </BaseMessage>
            </Transition>
            <span class="info-total">Total: {{ formattedPrice(data.totalPrice.centAmount) }}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="empty-cart-info">
          <h3>Cart is empty</h3>
          <RouterLink :to="{ name: 'Catalog' }">Continue shopping</RouterLink>
        </div>
      </div>
    </template>
  </Transition>
  <BasePopup
    :show="showModal"
    @close="showModal = false">
    <div class="popup-container">
      <h3>Are you sure?</h3>
      <p>This will clear all items from your cart.</p>
      <BaseButton
        class="medium"
        @click="removeCart">
        Clear cart
      </BaseButton>
    </div>
  </BasePopup>
</template>

<script lang="ts">
import type { LineItem, MyCartUpdate } from '@commercetools/platform-sdk';
import { mapState } from 'pinia';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useUserStore } from '@/stores/user';
import api from '@/utils/api/client';
import imgPlaceholder from '@/assets/images/no-image-placeholder.svg';
import BaseNumberInput from '@/components/shared/BaseNumberInput.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BasePopup from '@/components/shared/BasePopup.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import type { BaseInputType, CartType } from '@/types/types';
import BaseMessage from '@/components/shared/BaseMessage.vue';

export default {
  components: {
    BaseNumberInput,
    TrashIcon,
    BaseButton,
    BasePopup,
    BaseInput,
    BaseMessage,
  },
  data(): CartType {
    return {
      fetching: true,
      imgPlaceholder,
      data: null,
      showModal: false,
      showPromoAlert: false,
      promoAlertMessage: '',
      promoApplied: false,
      promoAlertTimeout: null,
    };
  },
  computed: {
    ...mapState(useUserStore, ['currencyTag']),
    requestBody(): MyCartUpdate {
      const body: MyCartUpdate = {
        version: this.data?.version ?? 0,
        actions: [],
      };
      return body;
    },
  },
  methods: {
    async getCart(): Promise<void> {
      try {
        const response = await api.call().me().activeCart().get().execute();
        this.data = response.body;
      } catch {
        this.data = null;
      } finally {
        this.fetching = false;
      }
    },
    async changeQuantity(item: LineItem, count: number): Promise<void> {
      const body = { ...this.requestBody };
      body.actions.length = 0;
      body.actions.push({
        action: 'changeLineItemQuantity',
        lineItemId: item.id,
        quantity: count,
      });
      const response = await api
        .call()
        .me()
        .carts()
        .withId({ ID: this.data?.id ?? '' })
        .post({ body })
        .execute();
      this.data = response.body;
    },
    async removeCart(): Promise<void> {
      this.showModal = false;
      await api
        .call()
        .me()
        .carts()
        .withId({ ID: this.data?.id ?? '' })
        .delete({ queryArgs: { version: this.data?.version ?? 0 } })
        .execute();
      this.data = null;
    },
    async applyPromo(): Promise<void> {
      const input = this.$refs.promoInput as BaseInputType;
      const code = input.inputValue.trim();
      if (!code.length) return;
      const body = { ...this.requestBody };
      body.actions.length = 0;
      body.actions.push({
        action: 'addDiscountCode',
        code,
      });
      if (this.promoAlertTimeout) clearTimeout(this.promoAlertTimeout);
      try {
        const response = await api
          .call()
          .me()
          .carts()
          .withId({ ID: this.data?.id ?? '' })
          .post({ body })
          .execute();
        this.data = response.body;
        this.promoApplied = true;
      } catch (error) {
        this.promoAlertMessage = (error as Error).message;
        this.showPromoAlert = true;
        this.promoAlertTimeout = window.setTimeout(() => {
          this.showPromoAlert = false;
        }, 5000);
      } finally {
        input.inputValue = '';
      }
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
.top-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.cart-item:last-child {
  margin-bottom: 0;
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
.info-total {
  display: block;
  margin-bottom: 1rem;
}
.empty-cart-info {
  display: grid;
  place-items: center;
  row-gap: 2rem;
}
.popup-container {
  display: grid;
  place-items: center;
  row-gap: 2rem;
  padding: 2rem;
}
.promo-container {
  display: flex;
  gap: 0.5rem;
}
.info-title {
  font-weight: 600;
}
.top-container .clear-cart-button {
  background: white;
  color: var(--main-font-color);
  font-size: 0.9rem;
  border: 1.5px solid var(--main-font-color);

  &:hover {
    border: 1.5px solid transparent;
  }
}
</style>
