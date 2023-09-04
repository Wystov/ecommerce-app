<template>
  <Transition name="slide">
    <div class="filter-container">
      <AppProductCategories />
      <Transition mode="out-in">
        <div v-if="loaded">
          <div class="search">
            <span class="filter-title">{{ searchTitle }}</span>
            <div class="search-container">
              <BaseInput
                id="search"
                ref="searchInput"
                width="75%"
                @keyup.enter="setSearch" />
              <BaseButton
                size="small"
                class="search-btn"
                @click="setSearch">
                <MagnifyingGlassIcon class="icon" />
              </BaseButton>
            </div>
          </div>
          <div class="checkbox-filter">
            <span class="filter-title">
              Brand<span class="count">{{ brands.length }}</span>
            </span>
            <BaseCheckbox
              v-for="item in brands"
              :id="item.term"
              :key="item.term"
              :label="item.term"
              :checked="isBrandChecked(item.term)"
              name="brand"
              class="variant"
              @change="changeCheckFilterOptions('brand', item.term)">
              <span class="weight-range">&nbsp;({{ item.count }})</span>
            </BaseCheckbox>
          </div>
          <div class="range-filter">
            <span class="filter-title">Price</span>
            <Slider
              v-model="priceRange"
              :min="minPrice"
              :max="maxPrice"
              :step="1"
              :tooltips="false"
              :lazy="false"
              class="range-slider" />
            <span class="nums-range">
              {{ priceRangeReadable }}
            </span>
            <BaseButton
              size="small"
              @click="changeRangeFilterOptions('price', priceRange, 'build')">
              Apply
            </BaseButton>
          </div>
          <div class="range-filter">
            <span class="filter-title">Weight</span>
            <Slider
              v-model="weightRange"
              :min="minWeight"
              :max="maxWeight"
              :step="0.1"
              :tooltips="false"
              :lazy="false"
              class="range-slider" />
            <span class="nums-range">{{ weightRangeReadable }}</span>
            <BaseButton
              class="button"
              size="small"
              @click="changeRangeFilterOptions('weight', weightRange, 'build')">
              Apply
            </BaseButton>
          </div>
        </div>
        <div
          v-else
          class="spinner-container">
          <div class="spinner" />
        </div>
      </Transition>
      <AppProductAppliedFiltersList />
    </div>
  </Transition>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import Slider from '@vueform/slider';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import { useFilterStore } from '@/stores/filter';
import { useUserStore } from '@/stores/user';
import type { BaseInputType, FacetTerm, ProductFilterType } from '@/types/types';
import BaseCheckbox from './shared/BaseCheckbox.vue';
import BaseButton from './shared/BaseButton.vue';
import '@vueform/slider/themes/default.css';
import AppProductCategories from './AppProductCategories.vue';
import BaseInput from './shared/BaseInput.vue';
import AppProductAppliedFiltersList from './AppProductAppliedFiltersList.vue';

export default {
  components: {
    BaseCheckbox,
    BaseButton,
    Slider,
    AppProductCategories,
    BaseInput,
    AppProductAppliedFiltersList,
    MagnifyingGlassIcon,
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
    ...mapState(useFilterStore, [
      'filterOptions',
      'loaded',
      'minWeight',
      'maxWeight',
      'minPrice',
      'maxPrice',
    ]),
    ...mapState(useUserStore, ['currencyTag']),
    brands(): FacetTerm[] {
      return this.filterOptions.brand.terms;
    },
    priceRangeReadable(): string {
      return `${this.currencyTag}${(this.priceRange[0] / 100).toFixed(2)} - ${this.currencyTag}${(
        this.priceRange[1] / 100
      ).toFixed(2)}`;
    },
    weightRangeReadable(): string {
      return `${this.weightRange[0]} oz. - ${this.weightRange[1]} oz.`;
    },
  },
  methods: {
    ...mapActions(useFilterStore, [
      'changeCheckFilterOptions',
      'changeRangeFilterOptions',
      'resetStore',
      'refreshFilter',
      'changeSearch',
    ]),
    isBrandChecked(brand: string): boolean {
      const { selected } = this.filterOptions.brand;
      if (selected instanceof Set) {
        return selected.has(brand);
      }
      return false;
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
  position: relative;
  flex-shrink: 0;
  width: 200px;
  border-top: 1px solid #e9e9e9;
  padding-right: 1rem;
  margin-top: -1px;
  background-color: white;
  transition: 0.6s;
}
@media (max-width: 800px) {
  .filter-container {
    position: absolute;
    height: fit-content;
    width: 81.5vw;
    border-bottom: 1px solid #e9e9e9;
    margin-left: -1px;
    z-index: 10;
  }
}
.filter-title {
  display: block;
  font-weight: 600;
  padding-bottom: 1rem;
  padding-top: 1rem;
}
.count {
  color: #a6a5a5;
  margin-left: 0.5rem;
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
.slide-enter-active {
  transition: all 0.3s;
}

.slide-leave-active {
  transition: all 0.8s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100vw);
}
.spinner-container {
  place-items: start center;
  padding-top: 50px;
}
.icon {
  height: 1.8rem;
  fill: white;
}
</style>
