<script lang="ts">
import './assets/styles/style.css';
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import AppHeader from '@/components/AppHeader.vue';
import api from '@/utils/api/client';

export default {
  components: {
    AppHeader,
  },
  computed: {
    ...mapStores(useUserStore),
  },
  created(): void {
    api.call().me().get().execute()
      .then((response) => {
        if (response.statusCode === 200) this.userStore.loginUser();
      })
      .catch((error) => {
        if (error.statusCode === 403) this.userStore.logoutUser();
      });
  },
};
</script>

<template>
  <AppHeader />
  <RouterView />
</template>
