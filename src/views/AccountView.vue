<template>
  <div class="wrapper center">
    <h1>Account</h1>
    <BaseButton @click="logOut" label="Log out" />
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import BaseButton from '@/components/shared/BaseButton.vue';
import { LocalStorageKeys } from '@/types/enums';
import api from '@/utils/api/client';

export default {
  components: { BaseButton },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    logOut(): void {
      localStorage.removeItem(LocalStorageKeys.Token);
      api.signOut();
      this.userStore.logoutUser();
      this.$router.push({ name: 'Home' });
    },
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
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}
</style>
