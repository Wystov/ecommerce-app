<template>
  <div class="cards-container">
    <Transition mode="out-in">
      <div
        v-if="init"
        class="spinner-container">
        <div class="spinner" />
      </div>
      <template v-else>
        <TransitionGroup
          v-if="productList.length || loading"
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
        <div
          v-else
          class="no-products">
          <h3>No products found, try to reset filters</h3>
          <AppProductAppliedFiltersList />
        </div>
      </template>
    </Transition>
    <h3
      v-if="loading"
      class="notification">
      Loaded {{ cardsLoaded }}/{{ total }} products. We are loading more, please, wait...
    </h3>
    <h3
      v-if="endOfLoading"
      class="notification">
      That's all. Choose other category or set filters and restart the search if you'd like to see
      more.
    </h3>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import type { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import { useUserStore } from '@/stores/user';
import { useFilterStore } from '@/stores/filter';
import { useCategoriesStore } from '@/stores/categories';
import api from '@/utils/api/client';
import type { FacetResults, ProductListType } from '@/types/types';
import AppProductCard from './AppProductCard.vue';
import AppProductAppliedFiltersList from './AppProductAppliedFiltersList.vue';

export default {
  components: {
    AppProductCard,
    AppProductAppliedFiltersList,
  },
  data(): ProductListType {
    return {
      productList: [],
      init: true,
      cardsToShow: 10,
      cardsLoaded: 0,
      total: 0,
      loading: false,
      endOfLoading: false,
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
    cardsLimit(): number {
      let res = 6;
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1000) {
        res = 10;
      } else if (windowWidth < 1000 && windowWidth > 700) {
        res = 9;
      }
      return res;
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
    async fetchProducts(): Promise<ProductProjectionPagedSearchResponse> {
      const data = this.queryArgs;
      const queryArgs = Object.fromEntries(Object.entries(data));
      queryArgs.limit = this.cardsToShow;
      queryArgs.offset = this.cardsLoaded;
      const { body } = await api.call().productProjections().search().get({ queryArgs }).execute();
      return body;
    },
    async loadProducts(restart?: 'restart'): Promise<void | undefined> {
      await this.checkCategory();
      const data = await this.fetchProducts();
      const res = this.cardsLoaded + data.results.length;
      if (data.total && res <= data.total) {
        this.cardsLoaded = res;
        this.total = data.total;
        this.setFilterOptions(data.facets as unknown as FacetResults);
        if (!this.loaded) this.buildFilterOptions();
        this.productList = restart ? data.results : this.productList.concat(data.results);
        this.init = false;
        this.loading = false;
      }

      this.stopScroll(data);
    },
    moveScroll(): void {
      const { scrollY } = window;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const pageHeightCoefficient = 1.1;
      if (scrollY + windowHeight * pageHeightCoefficient >= documentHeight && !this.loading) {
        this.loading = this.cardsLoaded > 0;
        this.loadProducts();
      }
    },
    stopScroll(data: ProductProjectionPagedSearchResponse): void {
      if (data.total === this.cardsLoaded) {
        this.endOfLoading = this.productList.length !== 0;
        window.removeEventListener('scroll', this.moveScroll);
      }
    },
    restartLoadingProducts(): void {
      window.addEventListener('scroll', this.moveScroll);
      this.loading = false;
      this.endOfLoading = false;
      this.cardsLoaded = 0;
      this.loadProducts('restart');
    },
  },
  created(): void {
    this.loadProducts();
    this.$watch(
      () => this.queryArgs,
      () => {
        if (this.loaded || this.refresh) {
          this.restartLoadingProducts();
        }
      },
    );
    this.$watch(
      () => this.$route.params,
      () => this.restartLoadingProducts(),
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
.cards-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
}
.spinner-container {
  height: 50vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.catalog {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
}
.card-move {
  transition: all 500ms ease-in-out;
}
.no-products {
  margin-left: 50px;
}
.notification {
  text-align: center;
}
@media (max-width: 800px) {
  .no-products {
    margin: 0 auto;
  }
}
</style>
