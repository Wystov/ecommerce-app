<template>
  <nav class="navigation">
    <ul class="navigation-list">
      <template v-for="(page, i) in navigation" :key="i">
        <li class="navigation-item">
          <RouterLink :to="{ name: page }" class="navigation-link">
            {{ page }}
          </RouterLink>
        </li>
        <li class="decoration-item" v-if="i < navigation.length - 1">
          <img :src="decoration" class="decoration-svg" alt="decoration" />
        </li>
      </template>
    </ul>
  </nav>
</template>

<script lang="ts">
import decoration from '@/assets/icons/round.svg';
import { NamePages } from '@/types/enums';

export default {
  data(): { navigation: NamePages[]; decoration: string } {
    const { Home, Catalog, AboutUs } = NamePages;
    return { navigation: [Home, Catalog, AboutUs], decoration };
  },
};
</script>

<style scoped>
.navigation {
  justify-self: center;
}
.navigation-list {
  display: flex;
  align-items: center;
  gap: 25px;
}
.navigation-link {
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

@media (max-width: 1680px) {
  .navigation-link {
    font-size: 1.2rem;
  }
}

@media (max-width: 1280px) {
  .navigation-link {
    font-size: 1rem;
  }
  .navigation-list {
    gap: 12px;
  }
}
</style>
