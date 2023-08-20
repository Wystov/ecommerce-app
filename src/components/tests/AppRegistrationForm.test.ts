import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { it, expect } from 'vitest';
import AppRegistrationForm from '@/components/AppRegistrationForm.vue';
import RegistrationMain from '@/components/RegistrationMain.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import type { UserAddress } from '@/types/types';

const validFields: UserAddress = {
  country: 'US',
  city: 'Kekstan',
  streetName: 'Long Street',
  postalCode: '10010',
};

it('renders correctly', () => {
  const wrapper = mount(AppRegistrationForm);
  expect(wrapper.exists()).toBe(true);
});

it('show invalid message after click on button Continue', async () => {
  const wrapper = mount(AppRegistrationForm);
  const registration = wrapper.findComponent(RegistrationMain);

  await registration.vm.$emit('valid-all-main-fields', {
    valid: false,
    response: {},
    nextStepClick: true,
  });

  const errorMessage = wrapper.findComponent(BaseMessage);
  expect(errorMessage.exists()).toBe(true);
});

it('displays address blocks after main fields are valid', async () => {
  const wrapper = mount(AppRegistrationForm);
  const registration = wrapper.findComponent(RegistrationMain);
  const response = {
    fields: validFields,
    name: 'shipping',
  };

  await registration.vm.$emit('valid-all-main-fields', {
    valid: true,
    response,
    nextStepClick: true,
  });

  await nextTick();

  const shippingAddress = wrapper.find('.address.shipping');
  expect(shippingAddress.exists()).toBe(true);

  const billingAddress = wrapper.find('.address.billing');
  expect(billingAddress.exists()).toBe(false);
});

it('updates bodyAddresses and showMessage when address fields are checked', () => {
  const wrapper = mount(AppRegistrationForm);
  const registrationForm = wrapper.vm;

  expect(registrationForm.bodyAddresses).toEqual([{}, {}]);
  expect(registrationForm.showMessage).toBe(false);

  registrationForm.checkAddressFields({
    valid: true,
    response: {
      fields: validFields,
      name: 'shipping',
    },
  });
  registrationForm.checkAddressFields({
    valid: true,
    response: {
      fields: validFields,
      name: 'billing',
    },
  });
  expect(registrationForm.bodyAddresses).toEqual([validFields, validFields]);
  expect(registrationForm.showMessage).toBe(false);
});
