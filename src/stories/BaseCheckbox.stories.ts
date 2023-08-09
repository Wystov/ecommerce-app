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
    checkboxArr: [
      {
        label: 'Option 1',
        id: 'checkbox',
        name: 'value',
      },
    ],
  },
};

export const DarkMode: Story = {
  args: {
    checkboxArr: [
      {
        label: 'Option 2',
        id: 'dark',
        name: 'value',
      },
    ],
    isDark: true,
  },
};

export const Inactive: Story = {
  args: {
    checkboxArr: [
      {
        label: 'Option 3',
        id: 'disabled',
        name: 'value',
      },
    ],
    disabled: true,
  },
};

export const MultiCheckbox: Story = {
  args: {
    checkboxArr: [
      {
        label: 'Option 1',
        id: 'checkbox-id-one',
        name: 'value-one',
      },
      {
        label: 'Option 2',
        id: 'checkbox-id-two',
        name: 'value-tree',
      },
      {
        label: 'Option 3',
        id: 'checkbox-id-three',
        name: 'value-three',
      },
    ],
  },
};
