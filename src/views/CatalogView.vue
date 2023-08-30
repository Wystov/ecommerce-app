<template>
  <Transition mode="out-in">
    <div v-if="!categoriesLoaded" class="spinner-container">
      <div class="spinner" />
    </div>
    <template v-else>
      <div v-if="rightPath" class="wrapper w-100 container">
        <div class="top-container">
          <AppBreadcrumbs />
          <AppProductSort />
        </div>
        <AppProductFilter />
        <AppProductList />
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

export default {
  components: {
    AppProductList,
    AppProductFilter,
    AppProductSort,
    AppBreadcrumbs,
    NotFoundView,
  },
  computed: {
    ...mapState(useCategoriesStore, ['categoriesLoaded', 'mappedCategories']),
    rightPath(): boolean {
      if (!this.categoriesLoaded) return false;
      const { categorySlug, subcategorySlug } = this.$route.params;
      if (!categorySlug && !subcategorySlug) return true;
      return this.mappedCategories?.some((category) => {
        const rightCat = category.params.categorySlug === categorySlug;
        const rightSubcat = category.params.subcategorySlug === subcategorySlug;
        return rightCat && rightSubcat;
      }) ?? false;
    },
  },
  methods: {
    ...mapActions(useCategoriesStore, ['getCategories']),
  },
  created(): void {
    if (!this.categoriesLoaded) this.getCategories();
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
  justify-content: space-between;
  grid-column: span 2;
}
</style>
