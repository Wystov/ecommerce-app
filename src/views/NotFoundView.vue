<template>
  <section class="wrapper not-found-container">
    <img :src="image" class="image" alt="Not Found Page" />
    <div class="caption">
      <h2 class="title">
        {{ title }}
      </h2>
      <p class="subtitle">
        {{ subtitle }}
      </p>
    </div>
    <BaseButton :size="buttonSize" @click="$router.go(-1)">
      Go back
    </BaseButton>
  </section>
</template>

<script lang="ts">
import BaseButton from '@/components/shared/BaseButton.vue';
import image from '../assets/images/404.png';

export default {
  components: {
    BaseButton,
  },
  data(): {
    image: string;
    title: string;
    subtitle: string;
    buttonSize: string;
    } {
    return {
      image,
      title: 'Something gone wrong\u00A0:(',
      subtitle: 'The page you were looking for doesn’t exist',
      buttonSize: 'medium',
    };
  },
  methods: {
    updateButtonSize(): void {
      if (window.innerWidth < 768) {
        this.buttonSize = 'large';
      } else {
        this.buttonSize = 'medium';
      }
    },
  },
  mounted(): void {
    this.updateButtonSize();
    window.addEventListener('resize', this.updateButtonSize);
  },
  beforeUnmount(): void {
    window.removeEventListener('resize', this.updateButtonSize);
  },
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 46px;
  margin-top: 110px;
}

.image {
  width: 50vw;
  max-width: 320px;
  min-width: 240px;
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
  text-align: center;
  font-size: 20px;
}

@media (max-width: 768px) {
  .not-found-container {
    margin-top: 100px;
  }
  .title {
    font-size: 40px;
  }
  .subtitle {
    font-size: 26px;
  }
  .caption {
    gap: 20px;
  }
}
</style>
