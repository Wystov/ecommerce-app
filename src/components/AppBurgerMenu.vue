<template>
  <nav
    ref="burger"
    class="menu">
    <ul class="menu-list">
      <li
        v-for="(item, i) in updateAuthorizationList"
        :key="i"
        class="menu-item">
        <RouterLink
          :to="{ name: item.name }"
          class="menu-link"
          @click="$emit('close-menu')">
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import { NamePages } from '@/types/enums';
import type { AuthorizationList, DataAuthorization } from '@/types/types';

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close-menu'],
  data(): DataAuthorization {
    const { Home, Catalog, AboutUs, Login, Registration, Account } = NamePages;
    return {
      authorizationList: [
        {
          name: Home,
        },
        {
          name: Catalog,
        },
        {
          name: AboutUs,
        },
        {
          name: Registration,
          authorization: false,
        },
        {
          name: Login,
          authorization: false,
        },
        {
          name: Account,
          authorization: true,
        },
      ],
    };
  },
  computed: {
    ...mapStores(useUserStore),
    updateAuthorizationList(): AuthorizationList[] {
      return this.authorizationList.filter(
        (link) =>
          this.userStore.authorized === link.authorization || link.authorization === undefined,
      );
    },
  },
  methods: {
    handleBurgerClick(e: MouseEvent): void {
      const burger = this.$refs.burger as HTMLElement;
      if (e.target instanceof HTMLElement && this.isOpen && !burger.contains(e.target)) {
        this.$emit('close-menu');
      }
    },
  },
  created(): void {
    document.addEventListener('click', this.handleBurgerClick);
  },
};
</script>

<style scoped>
.menu {
  display: none;
  position: absolute;
  right: 0;
  background-color: #ffffff;
  width: 400px;
  height: 100vh;
}
.menu-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 30px 0 0 30px;
  gap: 25px;
}
.menu-link {
  color: var(--main-font-color);
  font-size: 1.5rem;
  text-decoration: none;
  text-transform: uppercase;
  transition: 0.3s;

  &:hover {
    color: var(--main-color);
  }

  &:active {
    opacity: 0.5;
  }
}
.router-link-exact-active {
  color: var(--main-color);
}
@media (max-width: 900px) {
  .menu {
    display: block;
  }
}
@media (max-width: 400px) {
  .menu {
    width: 100vw;
  }
}
</style>
