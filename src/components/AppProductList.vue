<template>
  <div class="catalog">
    <AppProductCard
      v-for="product in productList"
      :key="product.id"
      :productData="product"
      :currency="currency"
      :currencyTag="currencyTag" />
  </div>
</template>

<script lang="ts">
import type { ProductProjection } from '@commercetools/platform-sdk';
import { mapState } from 'pinia';
import { useUserStore } from '@/stores/user';
import api from '@/utils/api/client';
import AppProductCard from './AppProductCard.vue';

export default {
  components: {
    AppProductCard,
  },
  data: (): { productList: ProductProjection[] } => ({
    productList: [],
  }),
  computed: {
    ...mapState(useUserStore, { userData: 'data' }),
    currency(): string {
      return this.userData.country === 'US' ? 'USD' : 'GBP';
    },
    currencyTag(): string {
      return this.currency === 'USD' ? '$' : '£';
    },
  },
  methods: {
    async getProducts(): Promise<void> {
      const { body } = await api.call().productProjections().search().get()
        .execute();
      this.productList = body.results;
    },
  },
  created(): void {
    this.getProducts();
  },
};
</script>

<style scoped>
.catalog {
  display: flex;
  flex-wrap: wrap;
}
</style>
