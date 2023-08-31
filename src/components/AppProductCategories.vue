<template>
  <template v-if="categoriesLoaded">
    <span class="title">Categories</span>
    <nav class="links">
      <ul class="categories">
        <li class="category-item">
          <RouterLink
            :to="{ name: 'Catalog' }"
            class="category-link">
            All
          </RouterLink>
        </li>
        <template
          v-for="category in filteredCategories"
          :key="category.id">
          <li class="category-item">
            <RouterLink
              :to="{ name: category.routerName, params: category.params }"
              class="category-link">
              {{ category.name }}
            </RouterLink>
          </li>
          <ul
            v-if="category.children.length"
            class="subcategories">
            <li
              v-for="child in category.children"
              :key="child.id"
              class="subcategory-item">
              <RouterLink
                :to="{ name: child.routerName, params: child.params }"
                class="subcategory-link">
                {{ child.name }}
              </RouterLink>
            </li>
          </ul>
        </template>
      </ul>
    </nav>
  </template>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia';
import { useCategoriesStore } from '@/stores/categories';
import type { CategoryMap } from '@/types/types';

export default {
  computed: {
    ...mapState(useCategoriesStore, ['categories', 'categoriesLoaded', 'mappedCategories']),
    filteredCategories(): CategoryMap[] | null {
      return this.mappedCategories?.filter((cat) => !cat.parentId) ?? null;
    },
  },
  methods: {
    ...mapActions(useCategoriesStore, ['changeCategory']),
  },
};
</script>

<style scoped>
.title {
  display: block;
  font-weight: 600;
  padding-bottom: 1rem;
  padding-top: 1rem;
}
.links {
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 0.5rem;
}
.categories,
.subcategories {
  padding-left: 1rem;
}
.category-item,
.subcategory-item {
  padding-bottom: 0.3rem;
}
.category-item {
  list-style-type: disc;
}
.subcategory-item {
  list-style-type: circle;
}
.category-link,
.subcategory-link {
  text-decoration: none;
}
.router-link-exact-active {
  color: var(--main-color);
}
</style>
