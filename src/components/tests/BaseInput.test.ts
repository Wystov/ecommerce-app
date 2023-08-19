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
        id: 'input',
        isDark: true,
      },
    });
    expect(wrapper.find('input.dark-theme-input').exists()).toBeTruthy();
  });
  it('should render disabled input', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'input',
        disabled: true,
      },
    });
    const input = wrapper.find('input').element;
    expect(input.disabled).toBeTruthy();
  });
  it('should render input with custom width', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'input',
        width: '200px',
      },
    });
    const input = wrapper.find('div').element;
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
        id: 'input',
        valid: 'valid',
      },
    });
    expect(wrapper.find('input.valid-focus-decorator').exists()).toBeTruthy();
  });
  it('should render input with invalid value', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'input',
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
        id: 'input',
        label: 'label',
      },
    });
    expect(wrapper.find('label').exists()).toBeTruthy();
  });
  it('should render placeholder for label', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'input',
        name: 'name',
      },
    });
    expect(wrapper.find('input').element.placeholder === 'name').toBeTruthy();
  });
});

describe('Password visibility icon', () => {
  it('should render visibility icon for show password', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'story',
        hidePass: 'hide',
      },
    });
    expect(wrapper.find('svg.input-icon').exists()).toBeTruthy();
  });
  it('should render visibility icon for hide password', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'story',
        hidePass: 'show',
      },
    });
    expect(wrapper.find('svg.input-icon').exists()).toBeTruthy();
  });
});

describe('Input type password', () => {
  it('should render input with type password', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'story',
        type: 'password',
        hidePass: 'hide',
      },
    });
    expect(wrapper.find('input').element.type === 'password').toBeTruthy();
  });
  it('should render input with type text', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'story',
        hidePass: 'show',
      },
    });
    expect(wrapper.find('input').element.type === 'text').toBeTruthy();
  });
});
