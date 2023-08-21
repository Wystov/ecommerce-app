<template>
  <nav class="menu">
    <ul class="menu-list">
      <div v-for="(item, i) in updateAuthorizationList" :key="i">
        <li class="menu-item" @click="openMenu()" @keydown="openMenu()">
          <RouterLink :to="{ name: item.name }" class="menu-link">
            {{ item.name }}
          </RouterLink>
        </li>
      </div>
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
    open: {
      type: Boolean,
      default: false,
    },
    openMenu: {
      type: Function,
      required: true,
    },
  },
  data(): DataAuthorization {
    const {
      Home, Catalog, AboutUs, Login, Registration, Account,
    } = NamePages;
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
        (link) => this.userStore.authorized === link.authorization
        || link.authorization === undefined,
      );
    },
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
