import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseBurger from '../shared/BaseBurger.vue';

describe('Base burger logo tests', () => {
  it('should render burger logo in closed menu state', () => {
    const wrapper = mount(BaseBurger, {
      props: {
        open: false,
      },
    });
    expect(wrapper.find('div.burger').exists()).toBeTruthy();
    const burgerLines = wrapper.findAll('.burger-line');
    expect(burgerLines).toHaveLength(3);
  });

  it('should render burger logo in open menu state', () => {
    const wrapper = mount(BaseBurger, {
      props: {
        open: true,
      },
    });
    expect(wrapper.find('div.burger-closed').exists()).toBeTruthy();
    const burgerLines = wrapper.findAll('.close-line');
    expect(burgerLines).toHaveLength(2);
  });
});
