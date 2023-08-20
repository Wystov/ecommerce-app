<template>
  <nav class="menu">
    <ul class="menu-list">
      <div v-for="(name, i) in navigation" :key="i">
        <li class="menu-item">
          <RouterLink :to="{ name: name }" class="menu-link">
            {{ name }}
          </RouterLink>
        </li>
      </div>
    </ul>
  </nav>
</template>

<script lang="ts">
import { NamePages } from '@/types/enums';

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data(): { navigation: NamePages[] } {
    const {
      Home, Catalog, AboutUs, Login, Registration,
    } = NamePages;
    return { navigation: [Home, Catalog, AboutUs, Login, Registration] };
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