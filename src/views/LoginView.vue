<template>
  <div v-if="userStore.fetching" class="spinner-container">
    <div class="spinner" />
  </div>
  <AppLogin class="wrapper" v-else />
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import AppLogin from '@/components/AppLoginForm.vue';

export default {
  components: {
    AppLogin,
  },
  computed: {
    ...mapStores(useUserStore),
  },
  created(): void {
    if (this.userStore.fetching) {
      this.$watch(
        () => this.userStore.fetching,
        () => {
          if (this.userStore.authorized) this.$router.push({ name: 'Home' });
        },
      );
    }
  },
};
</script>

<style scoped>
.spinner-container {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
.spinner {
  border-top-color: var(--main-color);
}
</style>
