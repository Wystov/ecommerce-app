<template>
  <div class="filter-container">
    <AppProductCategories />
    <button
      @click="reset"
      class="button-reset"
      type="button"
    >Reset filters</button>
    <template v-if="loaded">
      <div class="search">
        <span class="title">{{ searchTitle }}</span>
        <div class="search-container">
          <BaseInput @keyup.enter="setSearch" id="search" ref="searchInput" width="75%" />
          <BaseButton size="small" @click="setSearch" class="search-btn">&#x1F50D;&#xFE0E;</BaseButton>
        </div>
      </div>
      <div class="checkbox-filter">
        <span class="title">Brand <span class="count">{{ brands.length }}</span></span>
        <BaseCheckbox
          v-for="item in brands"
          @change="changeCheckFilterOptions('brand', item.term)"
          :key="item.term"
          :id="item.term"
          :label="item.term"
          :checked="isBrandChecked(item.term)"
          name="brand"
          class="variant">
          <span class="weight-range">&nbsp;({{ item.count }})</span>
        </BaseCheckbox>
      </div>
      <div class="range-filter">
        <span class="title">Price</span>
        <Slider
          v-model="priceRange"
          :min="minPrice"
          :max="maxPrice"
          :step="1"
          :tooltips="false"
          :lazy="false"
          class="range-slider"
        />
        <span class="nums-range">
          {{ currencyTag }}{{ priceRange[0] / 100 }} - {{ currencyTag }}{{ priceRange[1] / 100 }}
        </span>
        <BaseButton @click="changeRangeFilterOptions('price', priceRange, 'build')" size="small">Apply</BaseButton>
      </div>
      <div class="range-filter">
        <span class="title">Weight</span>
        <Slider
          v-model="weightRange"
          :min="minWeight"
          :max="maxWeight"
          :step="0.1"
          :tooltips="false"
          :lazy="false"
          class="range-slider"
        />
        <span class="nums-range">
          {{ weightRange[0] }} oz. - {{ weightRange[1] }} oz.
        </span>
        <BaseButton
          @click="changeRangeFilterOptions('weight', weightRange, 'build')"
          class="button"
          size="small">
          Apply
        </BaseButton>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import Slider from '@vueform/slider';
import { useFilterStore } from '@/stores/filter';
import { useUserStore } from '@/stores/user';
import type { BaseInputType, FacetTerm, ProductFilterType } from '@/types/types';
import BaseCheckbox from './shared/BaseCheckbox.vue';
import BaseButton from './shared/BaseButton.vue';
import '@vueform/slider/themes/default.css';
import AppProductCategories from './AppProductCategories.vue';
import BaseInput from './shared/BaseInput.vue';

export default {
  components: {
    BaseCheckbox,
    BaseButton,
    Slider,
    AppProductCategories,
    BaseInput,
  },
  data(): ProductFilterType {
    return {
      weightRange: [0, 0],
      priceRange: [0, 0],
      searchValue: '',
      searchTitle: '',
    };
  },
  computed: {
    ...mapState(useFilterStore, ['filterOptions', 'loaded']),
    ...mapState(useUserStore, ['currency']),
    brands(): FacetTerm[] {
      return this.filterOptions.brand.terms;
    },
    minWeight(): number {
      return parseFloat(this.filterOptions.weight.terms[0]?.term ?? 0);
    },
    maxWeight(): number {
      const i = this.filterOptions.weight.terms.length - 1;
      return parseFloat(this.filterOptions.weight.terms[i]?.term ?? 0);
    },
    minPrice(): number {
      return parseFloat(this.filterOptions.price.terms[0]?.term ?? 0);
    },
    maxPrice(): number {
      const i = this.filterOptions.price.terms.length - 1;
      return parseFloat(this.filterOptions.price.terms[i]?.term ?? 0);
    },
    currencyTag(): string {
      return this.currency === 'USD' ? '$' : '£';
    },
  },
  methods: {
    ...mapActions(useFilterStore, ['changeCheckFilterOptions', 'changeRangeFilterOptions', 'resetStore', 'refreshFilter', 'changeSearch']),
    isBrandChecked(brand: string): boolean {
      const { selected } = this.filterOptions.brand;
      if (selected instanceof Set) {
        return selected.has(brand);
      }
      return false;
    },
    reset(): void {
      this.resetStore();
      this.refreshFilter();
    },
    setSearch(): void {
      const value = (this.$refs.searchInput as BaseInputType).inputValue.trim().toLowerCase();
      if (value.length) this.changeSearch(value);
    },
    setSearchCategoryName(): void {
      const category = this.$route.path.split('/').at(-1);
      this.searchTitle = `Search in ${category}`;
    },
    setRangeOptions(): void {
      if (!this.loaded) return;
      this.weightRange = [this.minWeight, this.maxWeight];
      this.priceRange = [this.minPrice, this.maxPrice];
      this.changeRangeFilterOptions('weight', this.weightRange);
      this.changeRangeFilterOptions('price', this.priceRange);
    },
    setSavedRangeOptions(): void {
      if (!this.loaded) return;
      this.weightRange = this.filterOptions.weight.selected as [number, number];
      this.priceRange = this.filterOptions.price.selected as [number, number];
    },
  },
  created(): void {
    this.setSearchCategoryName();
    this.setSavedRangeOptions();
    this.$watch(
      () => this.loaded,
      () => {
        this.setRangeOptions();
        this.setSearchCategoryName();
      },
    );
  },
};
</script>

<style scoped>
.filter-container {
  width: 200px;
  border-top: 1px solid #e9e9e9;
  padding-right: 1rem;
  margin-top: -1px;
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
.checkbox-filter {
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 0.5rem;
}
.range-filter {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9e9e9;
}
.range-slider {
  --slider-connect-bg: var(--main-color);
  --slider-handle-ring-color: transparent;
  padding: 0 0.5rem;
}
.nums-range {
  display: block;
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
.search-container {
  display: flex;
  gap: 0.5rem;
}
.search {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9e9e9;
}
.search-btn {
  font-size: 1.5rem;
  padding: 0.25rem 0.5rem;
  min-width: 0;
}
</style>
