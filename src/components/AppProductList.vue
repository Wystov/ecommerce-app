<template>
  <div v-if="productList.length" class="catalog">
    <AppProductCard
      v-for="product in productList"
      :key="product.id"
      :productData="product"
      :currency="currency"
      :currencyTag="currencyTag"
    />
  </div>
  <div v-else>No products found</div>
</template>

<script lang="ts">
import type { ProductProjection } from '@commercetools/platform-sdk';
import { mapActions, mapState } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useFilterStore } from '@/stores/filter';
import api from '@/utils/api/client';
import type { FacetResults } from '@/types/types';
import AppProductCard from './AppProductCard.vue';

export default {
  components: {
    AppProductCard,
  },
  data(): { productList: ProductProjection[] } {
    return {
      productList: [],
    };
  },
  computed: {
    ...mapState(useUserStore, { userData: 'data' }),
    ...mapState(useFilterStore, ['queryArgs', 'loaded']),
    currency(): string {
      return this.userData.country === 'US' ? 'USD' : 'GBP';
    },
    currencyTag(): string {
      return this.currency === 'USD' ? '$' : '£';
    },
  },
  methods: {
    ...mapActions(useFilterStore, ['setFilterOptions']),
    async getProducts(): Promise<void | undefined> {
      const { queryArgs } = this;
      const { body } = await api.call().productProjections().search()
        .get({ queryArgs })
        .execute();
      console.log(body);
      this.setFilterOptions(body.facets as unknown as FacetResults);
      this.productList = body.results;
    },
  },
  created(): void {
    this.getProducts();
    this.$watch(
      () => this.queryArgs,
      () => this.getProducts(),
    );
  },
};
</script>

<style scoped>
.catalog {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
