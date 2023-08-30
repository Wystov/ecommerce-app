import { defineStore } from 'pinia';
import type { Category } from '@commercetools/platform-sdk';
import api from '@/utils/api/client';
import type { CategoryMap } from '@/types/types';
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
    mappedCategories(): CategoryMap[] | null {
      if (!this.categoriesLoaded) return null;
      console.log(this.categories.data);
      const categories: CategoryMap[] = this.categories.data.map((category) => ({
        name: category.name.en,
        id: category.id,
        parentId: category.parent?.id ?? null,
        params: { categorySlug: category.slug.en },
        routerName: 'Category',
        children: [],
      }));
      categories.forEach((item) => {
        const category = item;
        const parent = categories.find((c) => c.id === category.parentId);
        if (parent) {
          category.params.subcategorySlug = category.params.categorySlug;
          category.params.categorySlug = parent.params.categorySlug;
          category.routerName = 'Subcategory';
          parent.children.push(category);
        }
      });
      return categories;
    },
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
