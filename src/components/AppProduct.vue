<template>
  <div class="product-content">
    <div class="product-slider">
      <AppSlider :images="product.images" />
    </div>
    <div class="product-info">
      <h1 class="product-name">{{ product.name }}</h1>
      <div class="product-price-group">
        <div class="price-container">
          <BasePrice
            v-if="priceDiscounted === ''"
            :size="32"
            :symbol="currencyTag"
            :price="price"
          />
          <BasePrice
            v-else
            :size="24"
            :symbol="currencyTag"
            discounted
            strikethrough
            :price="price"
          />
          <BasePrice
            v-if="priceDiscounted !== ''"
            :size="42"
            :symbol="currencyTag"
            discounted
            :price="priceDiscounted"
          />
        </div>
        <BaseButton
          v-if="isInCart"
          @click="removeFromCart"
          outline
          class="button"
        >Remove from cart</BaseButton
        >
        <BaseButton v-else @click="addToCart" class="button">Add to cart</BaseButton>
      </div>
      <ul class="specification-list">
        <li class="specification-item">
          <span class="property">Brand:</span> <span class="value"> {{ product.brand }}</span>
        </li>
        <li class="specification-item">
          <span class="property">Type:</span> <span class="value">FLAKES</span>
        </li>
        <li class="specification-item">
          <span class="property">Weight:</span>
          <span class="value">{{ product.weight + ' oz' }}</span>
        </li>
      </ul>
      <p class="description">{{ product.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import type { ProductData, Price } from '@commercetools/platform-sdk';
import { mapState, mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import api from '@/utils/api/client';
import BaseButton from './shared/BaseButton.vue';
import AppSlider from './AppSlider.vue';
import BasePrice from './shared/BasePrice.vue';

export default {
  components: {
    BaseButton,
    AppSlider,
    BasePrice,
  },
  props: {
    keyProduct: {
      type: Number,
      required: true,
    },
  },
  data(): {
    productAPI: null | ProductData;
    product: {
      name: string;
      brand: string;
      weight: string;
      description: string;
      images: string[];
    };
    } {
    return {
      productAPI: null,
      product: {
        name: '',
        brand: '',
        weight: '',
        description: '',
        images: [],
      },
    };
  },
  computed: {
    ...mapState(useUserStore, { userData: 'data' }),
    ...mapStores(useUserStore),
    currency(): string {
      return this.userData.country === 'US' ? 'USD' : 'GBP';
    },
    currencyTag(): string {
      return this.currency === 'USD' ? '$' : '£';
    },
    price(): string {
      const priceData = this.getPriceData();
      if (priceData?.value) {
        const { centAmount, fractionDigits } = priceData.value;
        return (centAmount / 10 ** fractionDigits).toString();
      }
      return '';
    },
    priceDiscounted(): string {
      const priceData = this.getPriceData();
      if (priceData?.discounted) {
        const { centAmount, fractionDigits } = priceData.discounted.value;
        return (centAmount / 10 ** fractionDigits).toString();
      }
      return '';
    },
    isInCart(): Boolean {
      return this.userStore.hasProductInCart(this.keyProduct);
    },
  },
  methods: {
    async getProduct(): Promise<void> {
      const { body } = await api
        .call()
        .products()
        .withKey({ key: `${this.keyProduct}` })
        .get()
        .execute();
      this.productAPI = body.masterData.current;
      const { masterVariant } = this.productAPI;

      this.product.name = this.productAPI?.name.en;
      this.product.brand = masterVariant?.attributes?.find((attr) => attr.name === 'brand')?.value;
      this.product.weight = masterVariant?.attributes?.find((attr) => attr.name === 'weight')
        ?.value;
      this.product.description = this.productAPI?.description?.en || '';
      this.product.images = masterVariant.images?.map((img) => img.url) || [];
      console.log(this.productAPI, this.product.images);
    },
    getPriceData(): Price | undefined {
      return this.productAPI?.masterVariant?.prices?.find(
        (price) => price.value.currencyCode === this.currency,
      );
    },
    addToCart(): void {
      this.userStore.addProductToCart(this.keyProduct);
    },
    removeFromCart(): void {
      this.userStore.removeProductFromCart(this.keyProduct);
    },
  },
  created(): void {
    this.getProduct();
  },
};
</script>

<style scoped>
.product-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  width: 100%;
  --second-color: #f9f9f9;
}
.product-slider {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  max-width: 384px;
  padding: 80px 130px;
  border-radius: 20px;
  background: var(--second-color);
  max-width: 384px;
}
.product-info {
  display: flex;
  flex-direction: column;
  align-content: center;
  max-width: 384px;

  gap: 42px;
}
.product-name {
  margin: 0;
  font-weight: 700;
  text-align: center;
}
.button {
  width: 100%;
}
.product-price-group {
  display: flex;
  flex-direction: column;
  padding: 40px 60px;
  gap: 18px;
  border-radius: 20px;
  border: 2px solid #eb5461;
}
.price-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  gap: 20px;
}
.specification-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  .specification-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    border-radius: 4px;
  }
  .specification-item:nth-child(odd) {
    background: var(--second-color);
  }
  .specification-item:first-child .value {
    color: var(--secondary-color);
  }
  .property {
    display: flex;
    font-size: 18px;
    opacity: 0.5;
  }
  .value {
    display: flex;
    font-size: 22px;
  }
}
.description {
  text-align: justify;
}
</style>
