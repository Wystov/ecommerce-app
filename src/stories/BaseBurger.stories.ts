import type { Meta, StoryObj } from '@storybook/vue3';

import BaseBurger from '@/components/shared/BaseBurger.vue';

const meta: Meta<typeof BaseBurger> = {
  title: 'Burger',
  component: BaseBurger,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BaseBurger>;

export const ClosedMenu: Story = {
  render: (args) => ({
    components: { BaseBurger },
    setup(): {} {
      return { args };
    },
    template: '<BaseBurger v-bind="args" />',
  }),
  args: {
    open: false,
  },
};

export const OpenMenu: Story = {
  render: (args) => ({
    components: { BaseBurger },
    setup(): {} {
      return { args };
    },
    template: '<BaseBurger v-bind="args" />',
  }),
  args: {
    open: true,
  },
};
