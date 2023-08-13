<template>
  <div class="authorization-list">
    <BaseButton
      v-for="(link, i) in updateAuthorizationList"
      :key="i"
      @click="$router.push({ name: link.name })"
    >
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
import { mapStores } from 'pinia';
import type { DataAuthorization, AuthorizationList } from '@/types/types';
import { useUserStore } from '@/stores/user';
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
    };
  },
  computed: {
    ...mapStores(useUserStore),
    updateAuthorizationList(): AuthorizationList[] {
      return this.authorizationList.filter(
        (link) => this.userStore.authorized === link.authorization
      );
    },
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
