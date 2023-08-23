<template>
  <div class="card">
    <img class="product-image" :src="image" alt="product image" />
    <div class="product-content">
      <p class="product-name">{{ name }}</p>
      <p class="product-description">{{ description }}</p>
      <div class="product-price">
        <p v-if="salePrice" class="old-price">{{ price }}</p>
        <p :class="salePrice ? 'new-price' : 'price'">
          {{ salePrice ?? price }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Price, Product, ProductData } from '@commercetools/platform-sdk';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<Product>,
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
  computed: {
    data(): ProductData {
      return this.product.masterData.current;
    },
    image(): string {
      return this.data.masterVariant.images?.[0].url ?? '';
    },
    brand(): string {
      const attribute = this.data.masterVariant.attributes
        ?.find((attr) => attr.name === 'brand');
      return attribute?.value;
    },
    name(): string {
      return `${this.brand} ${this.data.name.en}`;
    },
    description(): string {
      const DESCRIPTION_MAX_LENGTH = 40;
      const description = this.data.description?.en ?? '';
      if (description.length > DESCRIPTION_MAX_LENGTH) {
        return `${description.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
      }
      return description;
    },
    priceForCountry(): Price[] {
      return this.data.masterVariant.prices
        ?.filter((price) => price.value.currencyCode === this.currency) ?? [];
    },
    price(): string | undefined {
      const price = this.priceForCountry[0];
      if (price !== undefined) {
        return `${this.currencyTag}${price.value.centAmount / 100}`;
      }
      return undefined;
    },
    salePrice(): string | undefined {
      const onSale = this.priceForCountry[0].discounted;
      if (onSale !== undefined) {
        return `${this.currencyTag}${onSale.value.centAmount / 100}`;
      }
      return undefined;
    },
  },
});
</script>

<style scoped>
.card {
  width: 20%;
  padding: 20px;

  @media (max-width: 1000px) {
    width: 30%;
  }
}
.product-image {
  width: 100%;
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
  text-decoration: line-through;
}
.price,
.new-price {
  font-size: 24px;
}
.new-price {
  color: var(--main-color);
}
</style>
