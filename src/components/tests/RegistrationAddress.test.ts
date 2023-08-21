import { mount } from '@vue/test-utils';

import { describe, it, expect } from 'vitest';
import RegistrationAddress from '@/components/RegistrationAddress.vue';
import BaseSelect from '../shared/BaseSelect.vue';

describe('RegistrationAddress', () => {
  const wrapper = mount(RegistrationAddress, {
    props: {
      title: 'Test Title',
      id: 'testId',
    },
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('updates countryField.value and postal code validity when selecting a country', async () => {
    const select = wrapper.findComponent(BaseSelect);
    await select.vm.$emit('selectOption', 'GB');

    const { countryField } = wrapper.vm;
    const postalCodeField = wrapper.vm.fields.find((field) => field.label === 'Postal Code');

    const postalCodeInput = wrapper.find('input[placeholder="W10BB"]');
    await postalCodeInput.setValue('W10BB');
    expect(countryField.value).toBe('GB');
    expect(postalCodeField?.valid).toBe('valid');
  });

  it('validates city and street name fields based on their patterns', async () => {
    const cityInput = wrapper.find('input[placeholder="New York"]');
    const streetNameInput = wrapper.find('input[placeholder="Wall Street"]');

    await cityInput.setValue('Bobruisk');
    await streetNameInput.setValue('Lenina');

    expect(cityInput.classes()).toContain('valid-focus-decorator');
    expect(streetNameInput.classes()).toContain('valid-focus-decorator');
  });
});
