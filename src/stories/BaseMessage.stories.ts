import BaseMessage from '@/components/shared/BaseMessage.vue';

export default {
  title: 'Message',
  component: BaseMessage,
  tags: ['autodocs'],
  argTypes: {
    alert: {
      control: {
        type: 'select',
      },
      options: ['primary', 'warning', 'danger', 'success'],
    },
  },
};

export const Primary = {
  args: {
    alert: 'primary',
    title: 'Title',
    text: `Le Lorem Ipsum est simplement du faux texte
    employé dans la composition et la mise en page avant
    impression. Le Lorem Ipsum est le faux texte standard de
    l'imprimerie depuis les années 1500, quand un imprimeur anonyme
    assembla ensemble des morceaux de texte pour réaliser un livre
    spécimen de polices de texte`,
  },
};

export const Warning = {
  args: {
    alert: 'warning',
    text: `Le Lorem Ipsum est simplement du faux texte
    employé dans la composition et la mise en page avant
    impression. Le Lorem Ipsum est le faux texte standard de
    l'imprimerie depuis les années 1500, quand un imprimeur anonyme
    assembla ensemble des morceaux de texte pour réaliser un livre
    spécimen de polices de texte`,
  },
};

export const Success = {
  args: {
    alert: 'success',
    text: `Le Lorem Ipsum est simplement du faux texte
    employé dans la composition et la mise en page avant
    impression. Le Lorem Ipsum est le faux texte standard de
    l'imprimerie depuis les années 1500, quand un imprimeur anonyme
    assembla ensemble des morceaux de texte pour réaliser un livre
    spécimen de polices de texte`,
  },
};

export const Danger = {
  args: {
    alert: 'danger',
    text: `Le Lorem Ipsum est simplement du faux texte
    employé dans la composition et la mise en page avant
    impression. Le Lorem Ipsum est le faux texte standard de
    l'imprimerie depuis les années 1500, quand un imprimeur anonyme
    assembla ensemble des morceaux de texte pour réaliser un livre
    spécimen de polices de texte`,
  },
};

export const Rounded = {
  args: {
    rounded: true,
    text: `Le Lorem Ipsum est simplement du faux texte
    employé dans la composition et la mise en page avant
    impression. Le Lorem Ipsum est le faux texte standard de
    l'imprimerie depuis les années 1500, quand un imprimeur anonyme
    assembla ensemble des morceaux de texte pour réaliser un livre
    spécimen de polices de texte`,
  },
};
