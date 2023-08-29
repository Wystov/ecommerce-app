import { defineStore } from 'pinia';
import type { Category } from '@commercetools/platform-sdk';
import type {
  SortBy, FilterOptions, FacetResults, Filter,
} from '@/types/types';
import api from '@/utils/api/client';

export const useFilterStore = defineStore('filter', {
  state: () => ({
    loaded: false,
    sort: 'name.en asc' as SortBy,
    categories: {
      data: [] as Category[],
      current: undefined as string | undefined,
    },
    facet: ['variants.attributes.weight', 'variants.attributes.brand', 'variants.price.centAmount'],
    filter: undefined as string[] | undefined,
    filterOptions: {
      brand: {
        key: 'variants.attributes.brand',
        selected: new Set(),
      },
      weight: {
        key: 'variants.attributes.weight',
        selected: [0, 0],
      },
      price: {
        key: 'variants.price.centAmount',
        selected: [0, 0],
      },
    } as FilterOptions,
  }),
  getters: {
    queryArgs: (state) => ({
      sort: state.sort,
      facet: state.facet,
      filter: state.filter,
    }),
    categoriesLoaded: (state) => state.categories.data.length > 0,
  },
  actions: {
    setSort(sort: SortBy) {
      this.sort = sort;
    },
    setFilterOptions(options: FacetResults) {
      if (this.loaded) return;
      Object.keys(this.filterOptions).forEach((option) => {
        const filterKey = this.filterOptions[option as keyof FilterOptions].key;
        const filter = options[filterKey];
        filter.terms.sort((a, b) => ((option === 'brand')
          ? a.term.localeCompare(b.term)
          : parseFloat(a.term) - parseFloat(b.term)));
        Object.assign(this.filterOptions[option as keyof FilterOptions], filter);
      });
      this.loaded = true;
    },
    buildFilterOptions() {
      const activeFilters = Object.entries(this.filterOptions)
        .filter(([, { selected }]) => (selected instanceof Set
          ? selected.size > 0
          : Array.isArray(selected) && selected.some((num) => num !== 0)))
        .map(([key, { selected }]) => {
          const filterValue = selected instanceof Array
            ? `range (${selected[0]} to ${selected[1]})`
            : [...selected].map((option) => `"${option}"`).join(', ');
          const queryPath = key === 'price' ? 'price.centAmount' : `attributes.${key}`;
          return `variants.${queryPath}:${filterValue}`;
        });
      const categoryId = this.currentCategoryId();
      if (categoryId) {
        activeFilters.push(`categories.id: subtree("${categoryId}")`);
      }
      this.filter = activeFilters.length ? activeFilters : undefined;
    },
    changeCheckFilterOptions(name: Filter, key: string) {
      const { selected } = this.filterOptions[name];
      if (!(selected instanceof Set)) return;
      selected.has(key) ? selected.delete(key) : selected.add(key);
      if (this.loaded) this.buildFilterOptions();
    },
    changeRangeFilterOptions(name: Filter, range: [number, number], build?: 'build') {
      this.filterOptions[name].selected = range;
      if (build) this.buildFilterOptions();
    },
    resetStore(): void {
      const { sort } = this;
      this.$reset();
      this.sort = sort;
    },
    setCategories(categories: Category[]): void {
      this.categories.data = categories;
    },
    changeCategory(category: string): void {
      const categoriesData = this.categories.data;
      this.resetStore();
      this.categories.data = categoriesData;
      this.categories.current = category;
      this.buildFilterOptions();
    },
    currentCategoryId() {
      const category = this.categories.data
        .find((item) => item.slug.en === this.categories.current);
      return category?.id;
    },
    async getCategories(): Promise<void> {
      const { body } = await api.call().categories().get().execute();
      this.categories.data = body.results;
      console.log('categories', body.results);
    },
  },
});
