<template>
  <AppHeader />
  <RouterView />
  <AppFooter />
</template>

<script lang="ts">
import './assets/styles/style.css';
import { mapActions, mapState } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useCartStore } from '@/stores/cart';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  computed: {
    ...mapState(useCartStore, ['fetching', 'cartVersion']),
  },
  methods: {
    ...mapActions(useUserStore, ['init']),
    ...mapActions(useCartStore, ['initializationCart']),
  },
  created(): void {
    this.init();
    if (!this.cartVersion) this.initializationCart();
  },
};
</script>
