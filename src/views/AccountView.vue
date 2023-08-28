<template>
  <div class="wrapper main-block">
    <h1 class="title">Account</h1>
    <div class="sections-nav">
      <template v-for="(section, i) in sections" :key="i">
        <li class="section-nav-item" :class="{ active: activeIndex === i }" @click="setActiveSection(i)" @keydown="setActiveSection(i)">
          {{ section }}
        </li>
        <img src="@/assets/icons/round.svg" class="decoration-svg" alt="decoration" v-if="i < sections.length - 1" />
      </template>
    </div>
    <AppAccountInfo v-if="activeIndex === 0" />
    <AppAccountAddresses v-if="activeIndex === 1" />
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import AppAccountInfo from '@/components/AppAccountInfo.vue';
import AppAccountAddresses from '@/components/AppAccountAddresses.vue';

export default {
  components: { AppAccountInfo, AppAccountAddresses },
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
  gap: 25px;
}
.sections-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 25px;
  margin-bottom: 2rem;
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
</style>
