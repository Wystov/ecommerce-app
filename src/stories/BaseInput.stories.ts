import type { Meta, StoryObj } from '@storybook/vue3';

import BaseInput from '../components/shared/BaseInput.vue';

const meta: Meta<typeof BaseInput> = {
  title: 'Input',
  component: BaseInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BaseInput>;

export const LightMode: Story = {
  render: (args) => ({
    components: { BaseInput },
    setup(): {} {
      return { args };
    },
    template: '<BaseInput v-bind="args" />',
  }),
  args: {
    label: 'Type here:',
    name: 'Add something...',
  },
};

export const DarkMode: Story = {
  args: {
    label: 'Type here:',
    name: 'Add something...',
    isDark: true,
  },
};

export const Inactive: Story = {
  args: {
    label: 'Type here:',
    disabled: true,
  },
};

export const ValidValue: Story = {
  args: {
    valid: 'valid',
  },
};

export const InvalidValue: Story = {
  args: {
    valid: 'invalid',
  },
};
