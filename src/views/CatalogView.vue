<template>
  <Transition mode="out-in">
    <div
      v-if="!categoriesLoaded"
      class="spinner-container">
      <div class="spinner" />
    </div>
    <template v-else>
      <div
        v-if="rightPath"
        class="wrapper w-100 container">
        <div class="top-container">
          <AppBreadcrumbs />
          <AppProductSort :visible="showSidebar" />
          <BaseButton
            size="small"
            class="filter-btn"
            @click="showSidebar = !showSidebar">
            Filter / Search
          </BaseButton>
        </div>
        <div class="bottom-container">
          <AppProductFilter v-show="!smallScreen || showSidebar" />
          <AppProductList />
        </div>
      </div>
      <NotFoundView v-else />
    </template>
  </Transition>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia';
import { useCategoriesStore } from '@/stores/categories';
import AppProductList from '@/components/AppProductList.vue';
import AppProductFilter from '@/components/AppProductFilter.vue';
import AppProductSort from '@/components/AppProductSort.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import type { CatalogViewType } from '@/types/types';

export default {
  components: {
    AppProductList,
    AppProductFilter,
    AppProductSort,
    AppBreadcrumbs,
    NotFoundView,
    BaseButton,
  },
  data(): CatalogViewType {
    return {
      showSidebar: false,
      screenWidth: window.innerWidth,
    };
  },
  computed: {
    ...mapState(useCategoriesStore, ['categoriesLoaded', 'mappedCategories']),
    rightPath(): boolean {
      if (!this.categoriesLoaded) return false;
      const { categorySlug, subcategorySlug } = this.$route.params;
      if (!categorySlug && !subcategorySlug) return true;
      return (
        this.mappedCategories?.some((category) => {
          const rightCat = category.params.categorySlug === categorySlug;
          const rightSubcat = category.params.subcategorySlug === subcategorySlug;
          return rightCat && rightSubcat;
        }) ?? false
      );
    },
    smallScreen(): boolean {
      return this.screenWidth < 801;
    },
  },
  methods: {
    ...mapActions(useCategoriesStore, ['getCategories']),
    onResize(): void {
      this.screenWidth = window.innerWidth;
    },
  },
  created(): void {
    if (!this.categoriesLoaded) this.getCategories();
  },
  mounted(): void {
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
  },
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
}
.top-container {
  display: flex;
  column-gap: 1rem;
  row-gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  grid-column: span 2;
  margin-bottom: 20px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
}
.bottom-container {
  display: flex;
}
.filter-btn {
  display: none;
  width: fit-content;
  padding: 0.5rem 1rem;

  @media (max-width: 800px) {
    display: block;
  }
}
</style>
