/* eslint-disable max-lines-per-function */
import { RouterLinkStub, mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import type { ProductProjection } from '@commercetools/platform-sdk';
import AppProductCard from '@/components/AppProductCard.vue';

describe('AppProductCard in catalog', () => {
  const global = {
    components: {
      RouterLink: RouterLinkStub,
    },
  };
  const productData = {
    name: { en: 'pants' },
    slug: { en: 'slug' },
    description: { en: 'best pants' },
    masterVariant: {
      prices: [
        {
          value: {
            currencyCode: 'USD',
            centAmount: 450,
          },
          discounted: {
            value: {
              centAmount: 370,
            },
          },
        },
      ],
      images: [{ url: 'url' }],
      attributes: [{ name: 'brand', value: 'abibas' }],
    },
  } as unknown as ProductProjection;
  const currency = 'USD';
  const currencyTag = '$';

  it('renders product card', () => {
    const wrapper = mount(AppProductCard, {
      global,
      props: { productData, currency, currencyTag },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.card').exists()).toBe(true);
    expect(wrapper.find('.product-name').text()).toBe('pants by abibas');
    expect(wrapper.find('.product-description').text()).toBe('best pants');
    expect(wrapper.find('.old-price').text()).toBe('$4.50');
    expect(wrapper.find('.new-price').text()).toBe('$3.70');
    expect(wrapper.find('.product-image').attributes('src')).toBe('url');
  });

  it('handles long descriptions correctly', () => {
    const longDescription = 'this pants are so amazing and have four stripes';
    const productDataWithLongDescription = { ...productData, description: { en: longDescription } };

    const wrapper = mount(AppProductCard, {
      global,
      props: { productData: productDataWithLongDescription, currency, currencyTag },
    });

    expect(wrapper.find('.product-description').text()).toBe('this pants are so amazing and have four ...');
  });
});
