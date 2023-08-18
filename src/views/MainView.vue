<template>
  <main class="wrapper">
    <div class="first-screen">
      <div class="hero flex">
        <div class="hero-text-container">
          <h1 class="title">The crunchiest breakfasts in one place.</h1>
          <p class="description">Order today, crunch tomorrow. Choose yours!</p>
          <BaseButton
            @click="$router.push({ name: 'Catalog' })"
            size="large"
            class="button"
            label="Explore"
          />
        </div>
        <div class="hero-image">
          <img src="@/assets/images/hero-image.svg" alt="hero" />
        </div>
      </div>
      <div class="promo hero-text-container">
        <h1 class="title">Promos</h1>
        <p class="description">Enjoy special promocodes for registered customers</p>
        <BaseButton
          @click="$router.push({ name: 'Sign Up' })"
          size="large"
          class="button"
          label="Explore"
        />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import BaseButton from '@/components/shared/BaseButton.vue';

export default {
  components: { BaseButton },
};
</script>

<style scoped>
.first-screen {
  display: flex;
  align-items: stretch;
  gap: 40px;
  margin-top: 50px;
}
.hero {
  width: 85%;
  padding: 50px 75px;
  border-radius: 10px;
  background-color: var(--secondary-color);
}
.hero-text-container,
.promo {
  display: flex;
  flex-direction: column;
  gap: 35px;
}
.hero-text-container {
  width: 70%;
}
.title {
  color: white;
  font-size: 62px;
  font-weight: 600;
}
.description {
  color: white;
  font-size: 30px;
}
.button {
  width: fit-content;
  background-color: white;
  color: var(--main-font-color);
}
.promo {
  flex-grow: 1;
  height: 100%;
  padding: 50px 75px;
  border-radius: 10px;
  background-color: var(--main-color);
}
</style>
