<template>
  <AppHeader />
  <RouterView />
  <AppFooter />
</template>

<script lang="ts">
import './assets/styles/style.css';
import { mapActions } from 'pinia';
import { useUserStore } from '@/stores/user';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  methods: {
    ...mapActions(useUserStore, ['init']),
  },
  created(): void {
    this.init();
  },
};
</script>
