<template>
  <div class="bg">
    <section class="wrapper">
      <AppProduct :keyProduct="1" />
    </section>
  </div>
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
.bg {
  background-image: url('../assets/images/product_pattern.svg');
  background-size: 50%;
}
</style>
