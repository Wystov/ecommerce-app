<template>
  <Transition mode="out-in">
    <div v-if="fetching" class="spinner-container">
      <div class="spinner" />
    </div>
    <template v-else>
      <div v-if="productData" class="product-content">
        <h1 class="product-name mobile-name">
          {{ product.name[0] }}
          <span v-if="product.name[1]" class="product-name-light">{{ product.name[1] }}</span>
        </h1>
        <div class="product-slider">
          <AppSlider :images="product.images" />
        </div>
        <div class="product-info">
          <h1 class="product-name">
            {{ product.name[0] }}
            <span v-if="product.name[1]" class="product-name-light">{{ product.name[1] }}</span>
          </h1>
          <div class="product-price-group">
            <div class="price-container">
              <BasePrice
                v-if="priceDiscounted === ''"
                :size="40"
                :symbol="currencyTag"
                :price="price"
              />
              <BasePrice v-else :size="26" :symbol="currencyTag" strikethrough :price="price" />
              <BasePrice
                v-if="priceDiscounted !== ''"
                :size="52"
                :symbol="currencyTag"
                discounted
                :price="priceDiscounted"
              />
            </div>
            <BaseButton
              v-if="hasProductInCart(keyProduct)"
              @click="removeProductFromCart(keyProduct)"
              outline
              class="button"
            >Remove from cart</BaseButton
            >
            <BaseButton
              v-else
              @click="addProductToCart(keyProduct)"
              class="button"
            >Add to cart</BaseButton
            >
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
      <NotFoundView v-else />
    </template>
  </Transition>
</template>

<script lang="ts">
import type { Price } from '@commercetools/platform-sdk';
import { mapState, mapActions } from 'pinia';
import type { AppProduct } from '@/types/types';
import { useUserStore } from '@/stores/user';
import api from '@/utils/api/client';
import NotFoundView from '@/views/NotFoundView.vue';
import BaseButton from './shared/BaseButton.vue';
import AppSlider from './AppSlider.vue';
import BasePrice from './shared/BasePrice.vue';

export default {
  components: {
    BaseButton,
    AppSlider,
    BasePrice,
    NotFoundView,
  },
  props: {
    keyProduct: {
      type: Number,
      required: true,
    },
  },
  data(): AppProduct {
    return {
      fetching: true,
      productData: null,
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
  },
  methods: {
    ...mapActions(useUserStore, ['addProductToCart', 'removeProductFromCart', 'hasProductInCart']),
    async getProduct(): Promise<void> {
      const { slug } = this.$route.params;
      const queryArgs = { where: `slug(en="${slug}")` };
      try {
        const { body } = await api.call()
          .productProjections().get({ queryArgs })
          .execute();
        if (!body.results.length) throw new Error('no product');
        // eslint-disable-next-line prefer-destructuring
        this.productData = body.results[0];
        const { masterVariant } = this.productData;

        this.splittedTitle(this.productData?.name.en);
        this.product.attributes = masterVariant?.attributes;
        this.product.description = this.productData?.description?.en || '';
        this.product.images = masterVariant.images?.map((img) => img.url) || [];
      } catch (error) {
        this.productData = null;
      } finally {
        this.fetching = false;
      }
    },
    getPriceData(): Price | undefined {
      return this.productData?.masterVariant?.prices?.find(
        (price) => price.value.currencyCode === this.currency,
      );
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
.spinner-container {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.product-content {
  --second-color: #f9f9f9;
  --gap: 40px;

  display: grid;
  grid-template-columns: repeat(2, calc(50% - var(--gap) / 2));
  justify-content: center;
  gap: var(--gap);
  width: 100%;
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
  &.mobile-name {
    display: none;
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
}
@media (max-width: 1680px) {
  .product-content {
    display: flex;
  }
  .product-slider {
    max-width: 100%;
    width: 30vw;
    padding: 4vw 5vw;
  }
  .product-info {
    max-width: 100%;
    width: 40vw;
  }
}
@media (max-width: 900px) {
  .product-price-group {
    padding: 34px;
  }
  .product-slider {
    width: 42vw;
    background: transparent;
    padding: 0;
    padding-top: 4vw;
  }
}
@media (max-width: 768px) {
  .product-content {
    flex-direction: column;
    align-items: center;
  }
  .product-slider,
  .product-info {
    width: 70vw;
    padding-top: 0;
  }
  .product-name {
    display: none;
    &.mobile-name {
      display: block;
      font-size: 48px;
    }
  }
}
@media (max-width: 500px) {
  .product-slider,
  .product-info {
    width: 80vw;
  }
  .product-name {
    &.mobile-name {
      font-size: 38px;
    }
  }
}
</style>
