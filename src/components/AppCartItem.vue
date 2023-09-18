<template>
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
      <div class="price-container">
        Price:
        <template v-if="item.price.discounted">
          <span class="old-price">
            {{ prices.oldPrice }}
          </span>
          <span class="new-price">
            {{ prices.newPrice }}
          </span>
        </template>
        <template v-else>
          <span class="price">
            {{ prices.price }}
          </span>
        </template>
      </div>
    </div>
    <div class="item-values">
      <BaseNumberInput
        :value="item.quantity"
        :max="item.variant.availability?.availableQuantity ?? 1"
        :disabled="disableButtons"
        @valueChange="updateQuantity(item?.productKey ?? '', $event)" />
      <div class="item-total">
        {{ prices.itemTotal }}
      </div>
    </div>
  </div>
  <TrashIcon
    class="remove-icon"
    @click="updateQuantity(item?.productKey ?? '', 0)" />
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { mapActions } from 'pinia';
import type { LineItem } from '@commercetools/platform-sdk';
import imgPlaceholder from '@/assets/images/no-image-placeholder.svg';
import { useCartStore } from '@/stores/cart';
import type { CartItemPrices } from '@/types/types';
import BaseNumberInput from './shared/BaseNumberInput.vue';

export default defineComponent({
  components: {
    BaseNumberInput,
    TrashIcon,
  },
  props: {
    item: {
      type: Object as PropType<LineItem>,
      required: true,
    },
    prices: {
      type: Object as PropType<CartItemPrices>,
      required: true,
    },
    disableButtons: {
      type: Boolean,
      default: false,
    },
  },
  data(): { imgPlaceholder: string } {
    return {
      imgPlaceholder,
    };
  },
  methods: {
    ...mapActions(useCartStore, ['updateQuantity']),
  },
});
</script>

<style scoped>
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
  max-width: 250px;
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

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
}
.item-total {
  font-size: 1.25rem;
  text-align: right;
  min-width: 8rem;

  @media (max-width: 600px) {
    margin-top: 1rem;
    text-align: left;
  }
}
.remove-icon {
  cursor: pointer;
  position: absolute;
  right: 2rem;
  height: 1.5rem;
}
.price-container {
  margin-bottom: 1rem;
}
</style>
