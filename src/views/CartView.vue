<template>
  <Transition mode="out-in">
    <div
      v-if="fetching && !cartVersion"
      class="spinner-container">
      <div class="spinner" />
    </div>
    <template v-else>
      <AppCart />
    </template>
  </Transition>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useCartStore } from '@/stores/cart';
import AppCart from '@/components/AppCart.vue';

export default {
  components: {
    AppCart,
  },
  computed: {
    ...mapState(useCartStore, ['fetching', 'cartVersion']),
  },
};
</script>
