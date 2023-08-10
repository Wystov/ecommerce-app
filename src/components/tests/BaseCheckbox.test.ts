import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseCheckbox from '../shared/BaseCheckbox.vue';

describe('BaseCheckbox tests', () => {
  it('should render', () => {
    const wrapper = mount(BaseCheckbox);
    expect(wrapper.find('div.checkbox-block').exists()).toBeTruthy();
    expect(wrapper.find('input.checkbox').exists()).toBeTruthy();
  });
  it('should render checkbox in dark theme', () => {
    const wrapper = mount(BaseCheckbox, {
      props: {
        label: 'Option',
        id: 'checkbox-id',
        name: 'checkbox-name',
        isDark: true,
      },
    });
    expect(wrapper.find('input.checkbox.dark-theme-checkbox').exists()).toBeTruthy();
  });
  it('should render disabled checkbox', () => {
    const wrapper = mount(BaseCheckbox, {
      props: {
        label: 'Option',
        id: 'checkbox-id',
        name: 'checkbox-name',
        disabled: true,
      },
    });
    const checkbox = wrapper.find('input.checkbox').element;
    if (checkbox instanceof HTMLInputElement) {
      expect(checkbox.disabled).toBeTruthy();
    }
  });
});
