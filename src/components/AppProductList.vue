<template>
  <Transition mode="out-in">
    <div
      v-if="init"
      class="spinner-container">
      <div class="spinner" />
    </div>
    <template v-else>
      <TransitionGroup
        v-if="productList.length"
        tag="div"
        class="catalog"
        name="card">
        <AppProductCard
          v-for="product in productList"
          :key="product.id"
          :productData="product"
          :currency="currency"
          :currencyTag="currencyTag" />
      </TransitionGroup>
      <div v-else>No products found</div>
    </template>
  </Transition>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useFilterStore } from '@/stores/filter';
import { useCategoriesStore } from '@/stores/categories';
import api from '@/utils/api/client';
import type { FacetResults, ProductListType } from '@/types/types';
import AppProductCard from './AppProductCard.vue';

export default {
  components: {
    AppProductCard,
  },
  data(): ProductListType {
    return {
      productList: [],
      init: true,
    };
  },
  computed: {
    ...mapState(useUserStore, { userData: 'data', currency: 'currency' }),
    ...mapState(useFilterStore, ['queryArgs', 'loaded', 'refresh']),
    ...mapState(useCategoriesStore, ['categories', 'categoriesLoaded']),
    currencyTag(): string {
      return this.currency === 'USD' ? '$' : '£';
    },
  },
  methods: {
    ...mapActions(useFilterStore, ['setFilterOptions']),
    ...mapActions(useCategoriesStore, ['changeCategory', 'getCategories']),
    async checkCategory(): Promise<void> {
      if (!this.categoriesLoaded) await this.getCategories();
      const { categorySlug, subcategorySlug } = this.$route.params;
      const selectedSlug = subcategorySlug ?? categorySlug;
      const { current } = this.categories;
      if (selectedSlug !== current) this.changeCategory(selectedSlug as string);
    },
    async getProducts(): Promise<void | undefined> {
      await this.checkCategory();
      const { queryArgs } = this;
      const { body } = await api.call().productProjections().search().get({ queryArgs }).execute();
      this.setFilterOptions(body.facets as unknown as FacetResults);
      if (!this.loaded) this.buildFilterOptions();
      this.productList = body.results;
      this.init = false;
    },
  },
  created(): void {
    this.getProducts();
    this.$watch(
      () => this.queryArgs,
      () => {
        if (this.loaded || this.refresh) this.getProducts();
      },
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
  justify-content: flex-start;
  align-content: flex-start;
}
.card-move {
  transition: all 500ms ease-in-out;
}
.spinner-container {
  height: 50vh;
}
</style>
