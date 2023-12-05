import type { Meta, StoryObj } from '@storybook/vue3';

import BaseSelect from '../components/shared/BaseSelect.vue';

const meta: Meta<typeof BaseSelect> = {
  title: 'Select',
  component: BaseSelect,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BaseSelect>;

export const LightMode: Story = {
  render: (args) => ({
    components: { BaseSelect },
    setup(): {} {
      return { args };
    },
    template: '<BaseSelect v-bind="args" />',
  }),
  args: {
    label: 'Type here:',
    options: [
      { text: 'United States', value: 'US' },
      { text: 'United Kingdom', value: 'GB' },
    ],
    id: '1',
  },
};

export const DarkMode: Story = {
  args: {
    label: 'Type here:',
    isDark: true,
    options: [
      { text: 'United States', value: 'US' },
      { text: 'United Kingdom', value: 'GB' },
    ],
    id: '2',
  },
};

export const ValidValue: Story = {
  args: {
    valid: 'valid',
    options: [
      { text: 'United States', value: 'US' },
      { text: 'United Kingdom', value: 'GB' },
    ],
    id: '3',
  },
};

export const InvalidValue: Story = {
  args: {
    valid: 'invalid',
    options: [
      { text: 'United States', value: 'US' },
      { text: 'United Kingdom', value: 'GB' },
    ],
    id: '4',
  },
};
