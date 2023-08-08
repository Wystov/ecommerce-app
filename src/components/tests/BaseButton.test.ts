import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseButton from '../shared/BaseButton.vue';

describe('BaseButton test', () => {
  it('render button', () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.find('.button').exists()).toBeTruthy();
  });

  it('render dark button', () => {
    const wrapper = mount(BaseButton, {
      props: {
        dark: true,
      },
    });
    expect(wrapper.find('.theme-dark').exists()).toBeTruthy();
  });

  it('render disabled button', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true,
      },
    });
    expect(wrapper.find('.disabled').exists()).toBeTruthy();
    const buttonElement = wrapper.find('.button').element;
    expect(buttonElement.getAttribute('disabled')).toBeTruthy();
  });
});
