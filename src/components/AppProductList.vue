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
import { useCategoriesStore } from '@/stores/categories';
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
    ...mapState(useCategoriesStore, ['categories', 'categoriesLoaded']),
    currency(): string {
      return this.userData.country === 'US' ? 'USD' : 'GBP';
    },
    currencyTag(): string {
      return this.currency === 'USD' ? '$' : '£';
    },
  },
  methods: {
    ...mapActions(useFilterStore, ['setFilterOptions']),
    ...mapActions(useCategoriesStore, ['changeCategory', 'getCategories']),
    async checkCategory(): Promise<void> {
      if (!this.categoriesLoaded) await this.getCategories();
      const { params } = this.$route;
      const { categorySlug, subcategorySlug } = params;
      const selectedSlug = subcategorySlug ?? categorySlug;
      const { current } = this.categories;
      if (selectedSlug !== current) this.changeCategory(selectedSlug as string);
    },
    async getProducts(): Promise<void | undefined> {
      await this.checkCategory();
      const { queryArgs } = this;
      const { body } = await api.call().productProjections().search()
        .get({ queryArgs })
        .execute();
      this.setFilterOptions(body.facets as unknown as FacetResults);
      if (!this.loaded) this.buildFilterOptions();
      this.productList = body.results;
      console.log('products', body.results);
    },
  },
  created(): void {
    this.getProducts();
    this.$watch(
      () => this.queryArgs,
      () => { if (this.loaded) this.getProducts(); },
    );
    this.$watch(
      () => this.$route.params,
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
