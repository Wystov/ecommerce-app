<template>
  <div
    v-if="mappedAppliedFilters?.length"
    class="applied-filters">
    <span class="filter-title">Applied filters</span>
    <ul
      v-for="filter in mappedAppliedFilters"
      :key="filter">
      <li class="filter-list-item">{{ filter }}</li>
    </ul>
    <button
      @click="reset"
      class="button-reset"
      type="button">
      Reset filters
    </button>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useFilterStore } from '@/stores/filter';
import { useUserStore } from '@/stores/user';

export default {
  computed: {
    ...mapState(useFilterStore, ['loaded', 'appliedFilters', 'minWeight', 'maxWeight', 'minPrice', 'maxPrice']),
    ...mapState(useUserStore, ['currencyTag']),
    mappedAppliedFilters(): string[] {
      if (!this.loaded) return [];
      const filters = [];
      const { search, brand, price, weight } = this.appliedFilters;
      if (search?.length) filters.push(`Search: ${search}`);
      if (brand?.length) filters.push(`Brand: ${brand.join(', ')}`);
      if (Array.isArray(price) && (price[0] !== this.minPrice || price[1] !== this.maxPrice)) {
        const priceStr = price
          .map((p) => `${this.currencyTag}${(+p / 100).toFixed(2)}`)
          .join(' - ');
        filters.push(`Price: ${priceStr}`);
      }
      if (Array.isArray(weight) && (weight[0] !== this.minWeight || weight[1] !== this.maxWeight)) {
        const weightStr = weight.map((w) => `${w} oz.`).join(' - ');
        filters.push(`Weight: ${weightStr}`);
      }
      return filters;
    },
  },
  methods: {
    ...mapActions(useFilterStore, ['resetStore', 'refreshFilter']),
    reset(): void {
      this.resetStore();
      this.refreshFilter();
    },
  },
};
</script>

<style scoped>
.filter-title {
  display: block;
  font-weight: 600;
  padding-bottom: 1rem;
  padding-top: 1rem;
}
.button-reset {
  cursor: pointer;
  max-width: fit-content;
  font-size: 1rem;
  margin-top: 1rem;
  background-color: transparent;
  padding: 0;
  color: var(--main-color);
  border: none;
}
.applied-filters {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9e9e9;
}
.filter-list-item {
  padding-bottom: 0.5rem;
}
</style>
