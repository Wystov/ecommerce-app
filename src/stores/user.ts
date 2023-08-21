import { defineStore } from 'pinia';
import type { ClientResponse } from '@commercetools/platform-sdk';
import api from '@/utils/api/client';

export const useUserStore = defineStore('user', {
  state: () => ({
    authorized: false,
    fetching: true,
  }),
  actions: {
    async init() {
      try {
        const response = await api.call().me().get().execute();
        if (response.statusCode === 200) this.loginUser();
      } catch (error) {
        if ((error as ClientResponse).statusCode === 403) this.logoutUser();
      } finally {
        this.fetching = false;
      }
    },
    loginUser() {
      this.authorized = true;
    },
    logoutUser() {
      this.authorized = false;
    },
  },
});
