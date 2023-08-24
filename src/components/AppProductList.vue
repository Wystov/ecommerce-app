<template>
  <BaseSelect
    @selectOption="changeSort"
    id="sortBy"
    label="Sort by:"
    :options="sortOptions"
    :defaultSelected="sortOptions[0].value"
    :isPlain="true"
    class="sort-select"
  />
  <div class="catalog">
    <AppProductCard
      v-for="product in productList"
      :key="product.id"
      :productData="product"
      :currency="currency"
      :currencyTag="currencyTag"
    />
  </div>
</template>

<script lang="ts">
import type { ProductProjection } from '@commercetools/platform-sdk';
import { mapState } from 'pinia';
import { useUserStore } from '@/stores/user';
import type { SelectOptions, SortBy } from '@/types/types';
import api from '@/utils/api/client';
import AppProductCard from './AppProductCard.vue';
import BaseSelect from './shared/BaseSelect.vue';

export default {
  components: {
    AppProductCard,
    BaseSelect,
  },
  data: (): { productList: ProductProjection[], sortOptions: SelectOptions[] } => ({
    productList: [],
    sortOptions: [
      {
        text: 'Default',
        value: '',
      },
      {
        text: 'Price ↓',
        value: 'price asc',
      },
      {
        text: 'Price ↑',
        value: 'price desc',
      },
      {
        text: 'Name',
        value: 'name.en asc',
      },
    ],
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
    async getProducts(queryArgs?: { sort?: string}): Promise<void> {
      const { body } = await api.call().productProjections().search()
        .get({ queryArgs })
        .execute();
      console.log(body);
      this.productList = body.results;
    },
    changeSort(value: SortBy): void {
      if (value.length) {
        const queryArgs = { sort: value };
        this.getProducts(queryArgs);
      } else {
        this.getProducts();
      }
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
  justify-content: center;
}
.sort-select {
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 0;
  margin-bottom: 25px;
}
:deep(.select) {
  padding-left: 0.8rem;
  padding-right: 1.6rem;
}
</style>
