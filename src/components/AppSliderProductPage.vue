<template>
  <BasePopup
    :show="showPopUp"
    @close="closePopUp">
    <swiper
      zoom
      loop
      navigation
      :spaceBetween="0"
      :initialSlide="currentIndexSlide"
      :modules="modules"
      :keyboard="{
        enabled: true,
      }"
      class="mySwiperPopUp"
      @slideChangeTransitionStart="(swiper) => (currentIndexSlide = swiper.realIndex)">
      <swiper-slide
        v-for="(url, i) in images"
        :key="i"
        zoom>
        <img
          :src="url"
          alt="product image"
          @error="setImgPlaceholder" />
      </swiper-slide>
    </swiper>
    <p class="popup-describe">
      <span :style="{ verticalAlign: 'middle' }">
        <CursorArrowRaysIcon :style="{ width: '1em' }" />
      </span>
      Double click on image to zoom
    </p>
  </BasePopup>
  <swiper
    :style="{
      '--swiper-navigation-color': 'var(--main-color)',
      '--swiper-pagination-color': 'var(--main-color)',
    }"
    loop
    :spaceBetween="10"
    :modules="modules"
    :pagination="{ clickable: true }"
    :thumbs="{ swiper: thumbsSwiper }"
    :navigation="{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }"
    :coverflowEffect="{
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    }"
    effect="coverflow"
    class="mySwiper"
    @swiper="mainSwiper = $event">
    <swiper-slide
      v-for="(url, i) in images"
      :key="i">
      <img
        :src="url"
        alt="product image"
        @keydown="openPopUp(i)"
        @click="openPopUp(i)"
        @error="setImgPlaceholder" />
    </swiper-slide>
  </swiper>
  <div class="slider-thumb-container">
    <div class="swiper-button-prev" />
    <div class="swiper-button-next" />
    <swiper
      loop
      freeMode
      watchSlidesProgress
      :spaceBetween="10"
      :slidesPerView="3"
      :modules="modules"
      class="mySwiperThumb"
      @swiper="setThumbsSwiper">
      <swiper-slide
        v-for="(url, i) in images"
        :key="i">
        <img
          :src="url"
          alt="product image"
          @error="setImgPlaceholder" />
      </swiper-slide>
    </swiper>
  </div>
</template>
<script lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/zoom';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/thumbs';

import { ref } from 'vue';
import {
  FreeMode,
  Navigation,
  Thumbs,
  Pagination,
  EffectCoverflow,
  Zoom,
  Keyboard,
} from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';
import { CursorArrowRaysIcon } from '@heroicons/vue/20/solid';
import type { SwiperSetup } from '@/types/types';
import imgPlaceholder from '@/assets/images/no-image-placeholder.svg';
import BasePopup from './shared/BasePopup.vue';

export default {
  components: {
    Swiper,
    SwiperSlide,
    BasePopup,
    CursorArrowRaysIcon,
  },
  props: {
    images: {
      type: Array<string>,
      default: [imgPlaceholder],
    },
  },
  emits: ['open'],
  setup(): SwiperSetup {
    const thumbsSwiper = ref<null | SwiperType>(null);
    const mainSwiper = ref<null | SwiperType>(null);

    const showPopUp = ref(false);
    const currentIndexSlide = ref(0);

    const setThumbsSwiper = (swiper: SwiperType): void => {
      thumbsSwiper.value = swiper;
    };
    const setImgPlaceholder = ($event: Event): void => {
      const { target } = $event;
      if (target instanceof HTMLImageElement) target.src = imgPlaceholder;
    };
    const openPopUp = (index: number): void => {
      showPopUp.value = true;
      currentIndexSlide.value = index;
    };
    const closePopUp = async (): Promise<void> => {
      showPopUp.value = false;
      mainSwiper.value?.slideToLoop(currentIndexSlide.value, 0);
      thumbsSwiper.value?.slideToLoop(currentIndexSlide.value, 0);
    };
    return {
      showPopUp,
      currentIndexSlide,
      openPopUp,
      closePopUp,
      setImgPlaceholder,
      thumbsSwiper,
      mainSwiper,
      setThumbsSwiper,
      modules: [FreeMode, Navigation, Thumbs, Pagination, EffectCoverflow, Zoom, Keyboard],
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
.mySwiperPopUp {
  position: relative;
  height: auto;
  border-radius: 20px 20px 0 0;
  .swiper-slide {
    border-radius: 20px 20px 0 0;
  }
  .swiper-button-next,
  .swiper-button-prev {
    top: 50%;
    width: fit-content;
    padding: 6px;
    aspect-ratio: 1;
    background: #fff;
    border-radius: 50%;
    font-size: 1em;
    transition: 0.3s;
    &:hover {
      background: var(--main-color);
      color: #fff;
    }
    &:active {
      background: var(--main-color-active);
    }
  }
  .swiper-button-next {
    right: 4%;
    &::after {
      padding-left: 6px;
      font-size: 1.5rem;
    }
  }
  .swiper-button-prev {
    left: 4%;
    &::after {
      padding-right: 6px;
      font-size: 1.5rem;
    }
  }
}
.mySwiperPopUp img {
  object-fit: contain;
}
.popup-describe {
  padding: 2vh;
  text-align: center;
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
  .slider-thumb-container {
    .swiper-button-next,
    .swiper-button-prev {
      display: none;
    }
  }
  .slider-thumb-container {
    position: relative;
    width: 100%;
  }
  .mySwiperPopUp img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
