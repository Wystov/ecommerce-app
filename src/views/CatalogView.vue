<template>
  <div class="wrapper w-100 container">
    <AppBreadcrumbs />
    <AppProductSort />
    <AppProductFilter />
    <AppProductList />
  </div>
</template>

<script lang="ts">
import AppProductList from '@/components/AppProductList.vue';
import AppProductFilter from '@/components/AppProductFilter.vue';
import AppProductSort from '@/components/AppProductSort.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';

export default {
  components: {
    AppProductList,
    AppProductFilter,
    AppProductSort,
    AppBreadcrumbs,
  },
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
}
</style>
