<template>
  <div class="authorization-list">
    <BaseSelect
      v-if="!userStore.authorized"
      @selectOption="userStore.changeCountry"
      class="country-select"
      id="country"
      :isPlain="true"
      :options="country"
      :default-selected="userStore.data.country" />
    <RouterLink
      v-for="(link, i) in updateAuthorizationList"
      :key="i"
      :class="link.class"
      :to="{ name: link.name }">
      <template
        v-if="link.name !== 'Account'">{{ link.name }}
      </template>
    </RouterLink>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import type { BaseDataAuthorization, AuthorizationList } from '@/types/types';
import { useUserStore } from '@/stores/user';
import { NamePages } from '@/types/enums';
import BaseSelect from './shared/BaseSelect.vue';

export default {
  components: {
    BaseSelect,
  },
  data(): BaseDataAuthorization {
    const { Login, Registration, Account } = NamePages;
    return {
      country: [
        {
          text: 'US',
          value: 'US',
        },
        {
          text: 'GB',
          value: 'GB',
        },
      ],
      authorizationList: [
        {
          name: Registration,
          authorization: false,
          class: 'signup-link',
        },
        {
          name: Login,
          authorization: false,
          class: 'login-link',
        },
        {
          name: Account,
          authorization: true,
          class: 'account-link',
        },
      ],
    };
  },
  computed: {
    ...mapStores(useUserStore),
    updateAuthorizationList(): AuthorizationList[] {
      return this.authorizationList
        .filter((link) => this.userStore.authorized === link.authorization);
    },
  },
};
</script>
<style scoped>
.authorization-list {
  display: flex;
  align-items: center;
  gap: 15px;
}
.icon {
  height: 1em;
}
.signup-link {
  color: var(--main-color);
  font-size: 18px;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    color: var(--main-font-color);
  }

  &:active {
    opacity: 0.5;
  }
}
.login-link {
  display: block;
  padding: 15px 30px;
  border: 2px solid var(--main-font-color);
  border-radius: 10px;
  color: var(--main-font-color);
  font-size: 18px;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    color: white;
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
  }

  &:active {
    opacity: 0.5;
  }
}
.account-link {
  display: block;
  width: 40px;
  height: 40px;
  background: url(@/assets/icons/account.svg) no-repeat;
}
.country-select {
  border: none;
}
</style>
