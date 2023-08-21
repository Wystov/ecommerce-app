import { defineStore } from 'pinia';
import api from '@/utils/api/client';
import { initErrorHandler } from '@/utils/api/error-handler';

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
        this.logoutUser();
        initErrorHandler(error);
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
