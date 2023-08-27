<template>
  <div class="info-container">
    <div class="info-block">
      <div class="info-item">
        <span>First name</span>
        <span class="content">{{ name }}</span>
      </div>
      <div class="info-item">
        <span>Last Name</span>
        <span class="content">{{ surname }}</span>
      </div>
      <div class="info-item">
        <span>Date of birth</span>
        <span class="content">{{ date }}</span>
      </div>
    </div>
    <div class="buttons-block">
      <BaseButton label="Update info" @click="getData" />
      <BaseButton label="Change password" />
      <BaseButton @click="logOut" label="Log out" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import BaseButton from '@/components/shared/BaseButton.vue';
import { LocalStorageKeys } from '@/types/enums';
import api from '@/utils/api/client';

export default {
  components: {
    BaseButton,
  },
  computed: {
    ...mapStores(useUserStore),
    name(): string {
      return '';
    },
    surname(): string {
      return '';
    },
    date(): string {
      return '';
    },
  },
  methods: {
    logOut(): void {
      localStorage.removeItem(LocalStorageKeys.Token);
      api.signOut();
      this.userStore.logoutUser();
      this.$router.push({ name: 'Home' });
    },
    async getData(): Promise<void> {
      const body = await api.call().customerGroups();
      console.log('body:', body);
    },
  },
};
</script>

<style scoped>
.info-container,
.info-block {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.info-item {
  display: flex;
  align-items: flex-end;
  gap: 3rem;
}
.content {
  font-size: 1.5rem;
}
.buttons-block {
  display: flex;
  gap: 2rem;
}
</style>
