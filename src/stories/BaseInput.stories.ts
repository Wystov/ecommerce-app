import type { Meta, StoryObj } from '@storybook/vue3';

import BaseInput from '../components/shared/BaseInput.vue';

const meta: Meta<typeof BaseInput> = {
  component: BaseInput,
};

export default meta;
type Story = StoryObj<typeof BaseInput>;

export const Primary: Story = {
  render: (args) => ({
    components: { BaseInput },
    setup(): {} {
      return { args };
    },
    template: '<BaseInput v-bind="args" />',
  }),
  args: {

  },
};
