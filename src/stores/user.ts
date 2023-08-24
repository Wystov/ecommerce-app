import { defineStore } from 'pinia';
import api from '@/utils/api/client';
import { initErrorHandler } from '@/utils/api/error-handler';
import { LocalStorageKeys } from '@/types/enums';
import type { Country } from '@/types/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    authorized: false,
    fetching: true,
    data: {
      country: localStorage.getItem(LocalStorageKeys.Country) ?? 'US',
    },
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
    changeCountry(country: Country) {
      this.data.country = country;
      localStorage.setItem(LocalStorageKeys.Country, this.data.country);
    },
  },
});
