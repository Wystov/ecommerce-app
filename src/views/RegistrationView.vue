<template>
  <div v-if="userStore.fetching" class="spinner-container">
    <div class="spinner" />
  </div>
  <section v-else class="registration container">
    <h1 class="title">Sign up to Crunch</h1>
    <AppRegistration />
  </section>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import AppRegistration from '@/components/AppRegistrationForm.vue';

export default {
  components: {
    AppRegistration,
  },
  computed: {
    ...mapStores(useUserStore),
  },
  created(): void {
    if (this.userStore.fetching) {
      this.$watch(() => this.userStore.fetching, () => {
        if (this.userStore.authorized) this.$router.push({ name: 'Home' });
      });
    }
  },
};
</script>

<style scoped>
.title {
  color: #3a3e3f;
  font-size: 32px;
  font-weight: 600;
  margin: 0;
}
.registration {
  display: flex;
  flex-direction: column;
  gap: 34px;
  margin: 50px auto;
}
.container {
  max-width: 740px;
}
.spinner-container {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
.spinner {
  border-top-color: var(--main-color);
}
</style>
