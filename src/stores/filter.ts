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
          : Array.isArray(selected) && selected.length > 0))
        .map(([key, { selected }]) => {
          const filterValue = selected instanceof Array
            ? `range (${selected[0]} to ${selected[1]})`
            : [...selected].map((option) => `"${option}"`).join(', ');
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
