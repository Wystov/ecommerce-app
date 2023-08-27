<template>
  <swiper
    :style="{
      '--swiper-navigation-color': '#fff',
      '--swiper-pagination-color': '#fff',
    }"
    :loop="true"
    :spaceBetween="10"
    :navigation="true"
    :thumbs="{ swiper: thumbsSwiper }"
    :modules="modules"
    class="mySwiper2"
  >
    <swiper-slide
      v-for="(url, i) in images"
      :key="i + 1000"
    ><img
      :src="url"
      alt="product image"
    /></swiper-slide>
  </swiper>
  <swiper
    @swiper="setThumbsSwiper"
    :loop="true"
    :spaceBetween="10"
    :slides-per-view="3"
    :freeMode="true"
    :watchSlidesProgress="true"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide
      v-for="(url, i) in images"
      :key="i"
    ><img
      :src="url"
      alt="product image"
    /></swiper-slide>
  </swiper>
</template>
<script lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';

import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { ref, type Ref } from 'vue';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { SwiperModule, Swiper as SwiperType } from 'swiper/types';

interface SwiperSetup {
  thumbsSwiper: Ref<SwiperType | null | undefined>;
  setThumbsSwiper: (swiper: SwiperType) => void;
  modules: SwiperModule[];
}

export default {
  props: {
    images: {
      type: Array<string>,
      default: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjOFlo/R8ABfECde1VE6sAAAAASUVORK5CYII',
      ],
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  setup(): SwiperSetup {
    const thumbsSwiper = ref<null | SwiperType>(null);

    const setThumbsSwiper = (swiper: SwiperType): void => {
      thumbsSwiper.value = swiper;
    };

    return {
      thumbsSwiper,
      setThumbsSwiper,
      modules: [FreeMode, Navigation, Thumbs],
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
  border-radius: 20px;
  background-size: cover;
  background-position: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 20px;
}

.swiper {
  width: 100%;
  height: 300px;
  margin-left: auto;
  margin-right: auto;
}

.mySwiper2 {
  height: 80%;
  width: 100%;
}

.mySwiper {
  height: 20%;
  box-sizing: border-box;
  padding: 10px 0;
}

.mySwiper .swiper-slide {
  width: 25%;
  height: 100%;
  opacity: 0.4;
  cursor: pointer;
}

.mySwiper .swiper-slide-thumb-active {
  opacity: 1;
}

.swiper-button-prev:after,
.swiper-button-next:after {
  color: var(--main-color);
}
</style>
