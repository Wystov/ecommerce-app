import { describe, it, expect } from 'vitest';
import { RouterLinkStub, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import AppHeader from '../AppHeader.vue';

const pinia = createPinia();
const global = {
  components: {
    RouterLink: RouterLinkStub,
  },
  mocks: {
    $pinia: pinia,
  },
};

describe('Header tests', () => {
  it('should render header', () => {
    const wrapper = mount(AppHeader, { global });
    expect(wrapper.find('header').exists()).toBeTruthy();
    expect(wrapper.find('div.wrapper').exists()).toBeTruthy();
    expect(wrapper.find('img.logo').exists()).toBeTruthy();
    expect(wrapper.find('nav.navigation').exists()).toBeTruthy();
    const navItems = wrapper.findAll('.navigation-item');
    expect(navItems).toHaveLength(3);
    expect(wrapper.find('img.cart-link').exists()).toBeTruthy();
  });
  it('should open and close burger menu by click on burger icon', async () => {
    const wrapper = mount(AppHeader, { global });
    const burgerIcon = wrapper.find('.burger');
    burgerIcon.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isBurgerOpen).toBe(true);
    expect(wrapper.find('.menu-block').exists()).toBeTruthy();
    const burgerCloseIcon = wrapper.find('.burger-closed');
    burgerCloseIcon.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isBurgerOpen).toBe(false);
  });
});
