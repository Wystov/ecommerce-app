import { defineStore } from 'pinia';
import type { SortBy } from '@/types/types';

export const useFilterStore = defineStore('filter', {
  state: () => ({
    sort: 'name.en asc' as SortBy,
  }),
  getters: {
    queryArgs: (state) => ({
      sort: state.sort,
    }),
  },
  actions: {
    setSort(sort: SortBy) {
      this.sort = sort;
    },
  },
});
