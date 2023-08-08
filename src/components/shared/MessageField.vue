<script lang="ts">
import { type MessageFieldClasses } from '@/types/types';

export default {
  props: {
    alert: {
      type: String,
      default: 'primary',
    },
    text: { type: String, default: '' },
    title: { type: String, default: '' },
    rounded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes(): MessageFieldClasses {
      return {
        primary: this.alert === 'primary',
        danger: this.alert === 'danger',
        warning: this.alert === 'warning',
        success: this.alert === 'success',
        rounded: this.rounded,
      };
    },
  },
};
</script>

<template>
  <div class="message-field" :class="classes">
    <h3 v-show="title" class="title">{{ title }}</h3>
    <p class="message"><slot />{{ text }}</p>
  </div>
</template>

<style scoped>
.message-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4em;
  padding: 16px 24px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-family: Arial, Helvetica, sans-serif;
}
.title,
.message {
  padding: 0;
  margin: 0;
}
.message {
  text-align: justify;
}
.primary {
  background-color: #d9edf7;
  border-color: #bce8f1;
  color: #31708f;
}
.warning {
  background-color: #fcf8e3;
  border-color: #faebcc;
  color: #8a6d3b;
}
.success {
  background-color: #dff0d8;
  border-color: #d6e9c6;
  color: #3c763d;
}
.danger {
  background-color: #f2dede;
  border-color: #ebccd1;
  color: #a94442;
}
.rounded {
  border-radius: 1em;
}
</style>
