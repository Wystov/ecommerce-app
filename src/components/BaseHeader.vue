<template>
  <header class="header container">
    <div class="logo">Logo</div>
    <div class="navigation">
      <ul class="navigation-list">
        <li class="navigation-link" v-for="(page, i) in navigation" :key="i">
          <BaseButton dark rounded @click="routePage(page)">{{ page }}</BaseButton>
        </li>
      </ul>
    </div>
    <div class="authorization-list">
      <BaseButton v-for="(link, i) in authorizationList" :key="i" @click="routePage(link.name)">
        <component :is="link.icon" class="icon" />
        {{ link.name }}
      </BaseButton>
    </div>
  </header>
</template>
<script lang="ts">
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from '@heroicons/vue/20/solid';
import { NamePages } from '@/types/enums';
import { type DataHeader } from '@/types/types';
import BaseButton from '@/components/shared/BaseButton.vue';

export default {
  components: {
    BaseButton,
    ArrowLeftOnRectangleIcon,
    ArrowRightOnRectangleIcon,
    UserPlusIcon,
  },
  data(): DataHeader {
    const {
      Home, AboutUs, Catalog, Login, Registration, Logout,
    } = NamePages;
    return {
      navigation: [Home, AboutUs, Catalog],
      authorizationList: [
        {
          name: Login,
          authorization: false,
          icon: ArrowLeftOnRectangleIcon,
        },
        {
          name: Registration,
          authorization: false,
          icon: UserPlusIcon,
        },
        {
          name: Logout,
          authorization: true,
          icon: ArrowRightOnRectangleIcon,
        },
      ],
      authorized: false,
    };
  },
  computed: {},
  methods: {
    updateAuthorizationList(): void {
      this.authorizationList = this.authorizationList.filter(
        (link) => this.authorized === link.authorization,
      );
    },
    routePage(name: NamePages): void {
      this.$router.push({ name });
    },
  },
  created(): void {
    this.updateAuthorizationList();
  },
};
</script>
<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: #f0f0f0;
}
.navigation {
  display: flex;
}
.navigation-list {
  display: flex;
  gap: 0.2em;
}
.navigation-link {
  display: flex;
}
.authorization-list {
  display: flex;
  gap: 0.2em;
}
.icon {
  height: 1em;
}
</style>
