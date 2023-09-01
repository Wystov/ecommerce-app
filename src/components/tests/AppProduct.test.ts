import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import type { ProductProjection } from '@commercetools/platform-sdk';
import type { AppProduct as AppProductType } from '@/types/types';
import AppProduct from '../AppProduct.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/product/some-product',
      name: 'route',
      component: AppProduct,
    },
  ],
});

const productData = {
  name: 'Product',
  description: { en: 'description' },
  masterVariant: {
    images: ['url'],
    prices: [
      { value: { currencyCode: 'USD', centAmount: 340, fractionDigits: 2 } },
    ],
  },
  key: 1,
} as unknown as ProductProjection;

const mockData = {
  fetching: false,
  productData,
  product: {
    name: ['name'],
    description: 'descr',
    images: ['url'],
  },
};

it('renders loading spinner when fetching is true', async () => {
  const wrapper = shallowMount(AppProduct, {
    global: {
      plugins: [router],
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
    data() {
      return {
        fetching: true,
      };
    },
  });

  const spinnerContainer = wrapper.find('.spinner-container');
  expect(spinnerContainer.exists()).toBe(true);

  const productContent = wrapper.find('.product-content');
  expect(productContent.exists()).toBe(false);
});

it('renders product content when fetching is false and productData is available', async () => {
  setActivePinia(createPinia());

  const wrapper = shallowMount(AppProduct, {
    global: {
      plugins: [router],
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
    data(): AppProductType {
      return mockData;
    },
  });

  const spinnerContainer = wrapper.find('.spinner-container');
  expect(spinnerContainer.exists()).toBe(false);

  const productContent = wrapper.find('.product-content');
  expect(productContent.exists()).toBe(true);
});

it('renders NotFoundView when fetching is false and productData is null', async () => {
  const wrapper = shallowMount(AppProduct, {
    global: {
      plugins: [router],
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
    data() {
      return {
        fetching: false,
        productData: null,
      };
    },
  });

  const spinnerContainer = wrapper.find('.spinner-container');
  expect(spinnerContainer.exists()).toBe(false);

  const notFoundView = wrapper.findComponent({ name: 'NotFoundView' });
  expect(notFoundView.exists()).toBe(true);
});
