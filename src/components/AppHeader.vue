<template>
  <header class="header">
    <div class="wrapper container-header">
      <RouterLink :to="{ name: 'Home' }">
        <img :src="logoIcon" alt="logo" />
      </RouterLink>
      <BaseNavigation />
      <div class="flex">
        <BaseAuthorization />
        <img :src="dividerIcon" alt="" />
        <RouterLink :to="{ name: 'Cart' }">
          <img class="cart-link" :src="cartIcon" alt="cart" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import logoIcon from '@/assets/icons/logo.svg';
import dividerIcon from '@/assets/icons/divider.svg';
import cartIcon from '@/assets/icons/cart.svg';
import BaseAuthorization from './BaseAuthorization.vue';
import BaseNavigation from './BaseNavigation.vue';

export default {
  components: {
    BaseAuthorization,
    BaseNavigation,
  },
  data: (): Record<string, string> => ({
    logoIcon,
    dividerIcon,
    cartIcon,
  }),
};
</script>

<style scoped>
.header {
  position: sticky;
  height: 100px;
  background: #ffffff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.2);
}
.container-header {
  height: 100%;
  display: grid;
  gap: 20px;
  grid-template-columns: auto 1fr auto;
  align-items: center;
}
.cart-link {
  vertical-align: bottom;
}
</style>
