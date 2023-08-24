<template>
  <div class="authorization-list">
    <BaseSelect
      v-if="!userStore.authorized"
      @selectOption="userStore.changeCountry"
      class="country-select"
      id="country"
      :isPlain="true"
      :options="country"
      :default-selected="userStore.data.country"
    />
    <RouterLink
      v-for="(link, i) in updateAuthorizationList"
      :key="i"
      :class="link.class"
      class="link"
      :to="{ name: link.name }"
    >
      <template v-if="link.name !== 'Account'">{{ link.name }} </template>
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
      return this.authorizationList.filter(
        (link) => this.userStore.authorized === link.authorization,
      );
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
.link {
  font-size: 18px;
}
.signup-link {
  color: var(--main-color);
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
  border: 2px solid var(--main-font-color);
  border-radius: 10px;
  color: var(--main-font-color);
  text-decoration: none;
  transition: 0.3s;
  padding: 15px 30px;

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
  background-image: url(/src/assets/icons/account.svg);
  background-repeat: no-repeat;
  background-size: cover;
}
.country-select {
  border: none;
}
@media (max-width: 1680px) {
  .link {
    font-size: 1rem;
  }
  .login-link {
    padding: 10px 20px;
  }

  .account-link {
    width: 30px;
    height: 30px;
  }
}
</style>
