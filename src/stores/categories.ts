import { defineStore } from 'pinia';
import type { Category } from '@commercetools/platform-sdk';
import api from '@/utils/api/client';
import { useFilterStore } from './filter';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: {
      data: [] as Category[],
      current: undefined as string | undefined,
    },
  }),
  getters: {
    categoriesLoaded: (state) => state.categories.data.length > 0,
  },
  actions: {
    async getCategories(): Promise<void> {
      const { body } = await api.call().categories().get().execute();
      this.categories.data = body.results;
    },
    changeCategory(category: string): void {
      const filter = useFilterStore();
      filter.resetStore();
      this.categories.current = category;
      filter.buildFilterOptions();
    },
    currentCategoryId() {
      const category = this.categories.data
        .find((item) => item.slug.en === this.categories.current);
      return category?.id;
    },
  },
});
