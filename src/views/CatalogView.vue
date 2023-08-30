<template>
  <Transition mode="out-in">
    <div v-if="!categoriesLoaded" class="spinner-container">
      <div class="spinner" />
    </div>
    <template v-else>
      <div v-if="rightPath" class="wrapper w-100 container">
        <AppBreadcrumbs />
        <AppProductSort />
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
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.spinner-container {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
.container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
}
</style>
