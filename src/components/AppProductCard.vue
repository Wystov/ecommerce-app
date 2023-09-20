<template>
  <RouterLink
    class="card"
    :to="{ name: 'Product', params: { slug } }">
    <div class="product-content">
      <img
        class="product-image w-100"
        :src="image"
        alt="product image" />
      <p class="product-name">{{ name }}</p>
      <p class="product-description">
        {{ description }}
      </p>
    </div>
    <div class="product-footer">
      <div class="product-price">
        <span
          v-if="salePrice"
          class="old-price">
          {{ price }}
        </span>
        <span :class="salePrice ? 'new-price' : 'price'">
          {{ salePrice ?? price }}
        </span>
      </div>
      <BaseButton
        v-if="!hasProductInCart(keyProduct)"
        class="btn"
        circle
        size="small"
        :disabled="fetching"
        @click.prevent="cartHandler()">
        <ShoppingCartIcon class="icon" />
      </BaseButton>
      <BaseButton
        v-else
        dark
        class="btn"
        circle
        size="small"
        :disabled="fetching"
        @click.prevent="updateQuantity(keyProduct, 0)">
        <TrashIcon class="icon" />
      </BaseButton>
    </div>
  </RouterLink>
</template>

<script lang="ts">
import type { Price, ProductProjection, ProductVariant } from '@commercetools/platform-sdk';
import { defineComponent, type PropType } from 'vue';
import { ShoppingCartIcon, TrashIcon } from '@heroicons/vue/20/solid';
import { mapActions, mapState } from 'pinia';
import imgPlaceholder from '@/assets/images/no-image-placeholder.svg';
import { useCartStore } from '@/stores/cart';
import BaseButton from './shared/BaseButton.vue';

export default defineComponent({
  components: {
    BaseButton,
    ShoppingCartIcon,
    TrashIcon,
  },
  props: {
    productData: {
      type: Object as PropType<ProductProjection>,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    currencyTag: {
      type: String,
      required: true,
    },
  },
  data: () => ({ imgPlaceholder }),
  computed: {
    ...mapState(useCartStore, { cartId: 'cartId', fetching: 'fetching' }),
    product(): ProductVariant {
      return this.productData.masterVariant;
    },
    image(): string {
      return this.product.images?.[0].url ?? imgPlaceholder;
    },
    brand(): string {
      const attribute = this.product.attributes?.find((attr) => attr.name === 'brand');
      return attribute?.value;
    },
    name(): string {
      return `${this.productData.name.en} by ${this.brand}`;
    },
    description(): string {
      const DESCRIPTION_MAX_LENGTH = 40;
      const description = this.productData.description?.en ?? '';
      if (description.length > DESCRIPTION_MAX_LENGTH) {
        return `${description.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
      }
      return description;
    },
    priceForCountry(): Price | undefined {
      return this.product.prices?.filter((price) => price.value.currencyCode === this.currency)[0];
    },
    price(): string | undefined {
      const normalPrice = this.priceForCountry?.value?.centAmount;
      return normalPrice ? this.formattedPrice(normalPrice) : undefined;
    },
    salePrice(): string | undefined {
      const salePrice = this.priceForCountry?.discounted?.value.centAmount;
      return salePrice ? this.formattedPrice(salePrice) : undefined;
    },
    slug(): string {
      return this.productData.slug.en;
    },
    sku(): string {
      return this.productData.masterVariant.sku ?? '';
    },
    keyProduct(): string {
      return this.productData.key ?? '';
    },
  },
  methods: {
    ...mapActions(useCartStore, [
      'addProductToCart',
      'hasProductInCart',
      'createCart',
      'updateQuantity',
    ]),
    formattedPrice(cents: number): string {
      return `${this.currencyTag}${(cents / 100).toFixed(2)}`;
    },
    async cartHandler(): Promise<void> {
      if (!this.cartId) await this.createCart();
      this.addProductToCart([{ sku: this.sku, quantity: 1 }]);
    },
  },
});
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: calc(20% + 1px);
  max-height: fit-content;
  padding: 20px;
  border: 1px solid #e9e9e9;
  margin-left: -1px;
  margin-top: -1px;
  text-decoration: none;
  background-color: white;
  transition: all 0.1s;

  @media (hover: hover) {
    &:hover {
      z-index: 2;
      box-shadow: 0 2px 16px #0000003d;
    }
  }

  @media (max-width: 1000px) {
    width: calc(33.333% + 1px);
  }

  @media (max-width: 700px) {
    width: calc(50% + 1px);
  }

  @media (max-width: 380px) {
    width: calc(100% + 1px);
  }
}
.product-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.product-image {
  margin-bottom: 20px;
}
.product-name {
  font-weight: 600;
}
.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.old-price {
  display: block;
  text-decoration: line-through;
}
.price,
.new-price {
  display: block;
  font-size: 24px;
}
.new-price {
  color: var(--main-color);
}
.icon :deep(path) {
  color: #fff;
  width: 20px;
  transition: 0.3s;
}
.btn:hover:deep(path) {
  color: #f0f0f0;
}
</style>
