<template>
  <div class="wrapper">
    <h1 class="title">
      The Team
    </h1>
    <p>Here is a very meaningful text about our team and how good we are!</p>
    <AboutUsBlock />
  </div>
</template>

<script lang="ts">
import AboutUsBlock from '@/components/AppAboutUsBlock.vue';

export default {
  components: {
    AboutUsBlock,
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
