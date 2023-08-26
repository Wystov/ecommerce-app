<template>
  <div class="product-content">
    <div class="product-slider">
      <AppSlider :images="product.images" />
    </div>
    <div class="product-info">
      <h1 class="product-name">{{ product.name[0] }}
        <span v-if="product.name[1]" class="product-name-light">{{ product.name[1] }}</span>
      </h1>
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
        >Remove from cart</BaseButton>
        <BaseButton v-else @click="addToCart" class="button">Add to cart</BaseButton>
      </div>
      <ul class="specification-list">
        <li class="specification-item" v-for="(attr, i) in product.attributes" :key="i">
          <span class="property">{{ attr.name }}</span>
          <span class="value">
            {{ attr.name === 'weight' ? attr.value + ' oz' : attr.value }}
          </span>
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

type Attribute = { name: string, value: string }

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
      name: string[];
      attributes?: Attribute[];
      description: string;
      images: string[];
    };
    } {
    return {
      productAPI: null,
      product: {
        name: [],
        attributes: [],
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

      this.splittedTitle(this.productAPI?.name.en);
      this.product.attributes = masterVariant?.attributes;
      this.product.description = this.productAPI?.description?.en || '';
      this.product.images = masterVariant.images?.map((img) => img.url) || [];
      console.log(this.productAPI);
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
    splittedTitle(title: string): void {
      const words = title.split(' ');

      if (words.length < 3) {
        this.product.name[0] = words.splice(0, 1).join('');
        this.product.name[1] = words.join(' ');
      } else {
        this.product.name[0] = title;
      }
    },
  },
  created(): void {
    this.getProduct();
  },
};
</script>

<style scoped>
.product-content {
  --gap: 40px;
  display: grid;
  grid-template-columns: repeat(2, calc(50% - var(--gap) / 2));
  justify-content: center;
  gap: var(--gap);
  width: 100%;
  --second-color: #f9f9f9;
}
.product-slider {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 80px 130px;
  border-radius: 20px;
  background: var(--second-color);
  height: fit-content;
}
.product-info {
  display: flex;
  flex-direction: column;
  align-content: center;
  gap: 42px;
}
.product-name {
  margin: 0;
  font-weight: 700;
  text-align: center;
  .product-name-light {
  font-weight: 500;
}
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
  backdrop-filter: blur(4px);
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
  backdrop-filter: blur(4px);
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
    text-transform: capitalize;
  }
  .value {
    display: flex;
    font-size: 22px;
    text-transform: uppercase;
  }
}
.description {
  text-align: justify;
  backdrop-filter: blur(4px);
}
</style>
