<template>
  <div class="wrapper w-100 container">
    <AppProductSort />
    <AppProductFilter />
    <AppProductList />
  </div>
</template>

<script lang="ts">
import AppProductList from '@/components/AppProductList.vue';
import AppProductFilter from '@/components/AppProductFilter.vue';
import AppProductSort from '@/components/AppProductSort.vue';

export default {
  components: {
    AppProductList,
    AppProductFilter,
    AppProductSort,
  },
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-rows: auto 1fr;
}
</style>
