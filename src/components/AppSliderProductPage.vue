<template>
  <BasePopup :show="showPopUp" @close="showPopUp = !showPopUp" />
  <swiper
    loop
    :style="{
      '--swiper-navigation-color': 'var(--main-color)',
      '--swiper-pagination-color': 'var(--main-color)',
    }"
    pagination
    :spaceBetween="10"
    :thumbs="{ swiper: thumbsSwiper }"
    :modules="modules"
    :navigation="{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }"
    class="mySwiper"
    effect="coverflow"
    :coverflowEffect="{
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    }"
  >
    <swiper-slide
      v-for="(url, i) in images"
      :key="i"
    ><img
      :src="url"
      alt="product image"
      @keydown="showPopUp = true"
      @click="showPopUp = true"
      @error="setImgPlaceholder"
    /></swiper-slide>
  </swiper>
  <div class="slider-thumb-container">
    <div class="swiper-button-prev" />
    <div class="swiper-button-next" />
    <swiper
      @swiper="setThumbsSwiper"
      loop
      freeMode
      watchSlidesProgress
      :spaceBetween="10"
      :slides-per-view="3"
      :modules="modules"
      class="mySwiperThumb"
    >
      <swiper-slide
        v-for="(url, i) in images"
        :key="i"
      ><img
        :src="url"
        alt="product image"
        @error="setImgPlaceholder"
      /></swiper-slide>
    </swiper>
  </div>
</template>
<script lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/thumbs';

import { ref, type Ref } from 'vue';
import {
  FreeMode, Navigation, Thumbs, Pagination, EffectCoverflow,
} from 'swiper/modules';
import type { SwiperModule, Swiper as SwiperType } from 'swiper/types';
import imgPlaceholder from '@/assets/images/no-image-placeholder.svg';
import BasePopup from './shared/BasePopup.vue';

interface SwiperSetup {
  showPopUp: Ref<boolean>;
  setImgPlaceholder: ($event: Event) => void;
  thumbsSwiper: Ref<SwiperType | null | undefined>;
  setThumbsSwiper: (swiper: SwiperType) => void;
  modules: SwiperModule[];
}

export default {
  emits: ['open'],
  props: {
    images: {
      type: Array<string>,
      default: [imgPlaceholder],
    },
  },
  components: {
    Swiper,
    SwiperSlide,
    BasePopup,
  },
  setup(): SwiperSetup {
    const thumbsSwiper = ref<null | SwiperType>(null);
    const showPopUp = ref(false);
    const setThumbsSwiper = (swiper: SwiperType): void => {
      thumbsSwiper.value = swiper;
    };
    const setImgPlaceholder = ($event: Event): void => {
      const { target } = $event;
      if (target instanceof HTMLImageElement) target.src = imgPlaceholder;
    };

    return {
      showPopUp,
      setImgPlaceholder,
      thumbsSwiper,
      setThumbsSwiper,
      modules: [FreeMode, Navigation, Thumbs, Pagination, EffectCoverflow],
    };
  },
};
</script>

<style>
.swiper {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  overflow: hidden;
}

.swiper-slide img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.swiper {
  width: 100%;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
}

.mySwiper {
  height: 80%;
  width: 100%;
  .swiper-slide {
    padding: 40px 1vw;
    box-sizing: border-box;
  }
  .swiper-slide img {
    border-radius: 20px;
  }
}

.mySwiperThumb {
  height: 20%;
  box-sizing: border-box;
  padding: 10px 0;
}

.mySwiperThumb .swiper-slide {
  width: 25%;
  height: 100%;
  opacity: 0.4;
  cursor: pointer;
  border: solid 2px #d9d9d9;
  box-sizing: border-box;
}

.mySwiperThumb .swiper-slide-thumb-active {
  opacity: 1;
  border: solid 2px var(--main-color);
}

.slider-thumb-container {
  position: relative;
  width: 86%;
}
.swiper-button-next,
.swiper-button-prev {
  position: absolute;
  color: var(--main-color);
  &::after {
    font-size: 2em;
  }
}
.swiper-button-next {
  right: -12%;
}
.swiper-button-prev {
  left: -12%;
}
@media (max-width: 900px) {
  .mySwiper .swiper-slide {
    padding: 0 1vw 40px 1vw;
  }
}
@media (max-width: 600px) {
  .swiper-button-next,
  .swiper-button-prev {
    display: none;
  }
  .slider-thumb-container {
    position: relative;
    width: 100%;
  }
}
</style>
