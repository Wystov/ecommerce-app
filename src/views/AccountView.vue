<template>
  <div class="wrapper main-block">
    <h1 class="title">Account</h1>
    <div class="sections-nav">
      <template v-for="(section, i) in sections" :key="i">
        <li class="section-nav-item" :class="{ active: activeIndex === i }" @click="setActiveSection(i)" @keydown="setActiveSection(i)">
          {{ section }}
        </li>
        <div class="divider" v-if="i < sections.length - 1" />
      </template>
    </div>
    <AppAccountInfo v-if="activeIndex === 0" />
    <AppAccountAddresses v-if="activeIndex === 1" />
    <BaseButton @click="logOut" label="Log out" />
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import { LocalStorageKeys } from '@/types/enums';
import AppAccountInfo from '@/components/AppAccountInfo.vue';
import AppAccountAddresses from '@/components/AppAccountAddresses.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import api from '@/utils/api/client';

export default {
  components: { AppAccountInfo, AppAccountAddresses, BaseButton },
  computed: {
    ...mapStores(useUserStore),
  },
  data(): { sections: string[], activeIndex: number } {
    return {
      sections: ['INFO', 'ADDRESSES'],
      activeIndex: 0,
    };
  },
  methods: {
    logOut(): void {
      localStorage.removeItem(LocalStorageKeys.Token);
      api.signOut();
      this.userStore.logoutUser();
      this.$router.push({ name: 'Home' });
    },
    setActiveSection(index: number): void {
      this.activeIndex = index;
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
.main-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
}
.sections-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 25px;
  margin-bottom: 1rem;
}
.section-nav-item {
  color: var(--main-font-color);
  font-size: 1.5rem;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    color: var(--main-color);
  }

  &:active {
    opacity: 0.5;
  }
}
.active {
  color: var(--main-color);
  cursor: default;
}
.divider {
  height: 2rem;
  border: 1px solid var(--main-font-color);
}
</style>
