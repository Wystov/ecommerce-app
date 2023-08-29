<template>
  <template v-if="loaded">
    <div class="links">
      <RouterLink
        v-for="category in categories.data"
        :key="category.id"
        :to="{ name: 'Category', params: { categorySlug: category.slug.en } }">
        {{ category.name.en }}
      </RouterLink>
    </div>
  </template>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia';
import { useFilterStore } from '@/stores/filter';
import api from '@/utils/api/client';

export default {
  computed: {
    ...mapState(useFilterStore, ['categories']),
    loaded(): boolean {
      return this.categories.data.length > 0;
    },
  },
  methods: {
    ...mapActions(useFilterStore, ['resetStore', 'setCategories', 'changeCategory']),
    async getCategories(): Promise<void> {
      if (this.loaded) return;
      const { body } = await api.call().categories().get().execute();
      this.setCategories(body.results);
      console.log(body.results);
    },
  },
  created(): void {
    this.getCategories();
  },
};
</script>

<style scoped>
.links {
  display: flex;
  flex-direction: column;
}
.router-link-exact-active {
  color: var(--main-color);
}
</style>
