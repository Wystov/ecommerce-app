<template>
  <div class="bg">
    <section class="wrapper">
      <AppProduct :keyProduct="36" />
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
.wrapper {
  margin-top: 50px;

}
.bg {
background-image: url('../assets/images/product_pattern.svg');
  background-size: 50%;
}
</style>
