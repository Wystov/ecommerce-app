<template>
  <BaseSelect
    id="sortBy"
    label="Sort by:"
    :options="sortOptions"
    :defaultSelected="sort"
    :isPlain="true"
    class="sort-select"
    @selectOption="setSort" />
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useFilterStore } from '@/stores/filter';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import type { SelectOptions } from '@/types/types';

export default {
  components: {
    BaseSelect,
  },
  data: (): { sortOptions: SelectOptions[] } => ({
    sortOptions: [
      {
        text: 'Price ↓',
        value: 'price asc',
      },
      {
        text: 'Price ↑',
        value: 'price desc',
      },
      {
        text: 'Name',
        value: 'name.en asc',
      },
    ],
  }),
  computed: {
    ...mapState(useFilterStore, ['sort']),
  },
  methods: {
    ...mapActions(useFilterStore, ['setSort']),
  },
};
</script>

<style scoped>
.sort-select {
  flex-direction: row;
  align-items: center;
  gap: 0;
}
:deep(.select) {
  padding-left: 0.8rem;
  padding-right: 1.6rem;
}
</style>
