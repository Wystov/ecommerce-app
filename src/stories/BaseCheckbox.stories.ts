import type { Meta, StoryObj } from '@storybook/vue3';

import BaseCheckbox from '../components/shared/BaseCheckbox.vue';

const meta: Meta<typeof BaseCheckbox> = {
  title: 'Checkbox',
  component: BaseCheckbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BaseCheckbox>;

export const LightMode: Story = {
  render: (args) => ({
    components: { BaseCheckbox },
    setup(): {} {
      return { args };
    },
    template: '<BaseCheckbox v-bind="args" />',
  }),
  args: {
    label: 'Option 1',
    id: 'checkbox',
    name: 'value',
  },
};

export const DarkMode: Story = {
  args: {
    label: 'Option 2',
    id: 'dark',
    name: 'value',
    isDark: true,
  },
};

export const Inactive: Story = {
  args: {
    label: 'Option 3',
    id: 'disabled',
    name: 'value',
    disabled: true,
  },
};
