<template>
  <div class="filter-container">
    <template v-if="loaded">
      <div class="brands">
        <span class="title">Brand <span class="count">{{ brands.length }}</span></span>
        <BaseCheckbox
          v-for="item in brands"
          @change="changeCheckFilterOptions('brand', item.term)"
          :key="item.term"
          :id="item.term"
          :label="item.term"
          name="brand"
          class="variant">
          <span class="weight-range">&nbsp;({{ item.count }})</span>
        </BaseCheckbox>
      </div>
      <div class="weight">
        <span class="title">Weight</span>
        <Slider
          v-model="weightRange"
          :min="minWeight"
          :max="maxWeight"
          :tooltipPosition="'bottom'"
          :step="0.1"
          :tooltips="false"
          :lazy="false"
          class="range-slider"
        />
        <span class="weight-range">{{ weightRange[0] }} - {{ weightRange[1] }} oz.</span>
        <BaseButton @click="changeRangeFilterOptions('weight', weightRange, 'build')" size="small">Apply</BaseButton>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import Slider from '@vueform/slider';
import { useFilterStore } from '@/stores/filter';
import type { FacetTerm } from '@/types/types';
import BaseCheckbox from './shared/BaseCheckbox.vue';
import BaseButton from './shared/BaseButton.vue';
import '@vueform/slider/themes/default.css';

export default {
  components: {
    BaseCheckbox,
    BaseButton,
    Slider,
  },
  data(): { weightRange: [number, number]; } {
    return {
      weightRange: [0, 0],
    };
  },
  computed: {
    ...mapState(useFilterStore, ['filterOptions', 'loaded']),
    brands(): FacetTerm[] {
      return this.filterOptions.brand.terms;
    },
    minWeight(): number {
      return parseFloat(this.filterOptions.weight.terms[0].term);
    },
    maxWeight(): number {
      const i = this.filterOptions.weight.terms.length - 1;
      return parseFloat(this.filterOptions.weight.terms[i].term);
    },
  },
  methods: {
    ...mapActions(useFilterStore, ['changeCheckFilterOptions', 'changeRangeFilterOptions']),
  },
  created(): void {
    if (this.loaded) this.weightRange = [this.minWeight, this.maxWeight];
    this.$watch(
      () => this.loaded,
      () => {
        this.weightRange = [this.minWeight, this.maxWeight];
        this.changeRangeFilterOptions('weight', this.weightRange);
      },
    );
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
  padding-top: 1rem;
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
.weight {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.range-slider {
  --slider-connect-bg: var(--main-color);
  --slider-handle-ring-color: transparent;
}
.weight-range {
  display: block;
}
</style>
