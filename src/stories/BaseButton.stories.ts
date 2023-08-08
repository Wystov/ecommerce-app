import BaseButton from '@/components/shared/BaseButton.vue';

export default {
  title: 'Button',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large'],
    },
  },
};

export const Dark = {
  args: {
    dark: true,
    label: 'Base Button',
    size: 'medium',
  },
};

export const Active = {
  args: {
    dark: true,
    active: true,
    label: 'Base Button',
    size: 'medium',
  },
};

export const Circle = {
  args: {
    circle: true,
    label: 'x',
    size: 'medium',
  },
};

export const Rounded = {
  args: {
    rounded: true,
    label: 'Base Button',
    size: 'medium',
  },
};

export const Disabled = {
  args: {
    disabled: true,
    label: 'Base Button',
    size: 'medium',
  },
};

export const Link = {
  args: {
    label: 'Link to app RSSchool',
    as: 'a',
    href: 'https://app.rs.school/',
    size: 'medium',
    dark: true,
  },
};
