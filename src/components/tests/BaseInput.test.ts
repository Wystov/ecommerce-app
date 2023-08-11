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
  it('should render input with custom width', () => {
    const wrapper = mount(BaseInput, {
      props: {
        width: '200px',
      },
    });
    const input = wrapper.find('input').element;
    expect(String(input.style.width) === '200px').toBeTruthy();
  });
});

describe('BaseInput values', () => {
  it('should update inputValue in input element', async () => {
    const wrapper = mount(BaseInput);

    const input = wrapper.find('input');
    await input.setValue('Hello');

    expect(wrapper.vm.inputValue).toBe('Hello');
  });
  it('should render input with valid value', () => {
    const wrapper = mount(BaseInput, {
      props: {
        valid: 'valid',
      },
    });
    expect(wrapper.find('input.valid-focus-decorator').exists()).toBeTruthy();
  });
  it('should render input with invalid value', () => {
    const wrapper = mount(BaseInput, {
      props: {
        valid: 'invalid',
      },
    });
    expect(wrapper.find('input.invalid-focus-decorator').exists()).toBeTruthy();
  });
});

describe('BaseInput label', () => {
  it('should render label for input', () => {
    const wrapper = mount(BaseInput, {
      props: {
        label: 'label',
      },
    });
    expect(wrapper.find('label').exists()).toBeTruthy();
  });
  it('should render placeholder for label', () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: 'name',
      },
    });
    expect(wrapper.find('input').element.placeholder === 'name').toBeTruthy();
  });
});
