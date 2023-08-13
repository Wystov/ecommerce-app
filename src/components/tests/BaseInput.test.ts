import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseInput from '../shared/BaseInput.vue';

describe('BaseInput tests', () => {
  it('should render', () => {
    const wrapper = mount(BaseInput, {
      props: { id: '0' },
    });
    expect(wrapper.find('div.input-block').exists()).toBeTruthy();
    expect(wrapper.find('input').exists()).toBeTruthy();
  });
  it('should render input in dark theme', () => {
    const wrapper = mount(BaseInput, {
      props: {
        isDark: true,
        id: '1',
      },
    });
    expect(wrapper.find('input.dark-theme-input').exists()).toBeTruthy();
  });
  it('should render disabled input', () => {
    const wrapper = mount(BaseInput, {
      props: {
        disabled: true,
        id: '2',
      },
    });
    const input = wrapper.find('input').element;
    expect(input.disabled).toBeTruthy();
  });
  it('should render input with custom width', () => {
    const wrapper = mount(BaseInput, {
      props: {
        width: '200px',
        id: '3',
      },
    });
    const inputBlock = wrapper.find('div.input-block').element;
    if (inputBlock instanceof HTMLElement) {
      expect(String(inputBlock.style.width) === '200px').toBeTruthy();
    }
  });
});

describe('BaseInput values', () => {
  it('should update inputValue in input element', async () => {
    const wrapper = mount(BaseInput, {
      props: { id: '4' },
    });

    const input = wrapper.find('input');
    await input.setValue('Hello');

    expect(wrapper.vm.inputValue).toBe('Hello');
  });
  it('should render input with valid value', () => {
    const wrapper = mount(BaseInput, {
      props: {
        valid: 'valid',
        id: '5',
      },
    });
    expect(wrapper.find('input.valid-focus-decorator').exists()).toBeTruthy();
  });
  it('should render input with invalid value', () => {
    const wrapper = mount(BaseInput, {
      props: {
        valid: 'invalid',
        id: '6',
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
        id: '7',
      },
    });
    expect(wrapper.find('label').exists()).toBeTruthy();
  });
  it('should render placeholder for label', () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: 'name',
        id: '8',
      },
    });
    expect(wrapper.find('input').element.placeholder === 'name').toBeTruthy();
  });
});
