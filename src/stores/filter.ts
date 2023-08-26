import { defineStore } from 'pinia';
import type {
  SortBy, FilterOptions, FacetResults, Filter,
} from '@/types/types';

export const useFilterStore = defineStore('filter', {
  state: () => ({
    loaded: false,
    sort: 'name.en asc' as SortBy,
    facet: ['variants.attributes.weight', 'variants.attributes.brand', 'variants.price.centAmount'],
    filter: undefined as string[] | undefined,
    filterOptions: {
      brand: {},
      weight: {},
      price: {},
    } as FilterOptions,
  }),
  getters: {
    queryArgs: (state) => ({
      sort: state.sort,
      facet: state.facet,
      filter: state.filter,
    }),
  },
  actions: {
    setSort(sort: SortBy) {
      this.sort = sort;
    },
    setFilterOptions(options: FacetResults) {
      if (this.loaded) return;
      this.loaded = true;
      const brands = options['variants.attributes.brand'];
      brands.terms.sort((a, b) => a.term.localeCompare(b.term));
      this.filterOptions.brand = brands;
      this.filterOptions.weight = options['variants.attributes.weight'];
      this.filterOptions.price = options['variants.price.centAmount'];
      Object.keys(this.filterOptions).forEach((key) => {
        this.filterOptions[key as Filter].selected = new Set();
      });
    },
    buildFilterOptions() {
      const activeFilters = Object.entries(this.filterOptions)
        .filter(([, options]) => options.selected.size)
        .map(([key, options]) => {
          const filterValue = [...options.selected]
            .map((option) => `"${option}"`)
            .join(', ');
          return `variants.attributes.${key}: ${filterValue}`;
        });
      this.filter = activeFilters.length ? activeFilters : undefined;
    },
    changeFilterOptions(name: Filter, key: string) {
      const { selected } = this.filterOptions[name];
      selected.has(key) ? selected.delete(key) : selected.add(key);
      this.buildFilterOptions();
    },
  },
});
