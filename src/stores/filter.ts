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
      brands.selected = new Set();
      this.filterOptions.brand = brands;
      const weight = options['variants.attributes.weight'];
      weight.terms.sort((a, b) => parseFloat(a.term) - parseFloat(b.term));
      weight.selected = [0, 0];
      this.filterOptions.weight = weight;
      const price = options['variants.price.centAmount'];
      price.terms.sort((a, b) => parseFloat(a.term) - parseFloat(b.term));
      price.selected = [0, 0];
      this.filterOptions.price = price;
    },
    buildFilterOptions() {
      const activeFilters = Object.entries(this.filterOptions)
        .filter(([, options]) => {
          const { selected } = options;
          return selected instanceof Set
            ? selected.size > 0
            : Array.isArray(selected) && selected.length > 0;
        })
        .map(([key, options]) => {
          const filterValue = options.selected instanceof Array
            ? `range (${options.selected[0]} to ${options.selected[1]})`
            : [...options.selected].map((option) => `"${option}"`).join(', ');
          const queryPath = key === 'price' ? 'price.centAmount' : `attributes.${key}`;
          return `variants.${queryPath}:${filterValue}`;
        });
      this.filter = activeFilters.length ? activeFilters : undefined;
    },
    changeCheckFilterOptions(name: Filter, key: string) {
      const { selected } = this.filterOptions[name];
      if (!(selected instanceof Set)) return;
      selected.has(key) ? selected.delete(key) : selected.add(key);
      this.buildFilterOptions();
    },
    changeRangeFilterOptions(name: Filter, range: [number, number], build?: 'build') {
      this.filterOptions[name].selected = range;
      if (build) this.buildFilterOptions();
    },
  },
});
