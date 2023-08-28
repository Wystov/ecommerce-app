<template>
  <div class="info-container">
    <div class="info-block">
      <span class="content-name">First name</span>
      <span class="content">{{ firstName }}</span>
      <span class="content-name">Last Name</span>
      <span class="content">{{ lastName }}</span>
      <span class="content-name">Date of birth</span>
      <span class="content">{{ birthDate }}</span>
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
import type { AccountInfoData } from '@/types/types';
import api from '@/utils/api/client';

export default {
  components: {
    BaseButton,
  },
  data(): AccountInfoData {
    return {
      name: '',
      surname: '',
      date: '',
    };
  },
  computed: {
    ...mapStores(useUserStore),
    firstName(): string {
      if (this.name) {
        return this.name;
      }
      return '';
    },
    lastName(): string {
      if (this.surname) {
        return this.surname;
      }
      return '';
    },
    birthDate(): string {
      if (this.date) {
        return this.date;
      }
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
      try {
        const { body } = await api.call().me().get().execute();
        this.name = body.firstName;
        this.surname = body.lastName;
        this.date = body.dateOfBirth;
      } catch (error) {
        console.error('Error:', error);
      }
    },
  },
  created(): void {
    this.getData();
  },
};
</script>

<style scoped>
.info-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.info-block {
  display: grid;
  grid-template-columns: 0.3fr 1fr;
  align-items: end;
  gap: 3rem;
}
.content-name {
  width: fit-content;
}
.content {
  font-size: 1.5rem;
}
.buttons-block {
  display: flex;
  gap: 2rem;
}
</style>
