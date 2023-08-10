<template>
  <div class="authorization-list">
    <BaseButton v-for="(link, i) in authorizationList" :key="i" @click="routePage(link.name)">
      <component :is="link.icon" class="icon" />
      {{ link.name }}
    </BaseButton>
  </div>
</template>
<script lang="ts">
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from '@heroicons/vue/20/solid';
import { type DataAuthorization } from '@/types/types';
import { NamePages } from '@/types/enums';
import BaseButton from './shared/BaseButton.vue';

export default {
  components: {
    ArrowLeftOnRectangleIcon,
    ArrowRightOnRectangleIcon,
    UserPlusIcon,
    BaseButton,
  },
  data(): DataAuthorization {
    const { Login, Registration, Logout } = NamePages;
    return {
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
.authorization-list {
  display: flex;
  gap: 0.2em;
}
.icon {
  height: 1em;
}
</style>
