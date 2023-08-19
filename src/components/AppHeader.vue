<template>
  <header class="header">
    <div class="wrapper container-header">
      <RouterLink :to="{ name: 'Home' }">
        <img :src="logoIcon" alt="logo" />
      </RouterLink>
      <Push right width="390" :isOpen="isOpen" @closeMenu="isOpen = false">
        <a id="home" href="#">
          <span>Home</span>
        </a>
      </Push>
      <BaseNavigation />
      <div class="flex">
        <BaseAuthorization />
        <img :src="dividerIcon" alt="" />
        <RouterLink :to="{ name: 'Cart' }">
          <img class="cart-link" :src="cartIcon" alt="cart" />
        </RouterLink>
      </div>
      <BaseBurger v-if="!isOpen" @click="openMenu" />
    </div>
  </header>
</template>

<script lang="ts">
import Push from 'vue3-burger-menu';
import logoIcon from '@/assets/icons/logo.svg';
import dividerIcon from '@/assets/icons/divider.svg';
import cartIcon from '@/assets/icons/cart.svg';
import BaseBurger from '@/components/shared/BaseBurger.vue';
import BaseAuthorization from './BaseAuthorization.vue';
import BaseNavigation from './BaseNavigation.vue';

export default {
  components: {
    BaseAuthorization,
    BaseNavigation,
    BaseBurger,
    Push,
  },
  data(): { logoIcon: string; dividerIcon: string; cartIcon: string; isOpen: boolean } {
    return {
      logoIcon,
      dividerIcon,
      cartIcon,
      isOpen: false,
    };
  },
  methods: {
    openMenu(): void {
      console.log(1);
      this.isOpen = true;
    },
  },
};
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  height: 100px;
  background: #ffffff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.2);
}
.container-header {
  height: 100%;
  display: grid;
  grid-template-areas: 'logo navigation user';
  gap: 20px;
  grid-template-columns: auto 1fr auto;
  align-items: center;
}
.navigation {
  grid-area: navigation;
}
.flex {
  grid-area: user;
}
.cart-link {
  vertical-align: bottom;
}
.header :deep(.burger) {
  display: none;
}

@media (max-width: 900px) {
  .container-header {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'logo user navigation';
  }
  .flex {
    justify-content: flex-end;
  }
  .navigation {
    display: none;
  }
  .header :deep(.burger) {
    display: flex;
  }
}
</style>
