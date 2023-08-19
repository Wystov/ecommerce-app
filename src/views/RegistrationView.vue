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
.registration {
  display: flex;
  flex-direction: column;
  gap: 34px;
}
.container {
  max-width: 740px;
}
</style>
