import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseInput from '../shared/BaseInput.vue';

describe('BaseInput tests', () => {
  it('should render', () => {
    const wrapper = mount(BaseInput);
    expect(wrapper.find('div.input-block').exists()).toBeTruthy();
    expect(wrapper.find('input').exists()).toBeTruthy();
  });
  it('should render input in dark theme', () => {
    const wrapper = mount(BaseInput, {
      props: {
        isDark: true,
      },
    });
    expect(wrapper.find('input.dark-theme-input').exists()).toBeTruthy();
  });
  it('should render disabled input', () => {
    const wrapper = mount(BaseInput, {
      props: {
        disabled: true,
      },
    });
    const input = wrapper.find('input').element;
    expect(input.disabled).toBeTruthy();
  });
});
