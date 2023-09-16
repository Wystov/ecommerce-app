<template>
  <Transition mode="out-in">
    <div
      v-if="fetching"
      class="spinner-container">
      <div class="spinner" />
    </div>
    <template v-else>
      <AppCart />
    </template>
  </Transition>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia';
import { useCartStore } from '@/stores/cart';
import AppCart from '@/components/AppCart.vue';

export default {
  components: {
    AppCart,
  },
  computed: {
    ...mapState(useCartStore, ['fetching', 'cartVersion']),
  },
  methods: {
    ...mapActions(useCartStore, ['initializationCart']),
  },
  created(): void {
    if (!this.cartVersion) this.initializationCart();
  },
};
</script>
