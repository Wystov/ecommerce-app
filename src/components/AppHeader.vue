<template>
  <header class="header">
    <Transition name="slide">
      <AppBurgerMenu
        v-show="isBurgerOpen"
        @closeMenu="toggleMenu"
        :isOpen="isBurgerOpen"
        class="menu-block" />
    </Transition>
    <div class="wrapper container-header">
      <RouterLink :to="{ name: 'Home' }">
        <img :src="logoIcon" alt="logo" class="logo" />
      </RouterLink>
      <BaseNavigation />
      <div class="flex">
        <BaseAuthorization />
        <img :src="dividerIcon" alt="" class="divider" />
        <RouterLink :to="{ name: 'Cart' }">
          <img class="cart-link" :src="cartIcon" alt="cart" />
        </RouterLink>
      </div>
      <BaseBurger @click.stop="toggleMenu" :isOpen="isBurgerOpen" />
    </div>
  </header>
</template>

<script lang="ts">
import logoIcon from '@/assets/icons/logo.svg';
import dividerIcon from '@/assets/icons/divider.svg';
import cartIcon from '@/assets/icons/cart.svg';
import BaseBurger from '@/components/shared/BaseBurger.vue';
import BaseAuthorization from './BaseAuthorization.vue';
import BaseNavigation from './BaseNavigation.vue';
import AppBurgerMenu from './AppBurgerMenu.vue';

export default {
  components: {
    BaseAuthorization,
    BaseNavigation,
    BaseBurger,
    AppBurgerMenu,
  },
  data(): { logoIcon: string; dividerIcon: string; cartIcon: string; isBurgerOpen: boolean } {
    return {
      logoIcon,
      dividerIcon,
      cartIcon,
      isBurgerOpen: false,
    };
  },
  methods: {
    toggleMenu(): void {
      this.isBurgerOpen = !this.isBurgerOpen;
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
  z-index: 2;
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
.menu-block {
  transition: transform 0.5s;
}

.slide-enter-active,
.slide-leave-active {
  transform: translateX(0%);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
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

@media (max-width: 600px) {
  .authorization-list,
  .divider {
    display: none;
  }
  .logo {
    width: 120px;
  }
}
</style>
