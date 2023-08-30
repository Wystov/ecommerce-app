<template>
  <div class="bg">
    <section class="wrapper">
      <AppProduct />
    </section>
  </div>
</template>

<script lang="ts">
import AppProduct from '@/components/AppProduct.vue';

export default {
  components: {
    AppProduct,
  },
  data(): { header?: Element | null } {
    return {
      header: document?.body?.firstElementChild?.firstElementChild,
    };
  },
  created(): void {
    if (this.header instanceof HTMLElement) this.header.style.marginBottom = '0';
  },
  unmounted(): void {
    if (this.header instanceof HTMLElement) this.header.style.marginBottom = '';
  },
};
</script>
<style scoped>
.bg {
  background-image: url('../assets/images/product_pattern.svg');
  background-size: 50%;
  padding-top: 80px;
  box-shadow: inset 0px -30px 16px 0px #fff;
}
</style>
