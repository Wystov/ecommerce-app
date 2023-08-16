<template>
  <section class="container not-found-container">
    <img :src="image" class="image" alt="Not Found Page" />
    <div class="caption">
      <h2 class="title">{{ title }}</h2>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
    <BaseButton @click="$router.go(-1)">Go back</BaseButton>
  </section>
</template>

<script lang="ts">
import BaseButton from '@/components/shared/BaseButton.vue';
import image from '../assets/images/404.svg';

export default {
  components: {
    BaseButton,
  },
  data(): {
    image: string;
    title: string;
    subtitle: string;
    } {
    return {
      image,
      title: 'Something gone wrong :(',
      subtitle: 'The page you were looking for doesn’t exist',
    };
  },
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 46px;
  margin-top: 160px;
  padding: 10px;
}

.image {
  width: 100%;
  max-width: 320px;
  height: auto;
}

.caption {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.title {
  text-align: center;
}

.subtitle {
  font-size: 20px;
}
</style>
