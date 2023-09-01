import { mount } from '@vue/test-utils';
import { it, expect } from 'vitest';
import AppSliderProductPage from '../AppSliderProductPage.vue';

it('renders the component with images', async () => {
  const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
  const wrapper = mount(AppSliderProductPage, {
    props: { images },
  });

  expect(wrapper.exists()).toBe(true);

  const swiperSlides = wrapper.findAll('.mySwiper .swiper-slide');
  expect(swiperSlides.length).toBe(images.length);
  const swiperSlidesThumb = wrapper.findAll('.mySwiperThumb .swiper-slide');
  expect(swiperSlidesThumb.length).toBe(images.length);
});

it('opens the popup when an image is clicked', async () => {
  const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
  const wrapper = mount(AppSliderProductPage, {
    props: { images },
  });

  const imageToClick = wrapper.find('.mySwiper .swiper-slide img');
  await imageToClick.trigger('click');

  const popup = wrapper.find('.mySwiperPopUp');
  expect(popup.exists()).toBe(true);
});

it('closes the popup when the close button is clicked', async () => {
  const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
  const wrapper = mount(AppSliderProductPage, {
    props: { images },
  });

  const imageToClick = wrapper.find('.mySwiper .swiper-slide img');
  await imageToClick.trigger('click');

  const initialPopup = wrapper.find('.mySwiperPopUp');
  expect(initialPopup.exists()).toBe(true);

  const closeButton = wrapper.find('.close-icon');
  await closeButton.trigger('click');

  const closedPopup = wrapper.find('.mySwiperPopUp');
  expect(closedPopup.exists()).toBe(false);
});
