<template>
  <section class="registration container">
    <h1 class="title">Sign up to Crunch</h1>
    <AppRegistration />
  </section>
</template>

<script lang="ts">
import AppRegistration from '@/components/AppRegistrationForm.vue';

export default {
  components: {
    AppRegistration,
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
</style>
