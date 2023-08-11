<template>
  <header class="header container">
    <div class="logo">Logo</div>
    <BaseNavigation />
    <BaseAuthorization />
  </header>
</template>
<script lang="ts">
import BaseAuthorization from './BaseAuthorization.vue';
import BaseNavigation from './BaseNavigation.vue';

export default {
  components: {
    BaseAuthorization,
    BaseNavigation,
  },
};
</script>
<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: #f0f0f0;
}
</style>
