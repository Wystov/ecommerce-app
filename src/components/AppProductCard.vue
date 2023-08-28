<template>
  <RouterLink class="card" :to="{ name: 'Product', params: { slug } }">
    <img class="product-image w-100" :src="image" alt="product image" />
    <div class="product-content">
      <p class="product-name">{{ name }}</p>
      <p class="product-description">{{ description }}</p>
      <div class="product-price">
        <span v-if="salePrice" class="old-price">{{ price }}</span>
        <span :class="salePrice ? 'new-price' : 'price'">
          {{ salePrice ?? price }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script lang="ts">
import type { Price, ProductProjection, ProductVariant } from '@commercetools/platform-sdk';
import { defineComponent, type PropType } from 'vue';
import imgPlaceholder from '@/assets/images/no-image-placeholder.svg';

export default defineComponent({
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
    product(): ProductVariant {
      return this.productData.masterVariant;
    },
    image(): string {
      return this.product.images?.[0].url ?? imgPlaceholder;
    },
    brand(): string {
      const attribute = this.product.attributes
        ?.find((attr) => attr.name === 'brand');
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
      return this.product.prices
        ?.filter((price) => price.value.currencyCode === this.currency)[0];
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
  },
  methods: {
    formattedPrice(cents: number): string {
      return `${this.currencyTag}${cents / 100}`;
    },
  },
});
</script>

<style scoped>
.card {
  box-sizing: border-box;
  width: 20%;
  padding: 20px;
  border: 1px solid #e9e9e9;
  margin-left: -1px;
  margin-top: -1px;
  text-decoration: none;

  @media (max-width: 1000px) {
    width: 30%;
  }
}
.product-content {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.product-name {
  font-weight: 600;
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
</style>
