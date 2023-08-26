<template>
  <section class="wrapper">
    <AppProduct :keyProduct="36" />
  </section>
</template>

<script lang="ts">
import AppProduct from '@/components/AppProduct.vue';

export default {
  components: {
    AppProduct,
  },
};
</script>
<style scoped>
.wrapper {
  margin-top: 50px;
}
</style>
