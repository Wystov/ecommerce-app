<template>
  <AppLogin />
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
      this.$watch(() => this.userStore.fetching, () => {
        if (this.userStore.authorized) this.$router.push({ name: 'Home' });
      });
    }
  },
};
</script>
