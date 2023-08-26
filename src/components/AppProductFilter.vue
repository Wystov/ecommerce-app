<template>
  <div class="filter-container">
    <template v-if="loaded">
      <div class="brands">
        <span class="title">Brands <span class="count">{{ getBrands.length }}</span></span>
        <BaseCheckbox
          v-for="item in getBrands"
          @change="changeFilterOptions('brand', item.term)"
          :key="item.term"
          :id="item.term"
          :label="item.term"
          name="brand"
          class="variant">
          <span class="count">&nbsp;({{ item.count }})</span>
        </BaseCheckbox>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useFilterStore } from '@/stores/filter';
import type { FacetTerm } from '@/types/types';
import BaseCheckbox from './shared/BaseCheckbox.vue';

export default {
  components: {
    BaseCheckbox,
  },
  computed: {
    ...mapState(useFilterStore, ['filterOptions', 'loaded']),
    getBrands(): FacetTerm[] {
      return this.filterOptions.brand.terms;
    },
  },
  methods: {
    ...mapActions(useFilterStore, ['changeFilterOptions']),
  },
};
</script>

<style scoped>
.filter-container {
  min-height: 100vh;
  width: 250px;
  border-right: 1px solid #e9e9e9;
  padding-right: 1rem;
}
.title {
  display: block;
  font-weight: 600;
  padding-bottom: 1rem;
}
.count {
  color: #a6a5a5;
}
.variant {
  padding-bottom: 0.5rem;
}
.brands {
  border-bottom: 1px solid #e9e9e9;
}
</style>
