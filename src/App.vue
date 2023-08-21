<script lang="ts">
import './assets/styles/style.css';
import { mapActions } from 'pinia';
import { useUserStore } from '@/stores/user';
import AppHeader from '@/components/AppHeader.vue';

export default {
  components: {
    AppHeader,
  },
  methods: {
    ...mapActions(useUserStore, ['init']),
  },
  created(): void {
    this.init();
  },
};
</script>

<template>
  <AppHeader />
  <RouterView />
</template>
