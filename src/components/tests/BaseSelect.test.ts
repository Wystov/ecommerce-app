import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseSelect from '../shared/BaseSelect.vue';

describe('BaseSelect test', () => {
  it('renders select with options', async () => {
    const options = [
      { value: 'option1', text: 'Option 1' },
      { value: 'option2', text: 'Option 2' },
    ];

    const wrapper = mount(BaseSelect, {
      props: {
        label: 'Select Label',
        id: 'first-select',
        options,
        defaultSelected: 'option1',
      },
    });

    const select = wrapper.find('select');

    options.forEach((option) => {
      expect(select.find(`option[value="${option.value}"]`).exists()).toBe(true);
    });

    await select.setValue('option2');
    expect(select.element.value).toBe('option2');
  });
});
