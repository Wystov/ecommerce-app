import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { NamePages } from '@/types/enums';
import AppBurgerMenu from '../AppBurgerMenu.vue';

describe('Burger menu tests', () => {
  it('should render menu', () => {
    setActivePinia(createPinia());
    const wrapper = mount(AppBurgerMenu);
    expect(wrapper.find('ul').exists()).toBeTruthy();
    const menuItems = wrapper.findAll('.menu-link');
    expect(menuItems).toHaveLength(5);

    const expectedNames = [
      NamePages.Home,
      NamePages.Catalog,
      NamePages.AboutUs,
      NamePages.Registration,
      NamePages.Login,
    ];
    menuItems.forEach((menuItem, index) => {
      expect(menuItem.text()).toBe(expectedNames[index]);
    });
  });
});
