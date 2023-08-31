<template>
  <ul class="breadcrumbs">
    <li>
      <RouterLink
        :to="{ name: 'Home' }"
        class="link">
        Home
      </RouterLink>
    </li>
    <template
      v-for="item in breadcrumbs"
      :key="item.name">
      <span class="divider">/</span>
      <li>
        <RouterLink
          :to="item.route"
          class="link">
          {{ item.name }}
        </RouterLink>
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
import type { Breadcrumb } from '@/types/types';

export default {
  computed: {
    breadcrumbs(): Breadcrumb[] {
      const path = this.$route.path.substring(1).split('/');
      return path.map((item, i) => ({
        route: `/${path.slice(0, i + 1).join('/')}`,
        name: `${item.charAt(0).toUpperCase()}${item.substring(1)}`,
      }));
    },
  },
};
</script>

<style scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.divider {
  margin: 0 5px;
  user-select: none;
}
.link {
  text-decoration: none;

  &:hover {
    color: var(--main-color);
  }
}
</style>
