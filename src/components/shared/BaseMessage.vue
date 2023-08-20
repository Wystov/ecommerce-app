<template>
  <div class="message-field" :class="classes">
    <h3 v-if="title" class="title">{{ title }}</h3>
    <p class="message"><slot />{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { type BaseMessageClasses } from '@/types/types';

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
    absolute: {
      type: Boolean,
      default: false,
    },
    arrow: {
      type: String,
      default: '',
    },
  },
  computed: {
    classes(): BaseMessageClasses {
      return {
        primary: this.alert === 'primary',
        danger: this.alert === 'danger',
        warning: this.alert === 'warning',
        success: this.alert === 'success',
        rounded: this.rounded,
        absolute: this.absolute,
        arrowTop: this.arrow === 'top',
      };
    },
  },
};
</script>

<style scoped>
.message-field {
  --danger-bg: #f2dede;
  --danger-border: #ebccd1;
  --danger-font: #a94442;
  --success-bg: #dff0d8;
  --success-border: #d6e9c6;
  --success-font: #3c763d;
  --warning-bg: #fcf8e3;
  --warning-border: #faebcc;
  --warning-font: #8a6d3b;
  --primary-bg: #d9edf7;
  --primary-border: #bce8f1;
  --primary-font: #31708f;
}
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
.message-field.absolute {
  position: absolute;
  z-index: 2;
}
.message-field.arrowTop.absolute {
  margin-top: 8px;
}
.message-field.arrowTop.danger:before,
.message-field.arrowTop.danger:after {
  content: '';
  position: absolute;
  border-left: 10px solid rgba(0, 0, 0, 0);
  border-right: 10px solid rgba(0, 0, 0, 0);
  border-bottom: 10px solid var(--danger-border);
  top: -10px;
}
.message-field.arrowTop.danger:after {
  border-bottom: 10px solid var(--danger-bg);
  top: -9px;
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
  background-color: var(--primary-bg);
  border-color: var(--primary-border);
  color: var(--primary-font);
}
.warning {
  background-color: var(--warning-bg);
  border-color: var(--warning-border);
  color: var(--warning-font);
}
.success {
  background-color: var(--success-bg);
  border-color: var(--success-border);
  color: var(--success-font);
}
.danger {
  background-color: var(--danger-bg);
  border-color: var(--danger-border);
  color: var(--danger-font);
}
.rounded {
  border-radius: 1em;
}
</style>
