<template>
  <header class="header">
    <Transition name="slide">
      <AppBurgerMenu
        v-show="isBurgerOpen"
        :isOpen="isBurgerOpen"
        class="menu-block"
        @closeMenu="toggleMenu" />
    </Transition>
    <div class="wrapper container-header">
      <RouterLink :to="{ name: 'Home' }">
        <img
          :src="logoIcon"
          alt="logo"
          class="logo" />
      </RouterLink>
      <BaseNavigation />
      <div class="flex">
        <BaseAuthorization />
        <img
          :src="dividerIcon"
          alt=""
          class="divider" />
        <RouterLink :to="{ name: 'Cart' }">
          <img
            class="cart-link"
            :src="cartIcon"
            alt="cart" />
          <div v-if="productsQuantity" class="goods-quantity-container">
            <p class="goods-quantity">{{ productsQuantity }}</p>
          </div>
        </RouterLink>
      </div>
      <BaseBurger
        :isOpen="isBurgerOpen"
        @click.stop="toggleMenu" />
    </div>
  </header>
</template>

<script lang="ts">
import { useCartStore } from '@/stores/cart';
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
  computed: {
    productsQuantity(): string {
      const cart = useCartStore();
      if (!cart.products) return '';
      const quantity = cart.products.reduce((acc, el) => acc + el.quantity, 0);
      if (quantity === 0) return '';
      return quantity >= 100 ? '99+' : quantity.toString();
    },
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
  margin-bottom: 50px;
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
  position: relative;
}
.cart-link {
  display: block;
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: cover;
}
.header :deep(.burger) {
  display: none;
}
.menu-block {
  transition: transform 0.5s;
}
.goods-quantity-container {
  position: absolute;
  top: -26%;
  left: 91%;
  background-color: var(--main-color);
  width: fit-content;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
}
.goods-quantity {
  color: var(--dark-theme-font-color);
  text-decoration: none;
}

.slide-enter-active,
.slide-leave-active {
  transform: translateX(0%);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 1680px) {
  .header {
    height: 80px;
  }
  .cart-link {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 1280px) {
  .logo {
    width: 140px;
  }
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
  .goods-quantity-container {
    top: -25%;
    left: 98.5%;
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
}
@media (max-width: 700px) {
  .authorization-list,
  .divider {
    display: none;
  }
  .logo {
    width: 120px;
  }
  .goods-quantity-container {
    left: 98%;
  }
}
@media (max-width: 550px) {
  .goods-quantity-container {
    top: -35%;
    left: 96%;
  }
}
@media (max-width: 390px) {
  .goods-quantity-container {
    top: -30%;
    left: 94%;
  }
}
</style>
