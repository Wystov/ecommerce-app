import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({ authorized: false }),
  actions: {
    loginUser() {
      this.authorized = true;
    },
    logoutUser() {
      this.authorized = false;
    },
  },
});
