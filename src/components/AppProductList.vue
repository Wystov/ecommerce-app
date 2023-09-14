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
        ref="catalog"
        tag="div"
        class="catalog"
        name="card">
        <AppProductCard
          v-for="product in productList"
          ref="card"
          :key="product.id"
          :productData="product"
          :currency="currency"
          :currencyTag="currencyTag" />
      </TransitionGroup>
      <div
        v-else
        class="no-products">
        <h3>No products found, try to reset filters</h3>
        <AppProductAppliedFiltersList />
      </div>
    </template>
  </Transition>
</template>

<script lang="ts">
// import { ref } from 'vue';
import { mapActions, mapState } from 'pinia';
import type { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import { useUserStore } from '@/stores/user';
import { useFilterStore } from '@/stores/filter';
import { useCategoriesStore } from '@/stores/categories';
import api from '@/utils/api/client';
import type { FacetResults, ProductListType } from '@/types/types';
import AppProductCard from './AppProductCard.vue';
import AppProductAppliedFiltersList from './AppProductAppliedFiltersList.vue';

// const catalog = ref(null);

export default {
  components: {
    AppProductCard,
    AppProductAppliedFiltersList,
  },
  data(): ProductListType {
    return {
      productList: [],
      init: true,
      catalogWidth: 0,
      cardWidth: 0,
      cardsToShow: 10,
      cardsTotal: 0,
    };
  },
  computed: {
    ...mapState(useUserStore, {
      userData: 'data',
      currency: 'currency',
      currencyTag: 'currencyTag',
    }),
    ...mapState(useFilterStore, ['queryArgs', 'loaded', 'refresh']),
    ...mapState(useCategoriesStore, ['categories', 'categoriesLoaded']),
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
    async fetchProducts(): Promise<ProductProjectionPagedSearchResponse> {
      const { queryArgs } = this;
      queryArgs.limit = this.cardsToShow;
      queryArgs.offset = this.cardsTotal;
      const { body } = await api.call().productProjections().search().get({ queryArgs }).execute();
      this.cardsTotal += body.results.length;
      return body;
    },
    async loadProducts(): Promise<void | undefined> {
      await this.checkCategory();
      const data = await this.fetchProducts();
      this.setFilterOptions(data.facets as unknown as FacetResults);
      if (!this.loaded) this.buildFilterOptions();
      this.productList = data.results;
      this.init = false;
    },
    async loadMoreProducts(): Promise<void | undefined> {
      const data = await this.fetchProducts();
      this.productList = this.productList.concat(data.results);
    },
    moveScroll(): void {
      const { scrollY } = window;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollY + windowHeight >= documentHeight) {
        this.loadMoreProducts();
      }
    },
  },
  created(): void {
    this.loadProducts();
    this.$watch(
      () => this.queryArgs,
      () => {
        if (this.loaded || this.refresh) this.loadProducts();
      },
    );
    this.$watch(
      () => this.$route.params,
      () => this.loadProducts(),
    );
  },
  mounted(): void {
    window.addEventListener('scroll', this.moveScroll);
  },
  beforeUnmount(): void {
    window.removeEventListener('scroll', this.moveScroll);
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
.no-products {
  margin-left: 50px;
}
@media (max-width: 800px) {
  .no-products {
    margin: 0 auto;
  }
}
</style>
