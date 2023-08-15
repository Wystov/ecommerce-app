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
    id: 'story_one',
    label: 'Type here:',
    name: 'Add something...',
  },
};

export const DarkMode: Story = {
  args: {
    id: 'story_two',
    label: 'Type here:',
    name: 'Add something...',
    isDark: true,
  },
};

export const Inactive: Story = {
  args: {
    id: 'story_three',
    label: 'Type here:',
    disabled: true,
  },
};

export const ValidValue: Story = {
  args: {
    id: 'story_five',
    valid: 'valid',
  },
};

export const InvalidValue: Story = {
  args: {
    id: 'story_six',
    valid: 'invalid',
  },
};

export const PasswordHide: Story = {
  args: {
    id: 'story_seven',
    inputType: 'password',
    showPass: 'hide',
  },
};

export const PasswordShown: Story = {
  args: {
    id: 'story_eight',
    inputType: 'text',
    showPass: 'show',
  },
};
