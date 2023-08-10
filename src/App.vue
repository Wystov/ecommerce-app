<script lang="ts">
import './assets/styles/global.css';
import BaseHeader from '@/components/BaseHeader.vue';

export default {
  components: {
    BaseHeader,
  },
};
</script>

<template>
  <BaseHeader />
  <RouterView />
</template>
