import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import RegistrationMain from '@/components/RegistrationMain.vue';
import BaseMessage from '../shared/BaseMessage.vue';

describe('RegistrationMain', () => {
  it('renders correctly', () => {
    const wrapper = mount(RegistrationMain);
    expect(wrapper.exists()).toBe(true);
  });

  it('shows the Continue button when showButton is true', async () => {
    const wrapper = mount(RegistrationMain);
    await wrapper.setData({ showButton: true });
    expect(wrapper.find('.btn-continue').exists()).toBe(true);
  });

  it('hides the Continue button when showButton is false', async () => {
    const wrapper = mount(RegistrationMain);
    await wrapper.setData({ showButton: false });
    expect(wrapper.find('.btn-continue').exists()).toBe(false);
  });

  it('shows error message for invalid password', async () => {
    const wrapper = mount(RegistrationMain);

    const field = wrapper.vm.fields.find((f) => f.label === 'Password');
    const passwordInput = wrapper.find('input[type="password"]');

    let errorMessage = wrapper.findComponent(BaseMessage);
    expect(errorMessage.exists()).toBe(false);
    expect(field?.showMessage).toBe(false);

    await passwordInput.trigger('focusin');
    await passwordInput.trigger('input');
    await passwordInput.setValue('invalid-password');

    expect(field?.valid).toBe('invalid');
    expect(field?.showMessage).toBe(true);

    errorMessage = wrapper.findComponent(BaseMessage);
    expect(errorMessage.exists()).toBe(true);
  });
});
