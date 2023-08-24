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
          <img src="@/assets/images/hero-image.svg" alt="hero" class="hero-img" />
        </div>
      </div>
      <div class="promo">
        <div class="promo-text-container">
          <h1 class="title">Promos</h1>
          <div class="promo-image">
            <img src="@/assets/images/promo.svg" alt="promo label" class="promo-img" />
          </div>
          <p class="description">Enjoy special promocodes for registered customers</p>
          <BaseButton
            v-if="!authorized"
            @click="$router.push({ name: 'Sign Up' })"
            size="large"
            class="button"
            label="Join us"
          />
          <template v-else>
            <div class="promocode">CROSS-CHECK</div>
            <BaseButton
              @click="copyPromo"
              ref="copyButton"
              size="large"
              class="button"
              :label="promoBtnText"
            />
          </template>
        </div>
      </div>
    </div>
    <div class="links-list">
      <RouterLink
        v-for="(link, i) in sitemap"
        :to="{ name: link }"
        class="button button-link"
        v-bind:key="i"
      >
        {{ link }}
      </RouterLink>
    </div>
  </main>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useUserStore } from '@/stores/user';
import BaseButton from '@/components/shared/BaseButton.vue';
import { NamePages } from '@/types/enums';

export default {
  components: { BaseButton },
  data(): { sitemap: Record<string, string>; promoBtnText: string } {
    return {
      sitemap: {
        login: NamePages.Login,
        signup: NamePages.Registration,
        account: NamePages.Account,
      },
      promoBtnText: 'Copy',
    };
  },
  computed: {
    ...mapState(useUserStore, ['authorized']),
  },
  methods: {
    copyPromo(): void {
      navigator.clipboard.writeText('CROSS-CHECK');
      this.promoBtnText = '✓';
    },
  },
};
</script>

<style scoped>
.first-screen {
  display: grid;
  grid-template-columns: 62.5% 35%;
  justify-content: space-between;
  justify-items: stretch;
  width: 100%;
}
.hero {
  display: flex;
  padding: 50px 75px;
  border-radius: 10px;
  background-color: var(--secondary-color);
}
.hero-text-container {
  display: flex;
  flex-direction: column;
  gap: 35px;
  width: 70%;
}
.hero-img {
  width: 100%;
}
.title {
  color: white;
  font-size: 62px;
  font-weight: 600;
  margin: 0;
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
  position: relative;
  border-radius: 10px;
  background-color: var(--main-color);
}
.promo-text-container {
  padding: 50px 75px;
  display: flex;
  flex-direction: column;
  gap: 35px;
}
.promo-image {
  position: absolute;
  right: 20px;
  top: 20px;
}
.promocode {
  width: fit-content;
  color: white;
  padding: 5px 10px;
  border: 2px solid white;
  border-radius: 10px;
}
.links-list {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin-top: 3rem;
}
.button-link {
  display: block;
  padding: 15px 30px;
  border: 2px solid var(--main-font-color);
  border-radius: 10px;
  color: var(--main-font-color);
  font-size: 18px;
  text-decoration: none;
  transition: 0.3s;
}
.button-link:hover {
  border: 2px solid var(--main-color);
}
@media (max-width: 1500px) {
  .title {
    font-size: 3rem;
  }
  .description {
    font-size: 1.6rem;
  }
  .hero,
  .promo-text-container {
    padding: 30px 50px;
  }
}
@media (max-width: 1100px) {
  .first-screen {
    grid-template-columns: 100%;
    gap: 20px;
  }
  .promo {
    width: 100%;
  }
  .hero-image {
    width: 25%;
  }
  .promo-image {
    width: 70px;
  }
  .promo-img {
    width: 100%;
  }
}
@media (max-width: 750px) {
  .title {
    font-size: 2rem;
  }
  .description {
    font-size: 1rem;
  }
  .hero-image {
    display: none;
  }
  .hero-text-container {
    width: 100%;
  }
  .button :not(.button-link) {
    font-size: 1.5rem;
  }
  .promo-image {
    top: auto;
    bottom: 20px;
  }
  .links-list {
    margin-top: 1rem;
  }
}
@media (max-width: 470px) {
  .button-link {
    padding: 15px 0;
    width: 33%;
    text-align: center;
  }
}
</style>
